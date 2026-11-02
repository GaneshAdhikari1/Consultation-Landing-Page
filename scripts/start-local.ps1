$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$previewUrl = "http://127.0.0.1:5173/thank-you"
$stateDirectory = Join-Path $projectRoot ".local-preview"
$stdoutLog = Join-Path $stateDirectory "server.log"
$stderrLog = Join-Path $stateDirectory "server-error.log"
$pidFile = Join-Path $stateDirectory "server.pid"

function Test-Preview {
  try {
    $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

if (Test-Preview) {
  Write-Output "Preview is already running at $previewUrl"
  exit 0
}

New-Item -ItemType Directory -Force -Path $stateDirectory | Out-Null

$npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source
$process = Start-Process `
  -FilePath $npmCommand `
  -ArgumentList @("run", "dev") `
  -WorkingDirectory $projectRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog `
  -PassThru

Set-Content -LiteralPath $pidFile -Value $process.Id

for ($attempt = 0; $attempt -lt 45; $attempt++) {
  if (Test-Preview) {
    Write-Output "Preview started at $previewUrl"
    Write-Output "Process ID: $($process.Id)"
    Write-Output "Logs: $stdoutLog"
    exit 0
  }

  if ($process.HasExited) {
    Write-Error "The preview process exited before becoming ready. Check $stderrLog"
  }

  Start-Sleep -Seconds 1
}

Write-Error "The preview did not become ready within 45 seconds. Check $stdoutLog and $stderrLog"
