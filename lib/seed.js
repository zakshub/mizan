export const storageKey = "mizan.decision-room.v1";

export const appChrome = {
  channels: ["job-negotiation", "career-decisions", "investing", "health", "general"],
  agents: [
    { name: "Pro", role: "Arguing in favor", tone: "pro", short: "⚖" },
    { name: "Counter", role: "Arguing with caution", tone: "counter", short: "🛡" },
    { name: "Judge", role: "Neutral arbiter", tone: "judge", short: "⚒" },
    { name: "Evidence", role: "Gathering & verifying", tone: "evidence", short: "◌" },
  ],
  settings: [
    { key: "rounds", label: "Rounds", value: "3" },
    { key: "tone", label: "Tone", value: "Balanced" },
    { key: "evidenceMode", label: "Evidence Mode", value: "Enabled" },
    { key: "language", label: "Language", value: "English" },
    { key: "modelQuality", label: "Model Quality", value: "High" },
  ],
};

export const seedChannel = {
  slug: "job-negotiation",
  topic: "Should I proceed with the Senior UX / Ecommerce Designer opportunity?",
  verdict: "PROCEED CONDITIONALLY",
  elapsed: "00:08:42",
  summary:
    "Proceed to negotiate with clear compensation and shift clarity. The role is a strong fit, but fixed night hours and undefined salary need explicit boundaries.",
  nextAction:
    "Request a call to clarify compensation range, shift policy, and scope before committing further.",
  missingInformation: [
    "Specific monthly compensation range",
    "Shift flexibility / rotation details",
    "Performance expectations & KPIs",
    "Benefits and allowances",
  ],
  risks: [
    "Salary range not yet defined",
    "Night shift (6 PM - 3 AM PST)",
    "Potential for scope creep",
  ],
  roundPlan: [
    {
      id: "opening",
      label: "Opening",
      role: "Pro",
      summary: "Opening case for the opportunity and its fit.",
    },
    {
      id: "risk",
      label: "Risk Scan",
      role: "Counter",
      summary: "Market, health, and scope concerns.",
    },
    {
      id: "judge",
      label: "Judge",
      role: "Judge",
      summary: "Balanced recommendation and next step.",
    },
  ],
  evidence: [
    "Remote role with broad ecommerce ownership.",
    "Salary range still unconfirmed.",
    "Night shift is a non-trivial life-style constraint.",
    "Budget openness gives room for negotiation.",
  ],
  debate: [
    {
      title: "Pro",
      subtitle:
        "The role aligns strongly with your UX and ecommerce background. The scope covers end-to-end customer journeys across B2B, multiple properties, and mobile.",
      avatar: "⚖",
      time: "12:41 PM",
      likes: 2,
      tone: "pro",
      body: [
        "It is a remote role with high-shift allowance potential and open budget, which gives room for a strong negotiation.",
      ],
    },
    {
      title: "Counter",
      subtitle:
        "Key risks: salary band is unknown, budget not finalized, and it is a strict night shift that may impact health and work-life balance.",
      avatar: "🛡",
      time: "12:42 PM",
      likes: 2,
      tone: "counter",
      body: [
        "The role demands deep ecommerce expertise across many areas - high expectations could lead to scope creep without clear boundaries.",
      ],
    },
    {
      title: "Judge",
      subtitle:
        "Both sides raise valid points. The opportunity offers strong alignment and growth potential, but compensation clarity and shift preference are critical concerns.",
      avatar: "⚒",
      time: "12:44 PM",
      likes: 3,
      tone: "judge",
      body: [
        "Strongest points:",
        "Pro: Excellent role fit, broad ecommerce ownership, remote, open budget.",
        "Counter: Undefined salary, night shift impact, high scope and expectations.",
        "Recommendation: Proceed to negotiate - seek a clear compensation range, confirm shift flexibility or rotation, and align on scope & success metrics.",
      ],
    },
    {
      title: "Evidence",
      subtitle: "Gathering market data for Senior UX / Ecommerce Designer (Remote, Pakistan) and night shift differentials...",
      avatar: "◌",
      time: "12:44 PM",
      likes: 0,
      tone: "evidence",
      body: ["Collecting salary benchmarks, role scope, and shift impact data..."],
    },
  ],
};

export const initialRuntime = {
  channelSlug: seedChannel.slug,
  topic: seedChannel.topic,
  language: "English",
  rounds: 3,
  evidenceMode: true,
  tone: "Balanced",
  modelQuality: "High",
  status: "draft",
  roundIndex: 0,
  activeAgentIndex: 0,
  interjections: 0,
  confidence: 72,
  note: "",
  history: [
    {
      id: "seed-1",
      role: "System",
      text: "Seeded debate room loaded from docs and local spec.",
      stamp: "12:40 PM",
    },
  ],
  currentTurn: {
    role: "System",
    text: "Draft a topic or run the seeded job-negotiation scenario.",
  },
  summary: seedChannel.summary,
  verdict: seedChannel.verdict,
  nextAction: seedChannel.nextAction,
  missingInformation: seedChannel.missingInformation,
  risks: seedChannel.risks,
  evidence: seedChannel.evidence,
  completedAt: null,
};

export function createRuntime(overrides = {}) {
  return {
    ...structuredClone(initialRuntime),
    ...overrides,
    history: overrides.history ? [...overrides.history] : [...initialRuntime.history],
    missingInformation: overrides.missingInformation
      ? [...overrides.missingInformation]
      : [...initialRuntime.missingInformation],
    risks: overrides.risks ? [...overrides.risks] : [...initialRuntime.risks],
    evidence: overrides.evidence ? [...overrides.evidence] : [...initialRuntime.evidence],
  };
}

export function nextRoundIndex(runtime) {
  return Math.min(runtime.roundIndex + 1, runtime.rounds - 1);
}

export function buildMarkdownExport(runtime) {
  const lines = [
    "# Mizan Decision Room Export",
    "",
    `## Topic`,
    runtime.topic,
    "",
    `## Verdict`,
    runtime.verdict,
    "",
    `## Summary`,
    runtime.summary,
    "",
    "## Risks",
    ...runtime.risks.map((item) => `- ${item}`),
    "",
    "## Missing Information",
    ...runtime.missingInformation.map((item) => `- ${item}`),
    "",
    "## Debate Log",
    ...runtime.history.map((entry) => `- [${entry.stamp}] ${entry.role}: ${entry.text}`),
  ];

  return `${lines.join("\n")}\n`;
}

export function buildJsonExport(runtime) {
  return JSON.stringify(
    {
      topic: runtime.topic,
      channelSlug: runtime.channelSlug,
      status: runtime.status,
      rounds: runtime.rounds,
      verdict: runtime.verdict,
      summary: runtime.summary,
      nextAction: runtime.nextAction,
      risks: runtime.risks,
      missingInformation: runtime.missingInformation,
      history: runtime.history,
      evidence: runtime.evidence,
    },
    null,
    2,
  );
}

export function deriveRuntimeStatus(runtime) {
  if (runtime.status === "completed") {
    return "completed";
  }
  if (runtime.status === "clarifying") {
    return "clarifying";
  }
  if (runtime.status === "running") {
    return "debating";
  }
  if (runtime.status === "paused") {
    return "paused";
  }
  return "draft";
}
