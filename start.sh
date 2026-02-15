#!/bin/bash

# Career Path Planner Startup Script

echo "🚀 GenAI Career Path Planner - Startup Script"
echo "=============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+"
    exit 1
fi

# Check if PostgreSQL is running (optional check)
# psql -U postgres -c '\q' 2>/dev/null || echo "⚠️  PostgreSQL may not be running"

# Create virtual environment if it doesn't exist
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source backend/venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r backend/requirements.txt

# Setup environment file
if [ ! -f "backend/.env" ]; then
    echo "🔧 Creating .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

# Start backend
echo ""
echo "🔷 Starting FastAPI backend server..."
echo "📍 API will be available at: http://localhost:8000"
echo "📚 API docs at: http://localhost:8000/docs"
echo ""

cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Cleanup on exit
trap "echo '❌ Server stopped'" EXIT
