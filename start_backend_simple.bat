@echo off
echo.
echo ========================================
echo   Starting SkillSync Backend Server
echo ========================================
echo.
cd /d "D:\Training_Tracker_Skill_Sync_Sasken\backend"
echo Current directory: %CD%
echo.
echo Compiling and starting Spring Boot application...
echo.
mvn clean spring-boot:run
echo.
echo Backend server stopped.
pause
