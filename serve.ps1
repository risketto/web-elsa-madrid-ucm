$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()
Write-Host "Serving from" (Get-Location) "on port 8000"

while ($true) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $resp = $ctx.Response
    $path = $req.Url.LocalPath.TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = Join-Path (Get-Location) $path
    if (Test-Path $file) {
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
    } else {
        $resp.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        $resp.ContentType = 'text/plain'
        $resp.OutputStream.Write($msg, 0, $msg.Length)
    }
    $resp.Close()
}