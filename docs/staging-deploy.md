# Staging Deploy Runbook

## Target

- Host: `staging.mizan.zuhaib.pro`
- Branch: `staging`
- Workflow: `.github/workflows/deploy.yml`

## One-time setup

1. Hestia `user` account me deployment public key authorize karo.
2. GitHub `staging` environment me required secrets rakho.
3. Us ke baad har deployment one-command aur automatic hai.

## Required GitHub Secrets

- `DEPLOY_SSH_KEY_B64` preferred
- `DEPLOY_SSH_KEY` fallback if you keep the raw OpenSSH private key

Host, user, domain path, and URL are selected automatically from the branch.

## Expected flow

1. Push to `staging`.
2. GitHub Actions runs tests and build.
3. Static release archive is uploaded to the VPS.
4. VPS publishes it to the domain's `public_html`.
5. GitHub Actions opens the HTTPS domain and verifies `Mizan` is present.

## Staging command

Run from the project folder on local Windows:

```powershell
npm run release:staging -- -Message "Describe the change"
```

## SSH Key

- Local machine par `C:\Users\ESHOP\.ssh\mizan_vps` private key hoti hai.
- Local machine par `C:\Users\ESHOP\.ssh\mizan_vps.pub` public key hoti hai.
- Public key Hestia ke `user` account me authorize hoti hai.
- Private key GitHub secret `DEPLOY_SSH_KEY_B64` me base64 string ki form me jati hai.
- Agar raw key use karni ho to `DEPLOY_SSH_KEY` me poori OpenSSH private key paste hoti hai.

## Generate Secret Value

PowerShell me ye chalao:

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Content -Raw $env:USERPROFILE\.ssh\mizan_vps)))
```

Jo single-line output aaye, usko `DEPLOY_SSH_KEY_B64` me paste karo.

## Verification

- `https://staging.mizan.zuhaib.pro`
- `npm test` passes in the repo.
- `npm run build` passes in the repo.
- GitHub Actions `Deploy` workflow is green.

## What should be visible

- The seeded decision room UI.
- `#job-negotiation` channel selected.
- Right rail with settings and decision summary.
- No production secrets in code.
