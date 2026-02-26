# run-dev.ps1
# Arranca un servidor para servir este sitio y abre el navegador.
# - Intenta usar `python` (o `py`) si está disponible.
# - Si no encuentra Python busca en %APPDATA%\uv\...\python.exe
# - Si falla usa `serve.ps1` como fallback (PowerShell HTTP listener).

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root
$port = 8080

Write-Host "Serving from $root on port $port"

# localizar python
$python = $null
try { $python = (Get-Command python -ErrorAction SilentlyContinue).Source } catch {}
if (-not $python) {
    try { $python = (Get-Command py -ErrorAction SilentlyContinue).Source } catch {}
}

if (-not $python) {
    $uvPath = Join-Path $env:APPDATA 'uv'
    if (Test-Path $uvPath) {
        $found = Get-ChildItem -Path $uvPath -Recurse -Filter python.exe -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) { $python = $found.FullName }
    }
}

$proc = $null
if ($python) {
    Write-Host "Using Python executable: $python"
    try {
        # start python server in background
        $proc = Start-Process -FilePath $python -ArgumentList "-m","http.server","$port" -WorkingDirectory $root -PassThru -WindowStyle Hidden
        Start-Sleep -Milliseconds 500
        Write-Host "Python server started (PID: $($proc.Id))."
    } catch {
        Write-Host "Could not start Python server: $_"
        $proc = $null
    }
}
if (-not $proc) {
    # No python available: start a PowerShell HTTP listener inline (blocking)
    Write-Host "Python not found. Starting built-in PowerShell HTTP listener on port $port (this process will keep running)."

    $listener = New-Object System.Net.HttpListener
    $prefix = "http://localhost:$port/"
    $listener.Prefixes.Add($prefix)
    try {
        $listener.Start()
    } catch {
        Write-Host "Failed to start HttpListener: $_"
        exit 1
    }

    Write-Host "Serving from $root at $prefix"
    # open browser once
    try { Start-Process $prefix } catch { Write-Host "Open browser manually: $prefix" }

    while ($true) {
        try {
            $ctx = $listener.GetContext()
        } catch {
            Write-Host "Listener stopped: $_"; break
        }
        if (-not $ctx) { Start-Sleep -Milliseconds 50; continue }
        $req = $ctx.Request
        $resp = $ctx.Response
        $path = $req.Url.LocalPath.TrimStart('/')
        if ($path -eq '') { $path = 'index.html' }
        $file = Join-Path $root $path
        if (Test-Path $file -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($file)
                $ext = [System.IO.Path]::GetExtension($file).ToLower()
                switch ($ext) {
                    '.html' { $resp.ContentType = 'text/html' }
                    '.css'  { $resp.ContentType = 'text/css' }
                    '.js'   { $resp.ContentType = 'application/javascript' }
                    '.json' { $resp.ContentType = 'application/json' }
                    '.png'  { $resp.ContentType = 'image/png' }
                    '.jpg'  { $resp.ContentType = 'image/jpeg' }
                    '.jpeg' { $resp.ContentType = 'image/jpeg' }
                    '.svg'  { $resp.ContentType = 'image/svg+xml' }
                    default { $resp.ContentType = 'application/octet-stream' }
                }
                $resp.ContentLength64 = $bytes.Length
                $resp.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $resp.StatusCode = 500
                $err = [System.Text.Encoding]::UTF8.GetBytes('Internal server error')
                $resp.ContentType = 'text/plain'
                $resp.OutputStream.Write($err,0,$err.Length)
            }
        } else {
            $resp.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('Not found')
            $resp.ContentType = 'text/plain'
            $resp.OutputStream.Write($msg, 0, $msg.Length)
        }
        try { $resp.Close() } catch {}
    }
    # end listener loop
}

# if python server started in background, open browser and print instructions
$uri = "http://localhost:$port/"
if ($proc) {
    try { Start-Process $uri } catch { Write-Host "Open browser manually: $uri" }
    Write-Host "Python server started (PID: $($proc.Id)). To stop it: Stop-Process -Id $($proc.Id)" 
} else {
    Write-Host "PowerShell listener exited or stopped." 
}