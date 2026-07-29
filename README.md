# Mizan - Decision Room

Source-of-truth implementation for the Mizan decision-support platform.

## What this repo does now

- Single-page decision room with the seeded job-negotiation scenario.
- Draft, running, paused, clarifying, and completed debate states.
- Local persistence through `localStorage`.
- Markdown and JSON export from the live runtime state.
- Staging-only static deploy through GitHub Actions.

## Local development

Project folder:

```text
E:\move back to d\check gbs\Zak Live Drive\OneDrive\00 Work\Zuhaib.akram@live.com Drive\OneDrive\Documents\Mizan - Decision Room
```

Run:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Local test

```powershell
npm test
npm run build
```

The static export is written to `out/`.

## Staging release

Only staging is wired right now.

```powershell
npm run release:staging -- -Message "Describe the change"
```

GitHub Actions then builds the static export and deploys it to:

- `https://staging.mizan.zuhaib.pro`

## GitHub Actions secrets

- `DEPLOY_SSH_KEY_B64` preferred
- `DEPLOY_SSH_KEY` fallback if you paste the raw OpenSSH private key

The workflow expects the Hestia `user` account to already trust the matching public key.

## Notes

- The app is intentionally client-side so the runtime can persist locally before staging deployment.
- Production wiring is not active in this repo.
