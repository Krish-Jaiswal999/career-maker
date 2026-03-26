# Quick Reference Guide - Portfolio Feature

## Getting Started

### Start Both Servers

**Terminal 1 - Backend**:
```bash
cd c:\Users\User\Documents\career-maker.2\backend
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend**:
```bash
cd c:\Users\User\Documents\career-maker.2\frontend
python -m http.server 3000
```

### Access Application
Open browser: **http://localhost:3000/pages/login.html**

---

## Portfolio Feature Workflow

### 1. **User Registration & Login**
- Navigate to Login page
- Create account with email/password or login
- Dashboard loads after authentication

### 2. **Fill Portfolio Information**
- Click "Start Building" button
- Select "Fill Your Information"
- Complete 7-section form:
  - Personal Info (phone, city, state, country)
  - Contact & Social (LinkedIn, GitHub, Twitter)
  - Education (degree, university, major)
  - Professional Experience (title, company, years)
  - Achievements & Awards
  - Languages (with proficiency)
- Click "Save & Generate Portfolio"

### 3. **Generate HTML Portfolio**
- Select template: FAANG / Startup / Minimal
- Click "Generate Portfolio"
- View preview of generated HTML
- Includes:
  - Professional header with contact info
  - Personal summary
  - Work experience
  - Education
  - Skills (from profile)
  - Achievements
  - Languages

### 4. **Export Portfolio**
- Click "Export Portfolio" button
- HTML file downloads to computer
- File can be:
  - Shared via email
  - Hosted on GitHub Pages
  - Uploaded to portfolio hosting
  - Printed to PDF

---

## API Endpoints - Portfolio

### Authentication Required (All endpoints)
Add header: `Authorization: Bearer {token}`

### GET /api/portfolio-info
**Get user's portfolio information**
```bash
curl -X GET http://localhost:8000/api/portfolio-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response**: Portfolio information object with all fields

### POST /api/portfolio-info
**Save or update portfolio information**
```bash
curl -X POST http://localhost:8000/api/portfolio-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "professional_summary": "Experienced software engineer...",
    "email": "user@example.com",
    "linkedin_url": "https://linkedin.com/in/yourprofile",
    "github_url": "https://github.com/yourprofile",
    "portfolio_url": "https://yourportfolio.com",
    "twitter_url": "https://twitter.com/yourhandle",
    "personal_website": "https://yoursite.com",
    "highest_degree": "Bachelor",
    "university": "Stanford University",
    "major": "Computer Science",
    "graduation_year": 2020,
    "additional_certifications": [
      {"name": "AWS Solutions Architect", "issuer": "Amazon", "date": "2023"}
    ],
    "current_title": "Senior Software Engineer",
    "current_company": "Tech Company",
    "total_experience": 5,
    "work_experience": [
      {"title": "Engineer", "company": "Company", "years": "2020-2023", "description": "..."}
    ],
    "achievements": [
      {"title": "Achievement", "description": "Accomplished X"}
    ],
    "projects": [
      {"name": "Project", "description": "Built...", "skills": ["Python"], "link": "..."}
    ],
    "languages": [
      {"language": "English", "proficiency": "Native"},
      {"language": "Spanish", "proficiency": "Fluent"}
    ]
  }'
```
**Response**: Saved portfolio information

