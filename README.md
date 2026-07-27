# Mizan - Decision Room

Source-of-truth implementation for the Mizan decision-support platform.

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

The static production build is written to `out/`.

## Automated release

Staging, from the `staging` branch:

```powershell
npm run release:staging -- -Message "Describe the change"
```

Production, from the `main` branch:

```powershell
npm run release:production -- -Message "Describe the release"
```

Each release command runs tests, creates the static build, commits pending
changes, and pushes the matching branch. GitHub Actions then deploys the exact
commit to its matching Hestia domain and verifies the page over HTTPS.

- `staging` -> `https://staging.mizan.zuhaib.pro`
- `main` -> `https://mizan.zuhaib.pro`

## GitHub Actions secrets

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PATH`
- `DEPLOY_SSH_KEY_B64`
- `DEPLOY_SSH_KEY` optional fallback

Environment-specific values:

- Staging `DEPLOY_PATH`: `/home/user/web/staging.mizan.zuhaib.pro`
- Production `DEPLOY_PATH`: `/home/user/web/mizan.zuhaib.pro`

## Notes

- The current scaffold is a seeded decision-room shell built from the master PDF spec.
- The deployed app is a static export served directly from Hestia `public_html`.
- GitHub Actions and VPS deployment wiring use environment secrets, not hard-coded credentials.
