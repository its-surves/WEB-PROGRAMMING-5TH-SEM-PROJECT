# TaskFlow Studio PowerShell Launcher
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host " ⚡ TASKFLOW STUDIO - ONE-CLICK FULL STACK LAUNCHER ⚡" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed! Download from https://nodejs.org" -ForegroundColor Red
    pause
    exit 1
}

# Install modules if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "[*] Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check PHP
if (Get-Command php -ErrorAction SilentlyContinue) {
    Write-Host "[+] PHP detected. Starting PHP Report Microservice on port 8000..." -ForegroundColor Green
    Start-Process -FilePath "php" -ArgumentList "-S localhost:8000 -t backend" -WindowStyle Hidden
} else {
    Write-Host "[!] PHP not detected in PATH. Running with Supabase Cloud DB and client report engine." -ForegroundColor Yellow
}

# Open browser and run dev server
Write-Host "[*] Launching Vite Dev Server on http://localhost:5173..." -ForegroundColor Green
Start-Process "http://localhost:5173"
npm run dev
