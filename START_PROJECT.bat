@echo off
setlocal enabledelayedexpansion
title TaskFlow Studio - Service Launcher
color 0b

echo.
echo  ==============================================================
echo   ⚡ TASKFLOW STUDIO - ONE-CLICK FULL STACK LAUNCHER ⚡
echo  ==============================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check if node_modules exists
if not exist "node_modules\" (
    echo [*] First-time setup detected. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        color 0c
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: 3. Check for PHP and launch microservice if available
where php >nul 2>nul
if %errorlevel% equ 0 (
    echo [+] PHP 8 detected. Starting PHP Report Microservice on port 8000...
    start "TaskFlow PHP Backend" /B php -S localhost:8000 -t backend >nul 2>nul
    echo [✓] PHP Backend running at http://localhost:8000
) else (
    echo [!] PHP is not in system PATH.
    echo     TaskFlow will run with Supabase Cloud DB and client report engine.
    echo     (To enable native PHP, install PHP or add XAMPP to PATH).
)

echo.
echo [*] Launching TaskFlow Studio Vite Dev Server on port 5173...
echo.

:: 4. Automatically open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5173"

:: 5. Start Vite Dev Server
call npm run dev

pause
