@echo off
REM Icon: .bat files cannot use a custom icon. Run create-start-shortcut.vbs once, then use "Start ArulTex POS.lnk".
cd /d "%~dp0"
set "APP_URL=http://localhost:5173"
echo ArulTex POS - starting backend and frontend...
echo.
start "ArulTex API (port 8080)" cmd /k cd /d "%~dp0" ^&^& npm start
timeout /t 2 /nobreak >nul
start "ArulTex Web (Vite)" cmd /k cd /d "%~dp0..\ArulTex-FE" ^&^& npm run dev -- --port 5173 --strictPort
echo Waiting for Vite to be ready...
timeout /t 5 /nobreak >nul
echo Opening Chrome: %APP_URL%
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%APP_URL%"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%APP_URL%"
) else (
  start "" "%APP_URL%"
)
echo.
echo If Chrome did not open, use your browser: %APP_URL%
echo Close the API and Vite windows to stop the app.
pause
