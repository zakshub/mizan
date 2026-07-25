# Mizan - Decision Room

Source-of-truth implementation for the Mizan decision-support platform.

## Local development

```bash
npm install
npm run dev
```

## Local test

```bash
npm test
npm run build
```

## Docker

```bash
docker compose up --build
```

## Deploy targets

- Staging: `staging.mizan.zuhaib.pro`
- Production: `mizan.zuhaib.pro`

## GitHub Actions secrets

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PATH`
- `DEPLOY_SSH_KEY`

Pushes to `staging` deploy to staging.
Pushes to `main` deploy to production.

## Notes

- The current scaffold is a seeded decision-room shell built from the master PDF spec.
- GitHub Actions and VPS deployment wiring should use environment secrets, not hard-coded credentials.
