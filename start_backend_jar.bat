@echo off
echo Starting SkillSync Backend Server with JAR...
cd /d "D:\Training_Tracker_Skill_Sync_Sasken\backend"
echo Current directory: %CD%
echo.
echo Starting Spring Boot application from JAR...
java -jar target\skillsync-1.0.0.jar
echo.
echo Backend server stopped.
pause
