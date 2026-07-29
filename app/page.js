"use client";

import { useEffect, useState } from "react";
import {
  appChrome,
  buildJsonExport,
  buildMarkdownExport,
  createRuntime,
  deriveRuntimeStatus,
  seedChannel,
  storageKey,
} from "../lib/seed.js";

function stampNow() {
  return new Date().toLocaleTimeString("en-PK", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function pushHistory(runtime, role, text) {
  return {
    ...runtime,
    history: [
      ...runtime.history,
      {
        id: `${runtime.history.length + 1}-${Date.now()}`,
        role,
        text,
        stamp: stampNow(),
      },
    ],
  };
}

function nextRoundIndex(runtime) {
  return Math.min(runtime.roundIndex + 1, runtime.rounds - 1);
}

function nextOption(current, options) {
  const currentIndex = options.indexOf(current);
  return options[(currentIndex + 1) % options.length];
}

function reducer(runtime, action) {
  switch (action.type) {
    case "hydrate":
      return action.runtime;
    case "set-topic":
      return {
        ...runtime,
        topic: action.topic,
        channelSlug: action.channelSlug || runtime.channelSlug,
        status: "draft",
        currentTurn: {
          role: "System",
          text: "Topic updated. Start the debate when ready.",
        },
      };
    case "set-rounds":
      return {
        ...runtime,
        rounds: action.rounds,
        roundIndex: Math.min(runtime.roundIndex, action.rounds - 1),
      };
    case "toggle-evidence":
      return { ...runtime, evidenceMode: !runtime.evidenceMode };
    case "set-language":
      return { ...runtime, language: action.language };
    case "set-tone":
      return { ...runtime, tone: action.tone };
    case "set-model-quality":
      return { ...runtime, modelQuality: action.modelQuality };
    case "set-note":
      return { ...runtime, note: action.note };
    case "start":
      return pushHistory(
        {
          ...runtime,
          status: "running",
          roundIndex: 0,
          activeAgentIndex: 0,
          completedAt: null,
          currentTurn: {
            role: appChrome.agents[0].name,
            text: `Round 1 opened for ${runtime.topic}`,
          },
        },
        "System",
        "Debate started with opening round.",
      );
    case "pause":
      return pushHistory(
        {
          ...runtime,
          status: "paused",
          currentTurn: { role: "System", text: "Debate paused by user." },
        },
        "System",
        "Conversation paused.",
      );
    case "resume":
      return pushHistory(
        {
          ...runtime,
          status: "running",
          currentTurn: {
            role: appChrome.agents[runtime.activeAgentIndex].name,
            text: "Resuming the active round from the latest evidence point.",
          },
        },
        "System",
        "Conversation resumed.",
      );
    case "interject": {
      const interjections = runtime.interjections + 1;
      return pushHistory(
        {
          ...runtime,
          interjections,
          status: interjections > 1 ? "clarifying" : runtime.status,
          note: action.text || runtime.note || "User asked for a clarification pass.",
          currentTurn: {
            role: "User",
            text: action.text || "Please clarify the biggest unresolved risk.",
          },
        },
        "User",
        action.text || "Please clarify the biggest unresolved risk.",
      );
    }
    case "advance": {
      const roundIndex = nextRoundIndex(runtime);
      const nextAgent = appChrome.agents[(runtime.activeAgentIndex + 1) % appChrome.agents.length];
      const completed = roundIndex === runtime.rounds - 1;
      return pushHistory(
        {
          ...runtime,
          roundIndex,
          activeAgentIndex: (runtime.activeAgentIndex + 1) % appChrome.agents.length,
          status: completed ? "completed" : "running",
          currentTurn: {
            role: completed ? "Judge" : nextAgent.name,
            text: completed
              ? "Judge synthesized the final recommendation."
              : `Round ${roundIndex + 1} prepared for ${nextAgent.name}.`,
          },
          completedAt: completed ? stampNow() : runtime.completedAt,
        },
        nextAgent.name,
        action.text,
      );
    }
    case "stop":
      return pushHistory(
        {
          ...runtime,
          status: "completed",
          completedAt: stampNow(),
          currentTurn: {
            role: "System",
            text: "Debate stopped and frozen for review.",
          },
        },
        "System",
        "Debate stopped by user.",
      );
    case "reset":
      return createRuntime();
    default:
      return runtime;
  }
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Badge({ status }) {
  return <span className={`icon-badge icon-${status.toLowerCase()}`}>{badgeLabel(status)}</span>;
}

function badgeLabel(status) {
  switch (status) {
    case "running":
    case "debating":
      return "Live";
    case "paused":
      return "Paused";
    case "completed":
      return "Complete";
    case "clarifying":
      return "Clarifying";
    default:
      return "Draft";
  }
}

function AgentCard({ agent }) {
  return (
    <article className={`agent-card agent-${agent.tone}`}>
      <div className="agent-icon">{agent.short}</div>
      <div className="agent-copy">
        <strong>{agent.name}</strong>
        <span>{agent.role}</span>
      </div>
    </article>
  );
}

function DebateCard({ item }) {
  return (
    <article className={`debate-card debate-${item.tone}`}>
      <div className="debate-head">
        <div className="debate-persona">
          <div className="debate-avatar">{item.avatar}</div>
          <div>
            <div className="debate-title">
              <strong>{item.title}</strong>
              <span className="ai-pill">AI</span>
            </div>
            <p>{item.subtitle}</p>
          </div>
        </div>
        <div className="debate-meta">
          <span>{item.time}</span>
          <button className="ghost-icon" type="button">
            ⋮
          </button>
        </div>
      </div>
      <div className="debate-body">
        {item.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="debate-actions">
        <button className="ghost-btn" type="button">
          👍 {item.likes}
        </button>
        <button className="ghost-btn" type="button">
          👎
        </button>
      </div>
    </article>
  );
}

function SettingRow({ label, value, onClick }) {
  return (
    <button type="button" className="setting-row setting-row-button" onClick={onClick}>
      <div className="setting-label">
        <span className="setting-dot" />
        <strong>{label}</strong>
      </div>
      <div className="setting-value">
        <span>{value}</span>
        <span className="chev">›</span>
      </div>
    </button>
  );
}

function RuntimeLog({ runtime }) {
  return (
    <section className="panel runtime-panel">
      <div className="panel-titlebar">
        <h2>Live Runtime</h2>
        <button className="ghost-icon" type="button">
          i
        </button>
      </div>
      <div className="runtime-meta">
        <div>
          <span className="runtime-label">Status</span>
          <strong>{badgeLabel(runtime.status)}</strong>
        </div>
        <div>
          <span className="runtime-label">Round</span>
          <strong>
            {runtime.roundIndex + 1} / {runtime.rounds}
          </strong>
        </div>
        <div>
          <span className="runtime-label">Current Agent</span>
          <strong>{runtime.currentTurn.role}</strong>
        </div>
      </div>
      <div className="runtime-turn">
        <span className="runtime-label">Current Turn</span>
        <p>{runtime.currentTurn.text}</p>
      </div>
      <div className="runtime-history">
        <span className="runtime-label">History</span>
        <div className="runtime-history-list">
          {runtime.history.map((entry) => (
            <article key={entry.id} className="runtime-history-item">
              <div className="runtime-history-head">
                <strong>{entry.role}</strong>
                <span>{entry.stamp}</span>
              </div>
              <p>{entry.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [runtime, setRuntime] = useState(() => createRuntime());
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Debate");

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setRuntime((current) => {
          const parsed = JSON.parse(saved);
          return { ...current, ...parsed, history: parsed.history || current.history };
        });
      }
    } catch {
      // Ignore storage failures and continue with the seed state.
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(runtime));
    } catch {
      // Ignore storage failures in private or restricted browser modes.
    }
  }, [mounted, runtime]);

  const status = deriveRuntimeStatus(runtime);
  const debateIsActive = runtime.status === "running" || runtime.status === "clarifying";
  const canStart = runtime.status === "draft" || runtime.status === "completed";
  const decisionTitle =
    runtime.status === "completed" ? "Final recommendation frozen" : "Live decision room";

  return (
    <main className="app-shell">
      <aside className="left-rail">
        <div className="brand-bar">
          <div className="brand-mark">
            <span className="brand-m">M</span>
          </div>
          <div>
            <strong>Mizan</strong>
            <span>Decision Room</span>
          </div>
        </div>

        <div className="rail-section">
          <div className="rail-kicker">Workspace</div>
          <div className="workspace-row">
            <div className="workspace-icon">◫</div>
            <div>
              <strong>Mizan Workspace</strong>
            </div>
            <span className="chev">⌄</span>
          </div>
        </div>

        <div className="rail-section">
          <div className="rail-kicker with-plus">
            <span>Channels</span>
            <button className="ghost-icon" type="button">
              +
            </button>
          </div>
          <div className="channel-list">
            {appChrome.channels.map((channel) => (
              <button
                key={channel}
                type="button"
                className={`channel-item ${channel === runtime.channelSlug ? "active" : ""}`}
                onClick={() => setRuntime((current) => reducer(current, { type: "set-topic", topic: seedChannel.topic, channelSlug: channel }))}
              >
                <span className="hash">#</span>
                <span>{channel}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rail-section">
          <div className="rail-kicker">Active Agents</div>
          <div className="agent-list">
            {appChrome.agents.map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        </div>

        <div className="status-card">
          <span className="status-dot" />
          <div>
            <strong>System Online</strong>
            <p>All agent roles ready</p>
          </div>
          <svg viewBox="0 0 80 20" aria-hidden="true">
            <path d="M0 14h8l4-8 4 10 5-14 7 12 5-4 4 6 5-10 6 8 4-6 4 2 5-4 4 8 6-2" />
          </svg>
        </div>

        <div className="profile-card">
          <div className="avatar-circle">ZK</div>
          <div>
            <strong>Zuhaib Khan</strong>
            <p>Pro Plan</p>
          </div>
          <span className="chev">›</span>
        </div>
      </aside>

      <section className="main-stage">
        <header className="top-nav">
          <div className="channel-switcher">
            <strong>#{runtime.channelSlug}</strong>
            <span className="chev">⌄</span>
          </div>

          <nav className="tab-nav" aria-label="Primary">
            {["Debate", "Evidence", "Analytics", "History"].map((item) => (
              <button
                key={item}
                type="button"
                className={item === activeTab ? "tab active" : "tab"}
                onClick={() => setActiveTab(item)}
              >
                {item}
                {item === "Evidence" ? <span className="tab-pill">{runtime.evidence.length}</span> : null}
              </button>
            ))}
          </nav>

          <div className="top-actions">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="text"
                value={runtime.topic}
                onChange={(event) => setRuntime((current) => reducer(current, { type: "set-topic", topic: event.target.value }))}
                placeholder="Search..."
                aria-label="Search or rename topic"
              />
              <kbd>⌘K</kbd>
            </label>
            <button className="ghost-icon" type="button">
              🔔
            </button>
            <button className="ghost-icon" type="button">
              ?
            </button>
            <div className="avatar-pill">ZK</div>
          </div>
        </header>

        <div className="content-grid">
          <div className="center-column">
            <RuntimeLog runtime={runtime} />

            <div className="topic-card">
              <div className="topic-hash">#</div>
              <div className="topic-copy">
                <h1>{runtime.topic}</h1>
                <div className="topic-meta">
                  <Badge status={status} />
                  <span>Round {runtime.roundIndex + 1} of {runtime.rounds}</span>
                  <span>⏱ {seedChannel.elapsed}</span>
                  <span>{appChrome.agents.length} Agents</span>
                  <span className="tiny-icons">
                    <span>⚖</span>
                    <span>🛡</span>
                    <span>⚡</span>
                    <span>◌</span>
                  </span>
                </div>
              </div>
              <div className="topic-actions">
                <button className="ghost-icon" type="button" onClick={() => setRuntime((current) => reducer(current, { type: "interject", text: "What is the biggest unresolved blocker?" }))}>
                  ☆
                </button>
                <button className="ghost-icon" type="button">
                  ↗
                </button>
                <button className="ghost-icon" type="button">
                  ⋮
                </button>
              </div>
            </div>

            <div className="control-grid">
              <label className="control">
                <span>Rounds</span>
                <select value={runtime.rounds} onChange={(event) => setRuntime((current) => reducer(current, { type: "set-rounds", rounds: Number(event.target.value) }))}>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="control">
                <span>Language</span>
                <select value={runtime.language} onChange={(event) => setRuntime((current) => reducer(current, { type: "set-language", language: event.target.value }))}>
                  {["English", "Urdu", "Roman Urdu"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="control">
                <span>Tone</span>
                <select value={runtime.tone} onChange={(event) => setRuntime((current) => reducer(current, { type: "set-tone", tone: event.target.value }))}>
                  {["Balanced", "Direct", "Cautious"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className={`control toggle ${runtime.evidenceMode ? "on" : ""}`} onClick={() => setRuntime((current) => reducer(current, { type: "toggle-evidence" }))}>
                Evidence Mode: {runtime.evidenceMode ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="composer-card">
              <textarea
                className="composer-input"
                value={runtime.note}
                onChange={(event) => setRuntime((current) => reducer(current, { type: "set-note", note: event.target.value }))}
                placeholder="Draft a topic, capture an interjection, or write a clarification note..."
              />
              <div className="composer-row">
                <button className="ghost-btn plus-btn" type="button" onClick={() => setRuntime((current) => reducer(current, { type: "interject", text: current.note || "Please clarify the biggest unresolved risk." }))}>
                  ＋
                </button>
                <button className="ghost-btn" type="button">
                  Templates ▾
                </button>
                <div className="composer-tools">
                  <button className="ghost-btn" type="button">
                    🎙 Voice ▾
                  </button>
                  <button className="ghost-btn" type="button">
                    🌐 {runtime.language} ▾
                  </button>
                  <button
                    className="start-btn"
                    type="button"
                    disabled={!canStart}
                    onClick={() => setRuntime((current) => reducer(current, { type: "start" }))}
                  >
                    ▶ Start Debate
                  </button>
                </div>
              </div>
              <div className="footer-actions">
                <button
                  className="footer-btn"
                  type="button"
                  disabled={!debateIsActive}
                  onClick={() => setRuntime((current) => reducer(current, { type: "pause" }))}
                >
                  ⏸ Pause
                </button>
                <button
                  className="footer-btn"
                  type="button"
                  disabled={runtime.status !== "paused"}
                  onClick={() => setRuntime((current) => reducer(current, { type: "resume" }))}
                >
                  ▶ Resume
                </button>
                <button
                  className="footer-btn danger"
                  type="button"
                  disabled={!debateIsActive && runtime.status !== "paused"}
                  onClick={() => setRuntime((current) => reducer(current, { type: "stop" }))}
                >
                  ■ Stop Debate
                </button>
                <button className="footer-btn" type="button" onClick={() => downloadFile("mizan-decision-room.json", buildJsonExport(runtime), "application/json")}>
                  JSON Export
                </button>
                <button className="footer-btn" type="button" onClick={() => downloadFile("mizan-decision-room.md", buildMarkdownExport(runtime), "text/markdown")}>
                  Markdown Export
                </button>
                <button className="footer-btn" type="button" onClick={() => setRuntime(createRuntime())}>
                  Reset
                </button>
              </div>
            </div>

            <div className="debate-stack">
                {seedChannel.debate.map((item) => (
                  <DebateCard key={item.title} item={item} />
                ))}
              </div>
            </div>

          <aside className="right-column">
            <section className="panel">
              <div className="panel-titlebar">
                <h2>Debate Settings</h2>
                <button className="ghost-icon" type="button">
                  ⚙
                </button>
              </div>
              <div className="settings-list">
                {appChrome.settings.map((setting) => (
                  <SettingRow
                    key={setting.key}
                    label={setting.label}
                    value={
                      setting.key === "rounds"
                        ? String(runtime.rounds)
                        : setting.key === "tone"
                          ? runtime.tone
                          : setting.key === "evidenceMode"
                            ? runtime.evidenceMode
                              ? "Enabled"
                              : "Disabled"
                            : setting.key === "language"
                              ? runtime.language
                              : setting.key === "modelQuality"
                                ? runtime.modelQuality
                                : setting.value
                    }
                    onClick={() => {
                      const actions = {
                        rounds: {
                          type: "set-rounds",
                          rounds: runtime.rounds === 6 ? 1 : runtime.rounds + 1,
                        },
                        tone: {
                          type: "set-tone",
                          tone: nextOption(runtime.tone, ["Balanced", "Direct", "Cautious"]),
                        },
                        evidenceMode: { type: "toggle-evidence" },
                        language: {
                          type: "set-language",
                          language: nextOption(runtime.language, ["English", "Urdu", "Roman Urdu"]),
                        },
                        modelQuality: {
                          type: "set-model-quality",
                          modelQuality: nextOption(runtime.modelQuality, ["High", "Balanced", "Fast"]),
                        },
                      };
                      if (actions[setting.key]) {
                        setRuntime((current) => reducer(current, actions[setting.key]));
                      }
                    }}
                  />
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-titlebar">
                <h2>Decision Summary</h2>
                <button className="ghost-icon" type="button">
                  ⌂
                </button>
              </div>
              <div className="summary-card">
                <div className="summary-head">
                  <div className="summary-label">
                    <span className="icon-badge icon-summary">⚖</span>
                    <strong>Current Lean</strong>
                  </div>
                  <span className="lean-pill">Lean Yes</span>
                </div>
                <p>{runtime.summary}</p>
                <div className="confidence-row">
                  <strong>Confidence</strong>
                  <span>{runtime.confidence}%</span>
                </div>
                <div className="confidence-bar">
                  <span style={{ width: `${runtime.confidence}%` }} />
                </div>
              </div>

              <div className="summary-group">
                <h3>Runtime State</h3>
                <ul>
                  <li>
                    <span className="info-circle">?</span>
                    {decisionTitle}
                  </li>
                  <li>
                    <span className="info-circle">?</span>
                    Interjections used: {runtime.interjections}
                  </li>
                  <li>
                    <span className="info-circle">?</span>
                    Completed at: {runtime.completedAt || "Not finished yet"}
                  </li>
                </ul>
              </div>

              <div className="summary-group">
                <h3>Key Risks</h3>
                <ul>
                  {runtime.risks.map((risk) => (
                    <li key={risk}>
                      <span className="warn-triangle">⚠</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="summary-group">
                <h3>What's Missing</h3>
                <ul>
                  {runtime.missingInformation.map((item) => (
                    <li key={item}>
                      <span className="info-circle">?</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="summary-group">
                <h3>Evidence</h3>
                <ul>
                  {runtime.evidence.map((item) => (
                    <li key={item}>
                      <span className="info-circle">?</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="next-step-card">
                <div className="next-step-title">
                  <span>→</span>
                  <strong>Next Step</strong>
                </div>
                <p>{runtime.nextAction}</p>
              </div>

              <button
                className="analysis-btn"
                type="button"
                disabled={!debateIsActive}
                onClick={() => setRuntime((current) => reducer(current, { type: "advance", text: "Next round advanced automatically." }))}
              >
                Advance Round ›
              </button>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
