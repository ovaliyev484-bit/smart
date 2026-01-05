@echo off
title Smart Savdo Server
color 0A
echo ===================================================
echo   Smart Savdo Loyihasi - Localhost Server
echo ===================================================
echo.
echo [1/2] Kerakli kutubxonalar tekshirilmoqda...
call npm install
echo.
echo [2/2] Server ishga tushirilmoqda...
echo.
echo   Server manzili: http://localhost:3000
echo   To'xtatish uchun: Ctrl + C
echo.
node server.js
pause
