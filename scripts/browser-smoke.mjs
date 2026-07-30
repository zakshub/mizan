import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const browserPath = chromeCandidates.find(existsSync);
const targetUrl = process.argv[2] || "http://localhost:3000";

if (!browserPath) {
  throw new Error("Chrome or Edge was not found.");
}

const browserDataDir = mkdtempSync(join(tmpdir(), "mizan-browser-smoke-"));
const browser = spawn(
  browserPath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${browserDataDir}`,
    "--remote-debugging-port=0",
    "about:blank",
  ],
  { stdio: "ignore" },
);

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForDevTools() {
  const activePortFile = join(browserDataDir, "DevToolsActivePort");

  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (existsSync(activePortFile)) {
      const [port] = readFileSync(activePortFile, "utf8").trim().split(/\r?\n/);
      return port;
    }
    await wait(100);
  }

  throw new Error("Browser DevTools endpoint did not become ready.");
}

let socket;

try {
  const port = await waitForDevTools();
  const targetResponse = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`,
    { method: "PUT" },
  );
  const target = await targetResponse.json();

  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let commandId = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) {
      return;
    }

    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) {
      reject(new Error(message.error.message));
      return;
    }
    resolve(message.result);
  });

  function command(method, params = {}) {
    commandId += 1;
    socket.send(JSON.stringify({ id: commandId, method, params }));
    return new Promise((resolve, reject) => {
      pending.set(commandId, { resolve, reject });
    });
  }

  async function evaluate(expression) {
    const result = await command("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });

    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text);
    }
    return result.result.value;
  }

  async function clickButton(label) {
    let clicked = false;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      clicked = await evaluate(`
        (() => {
          const button = [...document.querySelectorAll("button")]
            .find((item) => item.textContent.includes(${JSON.stringify(label)}));
          if (!button) return false;
          button.click();
          return true;
        })()
      `);
      if (clicked) {
        break;
      }
      await wait(100);
    }

    if (!clicked) {
      throw new Error(`Button not found: ${label}`);
    }
    await wait(150);
  }

  async function runtimeState() {
    return evaluate(`
      (() => {
        const values = [...document.querySelectorAll(".runtime-meta strong")]
          .map((item) => item.textContent.trim());
        return {
          status: values[0],
          round: values[1],
          currentAgent: values[2],
          currentTurn: document.querySelector(".runtime-turn p")?.textContent.trim(),
          historyCount: document.querySelectorAll(".runtime-history-item").length,
        };
      })()
    `);
  }

  async function buttonIsDisabled(label) {
    return evaluate(`
      [...document.querySelectorAll("button")]
        .find((item) => item.textContent.includes(${JSON.stringify(label)}))?.disabled ?? null
    `);
  }

  function assertState(actual, expected, step) {
    for (const [key, value] of Object.entries(expected)) {
      if (actual[key] !== value) {
        throw new Error(
          `${step}: expected ${key}=${JSON.stringify(value)}, received ${JSON.stringify(actual[key])}`,
        );
      }
    }
    console.log(`PASS ${step}`, actual);
  }

  await command("Runtime.enable");
  await wait(1_000);

  await clickButton("Reset");
  assertState(await runtimeState(), { status: "Draft", round: "1 / 3" }, "reset");
  if (!(await buttonIsDisabled("Pause")) || !(await buttonIsDisabled("Advance Round"))) {
    throw new Error("reset: invalid draft actions must be disabled");
  }

  await clickButton("Start Debate");
  assertState(
    await runtimeState(),
    { status: "Live", round: "1 / 3", currentAgent: "Pro" },
    "start",
  );
  if (!(await buttonIsDisabled("Start Debate")) || (await buttonIsDisabled("Pause"))) {
    throw new Error("start: start must disable and pause must enable");
  }

  await clickButton("Pause");
  assertState(await runtimeState(), { status: "Paused" }, "pause");

  await clickButton("Resume");
  assertState(await runtimeState(), { status: "Live", currentAgent: "Pro" }, "resume");

  await clickButton("Advance Round");
  assertState(
    await runtimeState(),
    { status: "Live", round: "2 / 3", currentAgent: "Counter" },
    "advance",
  );

  await clickButton("Advance Round");
  assertState(
    await runtimeState(),
    { status: "Complete", round: "3 / 3", currentAgent: "Judge" },
    "complete",
  );

  await clickButton("Rounds");
  const roundsSetting = await evaluate(
    `[...document.querySelectorAll(".setting-row")].find((item) => item.textContent.includes("Rounds"))?.textContent`,
  );
  if (!roundsSetting?.includes("4")) {
    throw new Error(`settings: expected rounds to cycle to 4, received ${roundsSetting}`);
  }

  await clickButton("Evidence");
  const activeTab = await evaluate(`document.querySelector(".tab.active")?.textContent.trim()`);
  if (!activeTab?.startsWith("Evidence")) {
    throw new Error(`tabs: expected Evidence to be active, received ${activeTab}`);
  }
  console.log("PASS settings-and-tabs", { rounds: 4, activeTab: "Evidence" });
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.close();
  }
  browser.kill();
  await wait(500);
  try {
    rmSync(browserDataDir, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  } catch {
    // Chrome can briefly retain profile files on Windows after process exit.
  }
}
