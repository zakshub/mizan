param(
  [Parameter(Mandatory = $true)]
  [string]$Message
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$expectedBranch = "staging"

function Invoke-Checked {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Command,

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Command failed with exit code $LASTEXITCODE"
  }
}

Set-Location -LiteralPath $repoRoot

$currentBranch = (git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) {
  throw "Unable to read the current Git branch."
}

if ($currentBranch -ne $expectedBranch) {
  throw "Staging releases must be pushed from branch '$expectedBranch'. Current branch is '$currentBranch'."
}

Invoke-Checked npm.cmd test
Invoke-Checked npm.cmd run build
Invoke-Checked git add --all

git diff --cached --quiet
$diffExitCode = $LASTEXITCODE
if ($diffExitCode -eq 1) {
  Invoke-Checked git commit -m $Message
} elseif ($diffExitCode -ne 0) {
  throw "Unable to inspect staged changes."
}

Invoke-Checked git push --set-upstream origin $expectedBranch

Write-Host ""
Write-Host "Release pushed to '$expectedBranch'. GitHub Actions will deploy staging only."
