export const seedChannel = {
  topic: "Should I proceed with the Senior UX / Ecommerce Designer opportunity?",
  verdict: "PROCEED CONDITIONALLY",
  headline: "The role is relevant enough for a screening call, but the night schedule and compensation need explicit clarification.",
  reason:
    "The opportunity is strategically close to the user's profile, but permanent Pakistan-hours work changes the cost of the decision and should be priced before commitment.",
  nextAction:
    "Take the first call, but do not disclose current salary as the anchor. Ask for total package, employment structure, schedule expectations, and whether the budget is genuinely open.",
  doNotDisclose:
    "Current salary, compensation floor, and any willingness to accept fixed night hours without a proper premium.",
  missingInformation: [
    "Direct employment versus agency or contract intermediary.",
    "Exact compensation structure, benefits, and currency basis.",
    "Whether the 6 PM to 3 AM schedule is fixed or negotiable.",
  ],
  messages: [
    {
      id: "thesis-1",
      role: "Thesis",
      title: "Why the call is worth taking",
      meta: "Opening case in favour",
      tone: "positive",
      body: [
        "The scope overlaps with ecommerce UX, product pages, checkout, delivery communication, and multi-property consistency.",
        "The role can reveal whether the opportunity is strategically better than the current work instead of forcing a blind rejection.",
      ],
    },
    {
      id: "antithesis-1",
      role: "Antithesis",
      title: "Why caution is required",
      meta: "Opening case against",
      tone: "caution",
      body: [
        "Permanent Pakistan-hours are not a minor inconvenience; they are a lifestyle and productivity cost.",
        "An undefined budget plus recruiter optimism is not evidence of a good package.",
      ],
    },
    {
      id: "evidence-1",
      role: "Evidence",
      title: "What is actually known",
      meta: "Claim ledger",
      tone: "verify",
      body: [
        "Recruiter contacted the user directly.",
        "Remote role at ATC Holdings.",
        "Scope includes B2B ecommerce journeys and multiple product surfaces.",
        "The user does not want current salary used as the benchmark.",
      ],
    },
    {
      id: "judge-1",
      role: "Judge",
      title: "Provisional verdict",
      meta: "Decision contract",
      tone: "judge",
      body: [
        "Proceed to screening only.",
        "Do not commit until package, structure, and hours are clear.",
        "If the night schedule is fixed, the compensation has to materially offset the cost.",
      ],
    },
  ],
};

export const workspaceStats = [
  { label: "Rounds", value: "3" },
  { label: "Confidence", value: "0.78" },
  { label: "Risk", value: "Moderate" },
  { label: "Mode", value: "Career Pack" },
];
