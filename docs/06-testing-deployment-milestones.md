# 06. Testing, Deployment, and Milestones

## Testing layers
- Unit, integration, contract, end-to-end, visual regression, accessibility, resilience, and safety coverage.
- Acceptance criteria require the seeded career/hiring flow to complete end-to-end.

## Production stack
- Monorepo with pnpm and a task runner.
- Next.js web app.
- TypeScript API and WebSocket layer.
- PostgreSQL.
- Redis and BullMQ or equivalent queue.
- S3-compatible object storage.
- Tailwind CSS.
- Zod schemas.
- Playwright and provider mocks.

## Delivery plan
- Phase 0: foundation.
- Phase 1: product shell.
- Phase 2: runtime.
- Phase 3: models.
- Phase 4: expert system.
- Phase 5: evidence and judge.
- Phase 6: export and quality.
- Phase 7: deploy.

## Working rules
- Build vertical slices.
- Keep structured agent contracts.
- Do not hard-code model names or HR rules into UI components.
- Use mock providers so the app is testable without paid APIs.
