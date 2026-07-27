# Staging Deploy Runbook

## Target

- Host: `staging.mizan.zuhaib.pro`
- Branch: `staging`
- Workflow: `.github/workflows/deploy.yml`

## Tumhe Kya Karna Hai

1. VPS par login karo.
2. Staging aur production folders banao.
3. SSH public key VPS me add karo.
4. GitHub me staging secrets add karo.
5. Staging branch push hone do.
6. Browser me staging URL check karo.

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

## VPS Folder Commands

Run these on the VPS after SSH login:

```bash
mkdir -p /var/www/mizan/staging/current
mkdir -p /var/www/mizan/staging/incoming
mkdir -p /var/www/mizan/staging/shared

mkdir -p /var/www/mizan/production/current
mkdir -p /var/www/mizan/production/incoming
mkdir -p /var/www/mizan/production/shared
```

If you only want staging right now:

```bash
mkdir -p /var/www/mizan/staging/{current,incoming,shared}
```

## SSH Key

- Local machine par `C:\Users\ESHOP\.ssh\mizan_vps` private key hoti hai.
- Local machine par `C:\Users\ESHOP\.ssh\mizan_vps.pub` public key hoti hai.
- Public key VPS ke `/root/.ssh/authorized_keys` me jati hai.
- Private key GitHub secret `DEPLOY_SSH_KEY` me jati hai.

## Verification

- `https://staging.mizan.zuhaib.pro`
- `npm test` passes in the repo.
- `npm run build` passes in the repo.

## What should be visible

- The seeded decision room UI.
- `#job-negotiation` channel selected.
- Right rail with settings and decision summary.
- No production secrets in code.
