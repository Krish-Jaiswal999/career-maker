# Getting Started - GenAI Career Path Planner

## ⚡ 5-Minute Quick Start

### Option 1: Local Development (Recommended for first-time)

**Windows:**
```bash
# 1. Navigate to project directory
cd c:\Users\User\Documents\career-maker.2

# 2. Run startup script
start.bat

# 3. Open another terminal and start frontend
cd frontend
python -m http.server 3000
```

**Mac/Linux:**
```bash
cd ~/Documents/career-maker.2
chmod +x start.sh
./start.sh

# In another terminal:
cd frontend
python3 -m http.server 3000
```

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### Option 2: Docker (Recommended for production)

```bash
cd career-maker.2

# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:8000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## 🔧 Manual Setup (Step-by-step)

### Prerequisites
- Python 3.9+
- PostgreSQL installed and running
- Git

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env file with your settings

# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Option A: Python (simplest)
python -m http.server 3000

# Option B: Node.js (if you have it)
npm install
npm run dev

# Option C: VS Code Live Server extension
# Just install and click "Go Live" on index.html
```

### 3. Database Setup

**PostgreSQL:**

```bash
# Create database (choose one method)

# Via psql:
psql -U postgres
CREATE DATABASE career_maker_db;
CREATE USER career_user WITH PASSWORD 'career_password';
ALTER ROLE career_user SET client_encoding TO 'utf8';
ALTER ROLE career_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE career_user SET default_transaction_deferrable TO on;
ALTER ROLE career_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE career_maker_db TO career_user;
\q

# Or via command line:
createdb career_maker_db
createuser career_user
psql -U postgres -d career_maker_db -c "GRANT ALL PRIVILEGES ON DATABASE career_maker_db TO career_user;"
```

**Update .env:**
```
DATABASE_URL=postgresql://career_user:career_password@localhost:5432/career_maker_db
```

---

## 🧪 Testing the Setup

### 1. Check API is running
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### 2. Test signup
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "testpass123"
  }'
```

### 3. Test login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 4. Visit frontend
Go to: http://localhost:3000

---

## 📋 User Flow

1. **Sign Up** → Create account
2. **Set Profile** → Add career goal & current skills
3. **Analyze Career** → AI analyzes skill gaps
4. **Generate Roadmap** → Get personalized learning path
5. **View Projects** → See project recommendations
6. **Build Portfolio** → Create professional portfolio
7. **Track Progress** → Monitor skill completion

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process using port 8000
# Windows:
netstat -ano | findstr :8000

# Mac/Linux:
lsof -i :8000

# Kill the process
# Windows:
taskkill /PID <PID> /F

# Mac/Linux:
kill -9 <PID>
```

### PostgreSQL connection error
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Mac/Linux:
pg_isready

# Verify credentials in .env
# Reset password:
psql -U postgres
ALTER USER career_user PASSWORD 'new_password';
```

### Module not found errors
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend not loading
```bash
# Check if server is running
# Try different port:
python -m http.server 3001

# Clear browser cache (Ctrl+Shift+Delete)
```

---

## 📚 API Documentation

Once backend is running:
- Go to: http://localhost:8000/docs
- Interactive API explorer with try-it-out features

---

## 🚀 Next Steps

1. **Customize .env** - Set up OpenAI API key for AI features
2. **Add Real Data** - LinkedIn profile analysis requires setup
3. **Configure Redis** - For caching and sessions
4. **UI Customization** - Modify CSS files
5. **Deploy** - Choose your hosting platform

---

## 📞 Support

- Check [README.md](../README.md) for full documentation
- Review [API structure](#api-endpoints-quick-reference) section below
- Inspect browser console for frontend errors
- Check server logs for backend errors

---

## 🗺️ Directory Quick Reference

```
career-maker.2/
├── backend/
│   ├── app/
│   │   ├── main.py           ← FastAPI app entry
│   │   ├── database/         ← DB models
│   │   ├── api/              ← API endpoints
│   │   ├── ai_engine/        ← AI logic
│   │   └── portfolio/        ← Portfolio generation
│   ├── requirements.txt       ← Dependencies
│   ├── .env.example          ← Config template
│   └── Dockerfile            ← Container config
├── frontend/
│   ├── index.html            ← Landing page
│   ├── pages/                ← Main pages
│   ├── js/                   ← Frontend logic
│   ├── css/                  ← Styling
│   └── package.json          ← Node dependencies
├── README.md                 ← Full documentation
├── docker-compose.yml        ← Container orchestration
├── start.sh                  ← Mac/Linux startup
└── start.bat                 ← Windows startup
```

---

## 💡 Quick Tips

- **Hot reload**: Backend automatically reloads on code changes
- **API Docs**: Use Swagger UI at http://localhost:8000/docs
- **Database GUI**: Install pgAdmin or DBeaver to browse DB
- **Browser DevTools**: Use to inspect API calls (F12 → Network tab)
- **Logs**: Check terminal output for errors

---

## 🎓 Learning Path

1. Start with sign up/login
2. Create profile with career goal
3. Generate roadmap
4. Explore projects
5. Build portfolio
6. Track progress

---

Happy coding! 🚀
