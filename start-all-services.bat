@echo off
echo ========================================
echo Starting Deforestation Detection System
echo ========================================
echo.

echo [1/3] Starting Backend Server (Port 5000)...
cd /d "d:\help\AI-project\backend"
start "Backend Server" cmd /k "echo Starting Backend Server... && node server.js"

echo.
echo [2/3] Starting Flask AI Service (Port 5001)...
start "Flask AI Service" cmd /k "echo Starting Flask AI Service... && python app.py"

echo.
echo [3/3] Starting Frontend (Port 3000)...
cd /d "d:\help\AI-project\frontend"
start "Frontend" cmd /k "echo Starting Frontend... && npm start"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo Backend Server: http://localhost:5000
echo Frontend App: http://localhost:3000  
echo Flask AI Service: http://localhost:5001
echo.
echo Admin Login Credentials:
echo Email: admin@deforestation.com
echo Password: Admin123!
echo ========================================

pause
