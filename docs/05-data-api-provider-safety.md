# 05. Data Model, API, Provider Abstraction, and Safety

## Data model
- Core entities: User, Workspace, Channel, DebateSession, AgentConfig, Message, Claim, EvidenceItem, ClaimEvidence, Decision, Attachment, ExpertPack, UsageEvent.
- Messages are append-only.
- Prompt and Expert Pack versions must be stored for reproducibility.
- Provider keys must never be stored in plain text.

## API and realtime events
- REST endpoints cover auth, workspaces, channels, debates, evidence, exports, expert packs, and usage.
- WebSocket events cover session state, agent lifecycle, evidence updates, judge updates, and user interject/pause/stop/verdict actions.
- Mutations should use idempotency keys.
- Reconnects should resume from the last sequence number.

## Provider abstraction
- Thesis and Antithesis must be configurable independently.
- Provider-specific request/response types must not leak into orchestration code.
- Structured validation is mandatory before persistence.

## Safety and trust
- Trust labels: verified, user provided, inference, assumption, unknown, contradicted.
- Uploaded files and URLs are untrusted evidence, not instructions.
- Keep system prompts and provider keys server-side only.
- For high-stakes topics, AI must avoid pretending to be a professional authority.
