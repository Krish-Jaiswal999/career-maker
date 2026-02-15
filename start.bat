@echo off
REM Career Path Planner Startup Script for Windows

echo.
echo GenAI Career Path Planner - Startup Script [Windows]
echo ====================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo. ❌ Python is not installed. Please install Python 3.9+
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "backend\venv" (
    echo. 📦 Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

REM Activate virtual environment
echo. ✅ Activating virtual environment...
call backend\venv\Scripts\activate.bat

REM Install dependencies
echo. 📥 Installing dependencies...
pip install -q -r backend\requirements.txt

REM Setup environment file
if not exist "backend\.env" (
    echo. 🔧 Creating .env file...
    copy backend\.env.example backend\.env
    echo. ⚠️ Please edit backend\.env with your configuration
)

REM Start backend
echo.
echo. 🔷 Starting FastAPI backend server...
echo. 📍 API will be available at: http://localhost:8000
echo. 📚 API docs at: http://localhost:8000/docs
echo.

cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
