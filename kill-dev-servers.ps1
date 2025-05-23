# Kill all Node.js processes (dev servers)
Write-Host "Killing all Node.js processes..."
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Clear Vite cache
Write-Host "Clearing Vite cache..."
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
}

# Clear dist folder
Write-Host "Clearing dist folder..."
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

Write-Host "✓ All dev servers killed and caches cleared!"
Write-Host "Now you can run: npm run dev" 