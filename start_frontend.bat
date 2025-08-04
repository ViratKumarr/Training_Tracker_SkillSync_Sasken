@echo off
echo Starting SkillSync Frontend Server...
cd /d "D:\Training_Tracker_Skill_Sync_Sasken\frontend"
echo Current directory: %CD%
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting React development server...
call npm start
pause
