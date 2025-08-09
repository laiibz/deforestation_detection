@echo off
echo Starting Deforestation Detection Backend...
echo.

cd /d "d:\help\AI-project\backend"

echo Creating admin user...
node setupAdmin.js
echo.

echo Starting server on port 5000...
node server.js

pause
