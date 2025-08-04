@echo off
echo Starting SkillSync Backend Server...
cd /d "D:\Training_Tracker_Skill_Sync_Sasken\backend"
echo Current directory: %CD%
echo.
echo Starting Spring Boot application...
mvn spring-boot:run
pause