### DELETE /api/portfolio-info
**Delete portfolio information**
```bash
curl -X DELETE http://localhost:8000/api/portfolio-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response**: Confirmation message

### POST /api/generate-portfolio-html
**Generate HTML portfolio**
```bash
curl -X POST http://localhost:8000/api/generate-portfolio-html \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"template": "faang"}'
```
**Template options**: "faang", "startup", "minimal"
**Response**: HTML content (can save to file)

---

## Portfolio Form Fields

### Personal Information (5 fields)
- Phone number
- City
- State/Province
- Country
- Professional summary (textarea)

### Contact & Social (6 fields)
- Email (required)
- LinkedIn URL
- GitHub URL
- Personal portfolio URL **(optional)**
- Twitter URL
- Personal website

### Education (5 fields)
- Highest degree (required dropdown)
- University/College (required)
- Major/Field of study (required)
- Graduation year
- Additional certifications (textarea for JSON)

### Professional Experience (4 fields)
- Current job title
- Current company
- Total years of experience (required)
- Work experience history (textarea for JSON)

### Achievements (2 fields)
- Achievements list (textarea for JSON)
- Projects list (textarea for JSON)

### Languages (1 field)
- Languages and proficiency (textarea for JSON)

---

## HTML Template Features

### FAANG Template
- Gradient purple header
- Clean section breaks
- Professional spacing
- Skills displayed as tags
- Contact info in header
- Experience with company names highlighted
- Responsive design

### Startup Template
- Sticky navigation header
- Modern card-based layout
- Call-to-action buttons (GitHub, LinkedIn)
- Hero section with tagline
- Flexible grid layouts
- Contemporary styling
- Social media prominently featured

### Minimal Template
- Georgia serif typography
- Simple black and white
- Traditional resume style
- Print-friendly
- Minimal styling overhead
- Academic/professional tone

---

## Database Schema

### PortfolioInfo Table
```sql
CREATE TABLE portfolio_info (
  id INTEGER PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  phone VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  professional_summary TEXT,
  email VARCHAR NOT NULL,
  linkedin_url VARCHAR,
  github_url VARCHAR,
  portfolio_url VARCHAR,
  twitter_url VARCHAR,
  personal_website VARCHAR,
  highest_degree VARCHAR NOT NULL,
  university VARCHAR NOT NULL,
  major VARCHAR NOT NULL,
  graduation_year INTEGER,
  additional_certifications JSON,
  current_title VARCHAR,
  current_company VARCHAR,
  total_experience INTEGER DEFAULT 0,
  work_experience JSON,
  achievements JSON,
  projects JSON,
  languages JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

---

## Troubleshooting

### Portfolio form not loading
- Check authentication token is valid
- Verify backend is running on port 8000
- Check browser console for errors
- Ensure user is logged in

### Portfolio info not saving
- Verify all required fields are filled
- Check network tab for API errors
- Ensure CORS is configured
- Check backend logs for validation errors

### HTML not generating
- Fill out portfolio information first
- Select a valid template (faang/startup/minimal)
- Check backend is processing correctly
- Verify database connection

### Skills not showing in portfolio
- Make sure to add skills from main dashboard
- Skills come from user profile, not portfolio form
- Navigate to "Skills" section and add skills
- Regenerate portfolio after adding skills

### Page not loading
- Check if frontend running: `http://localhost:3000`
- Check if backend running: `http://localhost:8000/docs`
- Clear browser cache
- Try incognito/private browsing

---

## File Locations

```
Project Root
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── models.py (PortfolioInfo model)
│   │   ├── api/
│   │   │   └── portfolio_routes.py (endpoints)
│   │   └── main.py
│   └── (venv)
│
├── frontend/
│   ├── pages/
│   │   ├── portfolio.html (main portfolio page)
│   │   ├── portfolio-info.html (form page)
│   │   ├── dashboard.html
│   │   └── ...
│   ├── js/
│   │   ├── api.js (portfolio methods: getPortfolioInfo, savePortfolioInfo, generatePortfolioHtml)
│   │   ├── portfolio.js (portfolio logic)
│   │   ├── portfolio-info.js (form handler)
│   │   └── ...
│   ├── css/
│   │   └── styles.css (portfolio styling)
│   └── index.html
│
├── SESSION_SUMMARY.md (this session's work)
├── PORTFOLIO_FEATURE_SUMMARY.md (feature details)
└── COMPLETE_FEATURE_CHECKLIST.md (full project status)
```

---

## Common Tasks

### Edit existing portfolio
1. Go to Portfolio page
2. Click "Edit Information" button
3. Form pre-fills with existing data
4. Make changes
5. Click "Save & Generate Portfolio"
6. Select template and regenerate

### Change portfolio template
1. Portfolio page shows current template
2. Select different template from dropdown
3. Click "Generate Portfolio"
4. Preview updates
5. Export new version if needed

### Download portfolio as HTML
1. Generate/view portfolio
2. Click "Export Portfolio" button
3. Right-click HTML in preview → Save as
4. Or use browser download feature
5. File saved locally ready for sharing

### Share portfolio
1. Export HTML file
2. Upload to GitHub Pages
3. Share link with recruiters
4. Or email HTML attachment
5. Recipients can open in any browser

---

## API Response Examples

### Successful Portfolio Info Save
```json
{
  "id": 1,
  "user_id": 1,
  "phone": "+1234567890",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "email": "user@example.com",
  "highest_degree": "Bachelor",
  "university": "Stanford",
  "major": "Computer Science",
  "total_experience": 5,
  "current_title": "Senior Engineer",
  "current_company": "Tech Co",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Error Response (Missing Auth)
```json
{
  "detail": "Not authenticated"
}
```

### Error Response (Portfolio Not Found)
```json
{
  "detail": "Portfolio information not found"
}
```

---

## Performance Tips

1. **Optimize Portfolio Loading**
   - Portfolio info is cached in browser
   - Only regenerates when template selection changes

2. **Fast HTML Export**
   - HTML generated server-side (fast)
   - Inline CSS means single file
   - No external dependencies needed

3. **Database Efficiency**
   - One query per portfolio request
   - Indexed by user_id for fast lookups
   - JSON columns for complex data

---

## Security Notes

- All portfolio endpoints require JWT authentication
- Users can only access their own portfolio
- Passwords hashed with bcrypt (SHA256 pre-hash)
- CORS configured to allow frontend communication
- Input validated via Pydantic schemas
- SQL injection prevented by ORM

---

## Support Info

- **Backend**: Python 3.12.7 + FastAPI
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+
- **Database**: SQLite (upgrade to PostgreSQL for production)
- **Servers**: Uvicorn (backend), Python http.server (frontend)
- **Documentation**: See .md files in project root

---

*Last Updated: 2024*  
*Version: 1.0*  
*Status: ✅ Production Ready*
