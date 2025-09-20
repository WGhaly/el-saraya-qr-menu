@echo off
REM Saraya QR Menu - Complete Startup Script for Windows
REM This script kills any processes on ports 3001 and 3003, then starts both servers

echo 🚀 Starting Saraya QR Menu Application...
echo ================================================

echo 🧹 Cleaning up existing processes...

REM Kill processes on port 3001
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001"') do (
    echo Killing process %%a on port 3001
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill processes on port 3003
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3003"') do (
    echo Killing process %%a on port 3003
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill any Node.js processes that might be related
taskkill /f /im "node.exe" /fi "WINDOWTITLE eq npm*" >nul 2>&1
taskkill /f /im "node.exe" /fi "WINDOWTITLE eq next*" >nul 2>&1

timeout /t 2 >nul

echo ✅ Ports cleared

echo 🔧 Setting up environment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found
    echo    Please run this script from the saraya-qr-menu root directory
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm run install:all
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Set environment variables
set CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3003,http://127.0.0.1:3003
set NODE_ENV=development
set PORT=3001

echo.
echo 🌟 Starting servers...
echo 📡 Backend will run on: http://localhost:3001
echo 🖥️  Frontend will run on: http://localhost:3003
echo.
echo Press Ctrl+C to stop both servers
echo ================================================

REM Start both servers
call npm run dev

pause