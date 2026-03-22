@echo off
cd /d "%~dp0"
echo ArulTex POS - starting backend and frontend...
echo.
start "ArulTex API (port 8080)" cmd /k cd /d "%~dp0" ^&^& npm start
timeout /t 2 /nobreak >nul
start "ArulTex Web (Vite)" cmd /k cd /d "%~dp0..\ArulTex-FE" ^&^& npm run dev
echo.
echo Two command windows opened. When Vite shows Local URL, open it in your browser.
echo Close those windows to stop the app.
pause
