# GenAI Career Path Planner 🚀

An AI-powered platform that generates personalized career learning roadmaps, matches skills to career paths, recommends projects, and builds professional portfolios.

## 📋 Features

✅ **User Authentication** - Secure JWT-based authentication  
✅ **Career Profile Setup** - Define career goals and current skills  
✅ **AI Skill Gap Analysis** - Detect missing skills for your target career  
✅ **Personalized Roadmaps** - AI-generated learning paths with phases and milestones  
✅ **Project Recommendations** - Curated projects based on skill level  
✅ **Learning Resources** - YouTube, docs, MOOCs, and books aggregated  
✅ **Portfolio Generator** - Multiple template styles (FAANG, Startup, Academic, Minimal)  
✅ **LinkedIn Analysis** - Extract career insights from profiles (with proper legal setup)  
✅ **Progress Tracking** - Track completed skills and projects  

## 🏗️ Architecture

```
Frontend (HTML/CSS/JS)
    ↓
Backend API (FastAPI)
    ├─ Auth Service
    ├─ AI Engine (Career Analysis, Skill Matching)
    ├─ Portfolio Generator
    ├─ Web Scrapers
    └─ Roadmap Manager
    ↓
Database (PostgreSQL)
Vector DB (FAISS/Redis)
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JS |
| **Backend** | Python, FastAPI |
| **Database** | PostgreSQL (primary), Redis (cache) |
| **Vector DB** | FAISS (embeddings) |
| **AI/ML** | RoleSkill API, Sentence Transformers |
| **Scraping** | Selenium, BeautifulSoup |
| **Authentication** | JWT, OAuth2 |
| **Deployment** | Docker, Gunicorn |

## 📦 Project Structure

```
career-maker.2/
├── backend/
│   ├── app/
│   │   ├── auth/              # Authentication service
│   │   ├── ai_engine/         # Career analysis & ML
│   │   ├── database/          # Models & DB config
│   │   ├── scraping/          # Web & LinkedIn scrapers
│   │   ├── portfolio/         # Portfolio generator
│   │   ├── roadmap/           # Roadmap manager
│   │   ├── api/               # Route handlers
│   │   ├── main.py            # FastAPI app
│   │   └── schemas.py         # Pydantic models
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment template
│   └── Dockerfile             # Container config
├── frontend/
│   ├── pages/
│   │   ├── index.html         # Landing page
│   │   ├── login.html         # Login
│   │   ├── signup.html        # Registration
│   │   ├── dashboard.html     # User dashboard
│   │   ├── roadmap.html       # Roadmap view
│   │   └── portfolio.html     # Portfolio builder
│   ├── js/
│   │   ├── api.js             # API client
│   │   ├── dashboard.js       # Dashboard logic
│   │   ├── roadmap.js         # Roadmap logic
│   │   └── portfolio.js       # Portfolio logic
│   ├── css/
│   │   ├── styles.css         # Main styles
│   │   └── tailwind.css       # Utility classes
│   └── assets/                # Images, icons
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL 12+
- Node.js 14+ (optional, for frontend build tools)
- Docker & Docker Compose (for containerized setup)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations (if using Alembic)
# alembic upgrade head

# Start FastAPI server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Serve with Python's built-in server
python -m http.server 3000

# Or use any other local server
npx http-server -p 3000  # if you have Node.js
```

Frontend available at `http://localhost:3000`

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb career_maker_db

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/career_maker_db
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/profile` - Create/update profile
- `GET /api/auth/profile` - Get user profile

### AI & Career Analysis
- `GET /api/analyze-career?career_goal=` - Analyze skill gaps
- `POST /api/generate-roadmap` - Generate learning roadmap
- `GET /api/user-roadmap` - Get user's roadmap
- `GET /api/match-skills?career_goal=` - Match skills to career
- `POST /api/recommend-projects` - Get project recommendations
- `GET /api/recommend-resources/{skill}` - Get learning resources

### Portfolio
- `POST /api/generate-portfolio?template_type=faang` - Generate portfolio
- `GET /api/portfolio` - Get user's portfolio
- `POST /api/analyze-linkedin/{profile_url}` - Analyze LinkedIn profile
- `GET /api/trending-projects/{language}` - Get trending projects
- `GET /api/learning-resources/{skill}` - Get aggregated resources

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/career_maker_db

# JWT
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Live role skill API
ROLE_SKILL_API_URL=https://api.deepseek.com
ROLE_SKILL_API_TOKEN=your-api-token-here
ROLE_SKILL_API_CACHE_TTL_SECONDS=3600

# LinkedIn (for scraping - use with caution)
LINKEDIN_EMAIL=your-email@example.com
LINKEDIN_PASSWORD=your-password

# Redis
REDIS_URL=redis://localhost:6379

# Environment
ENVIRONMENT=development
DEBUG=True

# CORS
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8000"]
```

## 🐳 Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Cleanup
docker-compose down
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
pytest

# Run with verbose output
pytest -v
```

## 🤖 AI Engine Features

### 1. Career Analysis
- Skill gap detection
- Career trajectory mapping
- Industry path recommendations

### 2. Skill Matching
- Vector similarity search (using embeddings)
- Career-to-skill taxonomy
- Readiness level calculation

### 3. Roadmap Generation
- Multi-phase learning paths
- Skill progression ordering
- Milestone checkpoints

### 4. Resource Aggregation
- YouTube courses
- Official documentation
- MOOC platforms
- GitHub trending repositories
- Free learning materials

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Using bcrypt
- **CORS** - Configured cross-origin requests
- **Rate Limiting** - (Can be added with SlowAPI)
- **Input Validation** - Pydantic models
- **HTTPS Ready** - Use in production with SSL

## 🚀 Deployment Options

### AWS
```bash
# Elastic Beanstalk
eb init
eb create
eb deploy
```

### Railway
```bash
railway login
railway init
railway up
```

### Google Cloud
```bash
gcloud app deploy
```

### Heroku
```bash
heroku login
heroku create
git push heroku main
```

## 📈 Roadmap / Future Features

- [ ] Real LinkedIn scraping with proper legal setup
- [ ] Optional OpenAI integration for expanded AI responses
- [ ] Coding challenge generator
- [ ] ATS resume analyzer
- [ ] Interview prep module
- [ ] Job market analysis
- [ ] Peer mentorship matching
- [ ] Mobile app (React Native)
- [ ] Video tutorials integration
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📧 Support

For issues, questions, or suggestions, please:
- Open an issue on GitHub
- Contact: support@careerpathplanner.com
- Discord: [Join our community]

## 🙏 Acknowledgments

- FastAPI documentation
- SQLAlchemy ORM
- The open-source community

## 📞 Contact & Community

- **Website**: [Coming Soon]
- **Twitter**: [@CareerPathAI]
- **GitHub Discussions**: [Community Forum]

---

Made with ❤️ by the Career Path Planner Team
