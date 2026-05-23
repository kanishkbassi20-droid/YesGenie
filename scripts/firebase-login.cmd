@echo off
setlocal
cd /d "%~dp0.."

set "XDG_CONFIG_HOME=%CD%\.config"

echo.
echo Firebase login will open in your browser.
echo If it does not open automatically, copy the URL shown into your browser.
echo.

npx firebase login

