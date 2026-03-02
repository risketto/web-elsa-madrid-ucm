# ============================================================
#  serve.ps1 – ELSA Madrid local development server
#  Run this script to serve the site at http://localhost:3000
#  Usage: Right-click > "Run with PowerShell"
#         or from a terminal: .\serve.ps1
# ============================================================

$PORT = 8000
$ROOT = $PSScriptRoot   # folder where this script lives

Write-Host ""
Write-Host "  ELSA Madrid – Local Dev Server" -ForegroundColor Cyan
Write-Host "  --------------------------------" -ForegroundColor DarkGray
Write-Host ""

# ── Helper: open browser after a short delay ────────────────
function Open-Browser {
    Start-Sleep -Seconds 1
    Start-Process "http://localhost:$PORT"
}

# ── Option 1: Python (most reliable, ships with Windows 11) ─
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pyVersion = python --version 2>&1
    Write-Host "  [OK] Found: $pyVersion" -ForegroundColor Green
    Write-Host "  Serving at http://localhost:$PORT  (Ctrl+C to stop)" -ForegroundColor Yellow
    Write-Host ""
    Start-Job -ScriptBlock { Start-Sleep 1; Start-Process "http://localhost:$using:PORT" } | Out-Null
    Set-Location $ROOT
    python -m http.server $PORT
    exit 0
}

# ── Option 2: Python3 alias ──────────────────────────────────
if (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pyVersion = python3 --version 2>&1
    Write-Host "  [OK] Found: $pyVersion" -ForegroundColor Green
    Write-Host "  Serving at http://localhost:$PORT  (Ctrl+C to stop)" -ForegroundColor Yellow
    Write-Host ""
    Start-Job -ScriptBlock { Start-Sleep 1; Start-Process "http://localhost:$using:PORT" } | Out-Null
    Set-Location $ROOT
    python3 -m http.server $PORT
    exit 0
}

# ── Option 3: Node.js / npx serve ───────────────────────────
if (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "  [OK] Found: Node.js / npx" -ForegroundColor Green
    Write-Host "  Serving at http://localhost:$PORT  (Ctrl+C to stop)" -ForegroundColor Yellow
    Write-Host ""
    Start-Job -ScriptBlock { Start-Sleep 2; Start-Process "http://localhost:$using:PORT" } | Out-Null
    Set-Location $ROOT
    npx --yes serve -l $PORT .
    exit 0
}

# ── Option 4: Node.js / http-server ─────────────────────────
if (Get-Command http-server -ErrorAction SilentlyContinue) {
    Write-Host "  [OK] Found: http-server" -ForegroundColor Green
    Write-Host "  Serving at http://localhost:$PORT  (Ctrl+C to stop)" -ForegroundColor Yellow
    Write-Host ""
    Start-Job -ScriptBlock { Start-Sleep 2; Start-Process "http://localhost:$using:PORT" } | Out-Null
    Set-Location $ROOT
    http-server . -p $PORT
    exit 0
}

# ── Nothing found ────────────────────────────────────────────
Write-Host "  [ERROR] No suitable server found." -ForegroundColor Red
Write-Host ""
Write-Host "  Install one of the following and re-run this script:" -ForegroundColor White
Write-Host "    - Python 3:  https://www.python.org/downloads/" -ForegroundColor Gray
Write-Host "    - Node.js:   https://nodejs.org/" -ForegroundColor Gray
Write-Host ""
Read-Host "  Press Enter to exit"
