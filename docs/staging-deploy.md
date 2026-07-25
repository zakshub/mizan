# Staging Deploy Runbook

## Target

- Host: `staging.mizan.zuhaib.pro`
- Branch: `staging`
- Workflow: `.github/workflows/deploy.yml`

## Required GitHub Secrets

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PATH`
- `DEPLOY_SSH_KEY`

## Expected flow

1. Push to `staging`.
2. GitHub Actions runs tests and build.
3. Release archive is uploaded to the VPS.
4. VPS extracts the release into `current/`.
5. Docker Compose restarts the app.

## Verification

- `https://staging.mizan.zuhaib.pro`
- `npm test` passes in the repo.
- `npm run build` passes in the repo.

## What should be visible

- The seeded decision room UI.
- `#job-negotiation` channel selected.
- Right rail with settings and decision summary.
- No production secrets in code.
