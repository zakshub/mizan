import test from "node:test";
import assert from "node:assert/strict";
import { seedChannel, workspaceStats } from "../lib/seed.js";

test("seed channel exposes a conditional verdict", () => {
  assert.equal(seedChannel.verdict, "PROCEED CONDITIONALLY");
  assert.ok(seedChannel.missingInformation.length >= 3);
});

test("workspace stats are present", () => {
  assert.equal(workspaceStats.length, 4);
  assert.equal(workspaceStats[0].label, "Rounds");
});
