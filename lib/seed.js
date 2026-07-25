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
  debate: [
    {
      title: "Pro",
      subtitle: "The role aligns strongly with your UX and ecommerce background. The scope covers end-to-end customer journeys across B2B, multiple properties, and mobile.",
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
      subtitle: "Key risks: salary band is unknown, budget not finalized, and it is a strict night shift that may impact health and work-life balance.",
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
      subtitle: "Both sides raise valid points. The opportunity offers strong alignment and growth potential, but compensation clarity and shift preference are critical concerns.",
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

export const appChrome = {
  channels: ["job-negotiation", "career-decisions", "investing", "health", "general"],
  agents: [
    { name: "Pro", role: "Arguing in favor", tone: "pro", short: "⚖" },
    { name: "Counter", role: "Arguing with caution", tone: "counter", short: "🛡" },
    { name: "Judge", role: "Neutral arbiter", tone: "judge", short: "⚒" },
    { name: "Evidence", role: "Gathering & verifying", tone: "evidence", short: "◌" },
  ],
  settings: [
    { label: "Rounds", value: "3" },
    { label: "Tone", value: "Balanced" },
    { label: "Evidence Mode", value: "Enabled" },
    { label: "Language", value: "English" },
    { label: "Model Quality", value: "High" },
  ],
};

export const workspaceStats = [
  { label: "Rounds", value: "3" },
  { label: "Confidence", value: "72%" },
  { label: "Risk", value: "Moderate" },
  { label: "Mode", value: "Career Pack" },
];
