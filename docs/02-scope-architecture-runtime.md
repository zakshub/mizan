# 02. Scope, Architecture, and Runtime

## MVP scope
- Sign-in or secure single-user mode.
- Workspace and channel UI.
- Topic creation with attachments.
- English, Urdu, and Roman Urdu.
- Thesis, Antithesis, Evidence, Judge.
- Career and Hiring Expert Pack.
- Clarification mode before debate when context is missing.
- Round limit 1 to 6, default 3.
- Streaming, pause, stop, interject.
- Decision Summary panel.
- History, search, export to Markdown, JSON, PDF.
- Light theme default, dark optional.
- At least two provider adapters.
- Basic telemetry.

## Functional architecture
- Topic Router.
- Clarifier.
- Expert Pack Loader.
- Debate Orchestrator.
- Evidence Service.
- Judge Service.
- Export Service.
- Voice Gateway later.

## Runtime protocol
- State machine from draft to routing, clarification, debating, judging, and completion.
- Default three-round sequence: opening, rebuttal, closing.
- Loop prevention through semantic similarity and argument IDs.
- User intervention can supersede a round when it materially changes the decision.
