import test from "node:test";
import assert from "node:assert/strict";
import {
  buildJsonExport,
  buildMarkdownExport,
  createRuntime,
  deriveRuntimeStatus,
  seedChannel,
} from "../lib/seed.js";

test("seed channel keeps the structured decision room data", () => {
  assert.equal(seedChannel.verdict, "PROCEED CONDITIONALLY");
  assert.ok(seedChannel.roundPlan.length >= 3);
  assert.ok(seedChannel.evidence.length >= 3);
});

test("runtime export helpers serialize the live decision room", () => {
  const runtime = createRuntime();
  const markdown = buildMarkdownExport(runtime);
  const json = JSON.parse(buildJsonExport(runtime));

  assert.match(markdown, /# Mizan Decision Room Export/);
  assert.equal(json.topic, runtime.topic);
  assert.equal(json.status, runtime.status);
  assert.ok(Array.isArray(json.history));
});

test("runtime status derivation follows the lifecycle", () => {
  assert.equal(deriveRuntimeStatus(createRuntime()), "draft");
  assert.equal(deriveRuntimeStatus(createRuntime({ status: "running" })), "debating");
  assert.equal(deriveRuntimeStatus(createRuntime({ status: "clarifying" })), "clarifying");
  assert.equal(deriveRuntimeStatus(createRuntime({ status: "paused" })), "paused");
  assert.equal(deriveRuntimeStatus(createRuntime({ status: "completed" })), "completed");
});
