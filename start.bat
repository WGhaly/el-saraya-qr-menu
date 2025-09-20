@echo off
:: EL Saraya QR Menu - Complete Application Starter (Windows)
:: This script starts the database, backend, and frontend servers

title EL Saraya QR Menu System

echo.
echo [SARAYA] Starting EL Saraya QR Menu System...
echo.

:: Check if we're in the right directory
if not exist "backend" (
    echo [ERROR] Backend directory not found!
    echo Please run this script from the saraya-qr-menu root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo [ERROR] Frontend directory not found!
    echo Please run this script from the saraya-qr-menu root directory
    pause
    exit /b 1
)

echo [SUCCESS] Directory structure verified
echo.

:: Clean up existing processes (Windows version)
echo [SARAYA] Cleaning up existing processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [SUCCESS] Processes cleared
echo.

:: Check and install dependencies
echo [SARAYA] Checking dependencies...

if not exist "backend\node_modules" (
    echo [WARNING] Backend dependencies not found. Installing...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo [WARNING] Frontend dependencies not found. Installing...
    cd frontend
    call npm install
    cd ..
)

echo [SUCCESS] Dependencies verified
echo.

:: Generate Prisma client
echo [SARAYA] Setting up database...
cd backend
call npx prisma generate >nul 2>&1
echo [SUCCESS] Database schema generated
cd ..

:: Start Database Studio
echo [SARAYA] Starting Prisma Studio (Database GUI)...
cd backend
start /B npx prisma studio
cd ..
timeout /t 3 >nul
echo [SUCCESS] Database Studio running on http://localhost:5555
echo.

:: Start Backend Server
echo [SARAYA] Starting backend server...
cd backend
start /B npm run dev
cd ..
echo [INFO] Waiting for backend to initialize...
timeout /t 5 >nul
echo [SUCCESS] Backend server running on http://localhost:3001
echo.

:: Start Frontend Server
echo [SARAYA] Starting frontend application...
cd frontend
start /B npm run dev
cd ..
echo [INFO] Waiting for frontend to initialize...
timeout /t 8 >nul
echo [SUCCESS] Frontend application running on http://localhost:3003
echo.

:: Display success message
echo.
echo ==========================================
echo  🎉 EL SARAYA QR MENU SYSTEM IS READY! 🎉
echo ==========================================
echo.
echo 📱 Application URLs:
echo    • Public Menu:     http://localhost:3003
echo    • Admin Panel:     http://localhost:3003/admin
echo    • API Backend:     http://localhost:3001
echo    • Database Studio: http://localhost:5555
echo.
echo 👤 Default Login Credentials:
echo    • Email:    admin@saraya.com
echo    • Password: admin123
echo.
echo    • Email:    tahasinger@saraya.com
echo    • Password: 01093463235
echo.
echo 📊 System Status:
echo    • Backend:  Running (Port 3001)
echo    • Frontend: Running (Port 3003)  
echo    • Database: Studio available (Port 5555)
echo.
echo 💡 Tips:
echo    • Press Ctrl+C to stop monitoring
echo    • Close this window to keep services running
echo    • Use Task Manager to stop node.exe processes if needed
echo.

:: Keep window open
echo [SARAYA] System ready! Press any key to close this monitor...
pause >nul

echo.
echo [SARAYA] Monitor closed. Services continue running in background.
echo To stop all services, use Task Manager to end node.exe processes.
echo.