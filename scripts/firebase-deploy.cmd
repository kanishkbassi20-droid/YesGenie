@echo off
setlocal
cd /d "%~dp0.."

set "XDG_CONFIG_HOME=%CD%\.config"

echo.
echo Deploying to Firebase (project: yesgenie-c3d52)...
echo   - Hosting
echo   - Firestore Rules
echo.

npx firebase deploy --only hosting,firestore --project yesgenie-c3d52
