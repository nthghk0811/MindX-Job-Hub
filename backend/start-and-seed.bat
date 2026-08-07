@echo off
echo ====================================================
echo  MindX Job Hub - Backend Setup
echo ====================================================
echo.

cd /d "%~dp0"

echo [1/3] Kiem tra Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js chua duoc cai dat!
    pause
    exit /b
)

echo.
echo [2/3] Khoi dong Backend Server (Express + MongoDB Atlas)...
echo Server se chay tai: http://localhost:5000
echo Health check:       http://localhost:5000/api/health
echo.
echo Nhan Ctrl+C de dung server
echo.
start "MindX Backend" cmd /k "cd /d %~dp0 && npm.cmd run dev"

echo Doi server khoi dong (10 giay)...
timeout /t 10 /nobreak

echo.
echo [3/3] Chay Seed 200 jobs vao MongoDB Atlas...
npm.cmd run seed

echo.
echo ====================================================
echo  XONG! 200 jobs da duoc seed vao MongoDB Atlas.
echo  Backend dang chay tai http://localhost:5000
echo ====================================================
pause
