@echo off
setlocal enabledelayedexpansion

echo Starting SkillSync Training Tracker...
echo ========================================

:: Check if Java is installed
echo [STEP] 1. Checking Java installation...
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Java is not installed. Please install Java 17 or higher.
    exit /b 1
)

for /f tokens^=2-5^ delims^=.-_^" %%j in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VERSION=%%j
)

if %JAVA_VERSION% LSS 17 (
    echo Java version %JAVA_VERSION% is too old. Please install Java 17 or higher.
    exit /b 1
)

echo [INFO] Java version detected: %JAVA_VERSION%

:: Check if Maven is installed
echo [STEP] 2. Checking Maven installation...
mvn -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Maven is not installed. Please install Maven 3.6 or higher.
    exit /b 1
)

echo [INFO] Maven version detected

:: Check if Node.js is installed
echo [STEP] 3. Checking Node.js installation...
node -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 16 or higher.
    exit /b 1
)

for /f "tokens=1,2,3 delims=v." %%a in ('node -v') do (
    set NODE_VERSION=%%b
)

if %NODE_VERSION% LSS 16 (
    echo Node.js version %NODE_VERSION% is too old. Please install Node.js 16 or higher.
    exit /b 1
)

echo [INFO] Node.js version detected: %NODE_VERSION%

:: Start backend
echo [STEP] 4. Starting backend...
cd backend
echo [INFO] Building and starting backend on http://localhost:8080
echo [INFO] This will take a moment to start...

:: Start the backend in a new window
start "SkillSync Backend" cmd /c "mvn spring-boot:run"

:: Wait for backend to start
echo [INFO] Waiting for backend to start (15 seconds)...
timeout /t 15 /nobreak >nul

:: Test backend
echo [STEP] 5. Testing backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api' -UseBasicParsing -ErrorAction Stop; Write-Output 'Backend is running'; exit 0 } catch { Write-Output 'Backend might still be starting'; exit 1 }"

:: Start frontend
echo [STEP] 6. Starting frontend...
cd ..\frontend
echo [INFO] Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Frontend dependency installation failed
    exit /b 1
)

echo [INFO] Frontend dependencies installed
echo [INFO] Starting frontend on http://localhost:3000

:: Start the frontend in a new window
start "SkillSync Frontend" cmd /c "npm start"

:: Wait a moment for frontend to start
echo [INFO] Waiting for frontend to start (10 seconds)...
timeout /t 10 /nobreak >nul

:: Final status
echo.
echo SkillSync Training Tracker is now running!
echo ==============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8080
echo H2 Console: http://localhost:8080/api/h2-console
echo.
echo Default Login Credentials:
echo    Admin:    admin@sasken.com / admin123
echo    Manager:  manager@sasken.com / manager123
echo    Trainer:  trainer@sasken.com / trainer123
echo    Employee: employee@sasken.com / employee123
echo.
echo Tips:
echo    - The backend uses H2 in-memory database (no setup required)
echo    - Sample data will be loaded automatically
echo    - Check the browser console for any frontend errors
echo.
echo To stop the application:
echo    Close the backend and frontend windows
echo    Or press any key in this window to stop all processes
echo.

pause

:: Kill processes when user presses a key
taskkill /F /FI "WINDOWTITLE eq SkillSync Backend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq SkillSync Frontend*" >nul 2>&1
echo All processes stopped.