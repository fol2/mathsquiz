# Simple HTTP Server in PowerShell
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()

Write-Host "Server running at http://localhost:8000/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get the requested URL path
        $requestUrl = $request.Url.LocalPath
        
        # Default to index.html for root requests
        if ($requestUrl -eq '/') {
            $requestUrl = '/index.html'
        }
        
        # Construct file path (convert URL path to file system path)
        $filePath = Join-Path $(Get-Location) $requestUrl.TrimStart('/')
        $filePath = $filePath.Replace('/', '\')
        
        Write-Host "Request for: $requestUrl -> $filePath"
        
        # Check if file exists
        if (Test-Path $filePath -PathType Leaf) {
            # Read the file content
            $content = [System.IO.File]::ReadAllBytes($filePath)
            
            # Set content type based on file extension
            $extension = [System.IO.Path]::GetExtension($filePath)
            switch ($extension) {
                '.html' { $contentType = 'text/html' }
                '.css'  { $contentType = 'text/css' }
                '.js'   { $contentType = 'application/javascript' }
                '.json' { $contentType = 'application/json' }
                '.png'  { $contentType = 'image/png' }
                '.jpg'  { $contentType = 'image/jpeg' }
                '.gif'  { $contentType = 'image/gif' }
                default { $contentType = 'text/plain' }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        else {
            # File not found - return 404
            $response.StatusCode = 404
            $content = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found: $requestUrl")
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        
        # Close the response
        $response.Close()
    }
}
finally {
    # Stop the listener when done
    $listener.Stop()
}
