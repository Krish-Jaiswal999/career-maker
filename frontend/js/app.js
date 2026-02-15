/**
 * Main App Router
 * Handles routing and page initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    const currentPath = window.location.pathname;
    
    // Route to appropriate page
    if (currentPath.includes('dashboard')) {
        initDashboard();
    } else if (currentPath.includes('roadmap')) {
        initRoadmap();
    } else if (currentPath.includes('portfolio')) {
        initPortfolio();
    } else if (currentPath.includes('login')) {
        initLogin();
    } else if (currentPath.includes('signup')) {
        initSignup();
    } else {
        initLanding();
    }
}

function initDashboard() {
    console.log('Initializing Dashboard...');
    // Handled by dashboard.js
}

function initRoadmap() {
    console.log('Initializing Roadmap...');
    // Handled by roadmap.js
}

function initPortfolio() {
    console.log('Initializing Portfolio...');
    // Handled by portfolio.js
}

function initLogin() {
    console.log('Initializing Login...');
}

function initSignup() {
    console.log('Initializing Signup...');
}

function initLanding() {
    console.log('Initializing Landing Page...');
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <nav class="navbar">
                <div class="container">
                    <div class="nav-brand">GenAI Career Planner</div>
                    <div class="nav-menu">
                        <a href="pages/login.html" class="nav-link">Login</a>
                        <a href="pages/signup.html" class="nav-link">Sign Up</a>
                    </div>
                </div>
            </nav>
            
            <div class="landing-hero">
                <div class="container">
                    <h1>Your AI-Powered Career Path 🚀</h1>
                    <p>Generate personalized learning roadmaps, discover your skill gaps, and build your dream career.</p>
                    <div class="hero-buttons">
                        <a href="pages/signup.html" class="btn btn-primary">Get Started</a>
                        <a href="#features" class="btn btn-secondary">Learn More</a>
                    </div>
                </div>
            </div>
            
            <section id="features" class="features-section">
                <div class="container">
                    <h2>Features</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🎯</div>
                            <h3>Career Analysis</h3>
                            <p>AI-powered analysis of your career goals and skill gaps</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🗺️</div>
                            <h3>Learning Roadmaps</h3>
                            <p>Personalized learning paths with phases and milestones</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">📚</div>
                            <h3>Resources</h3>
                            <p>Aggregated learning materials from top sources</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">💼</div>
                            <h3>Portfolio Builder</h3>
                            <p>Generate professional portfolios with multiple styles</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🤖</div>
                            <h3>AI-Powered</h3>
                            <p>Smart recommendations based on ML algorithms</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🔍</div>
                            <h3>Project Suggestions</h3>
                            <p>Recommended projects to build your portfolio</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="cta-section">
                <div class="container">
                    <h2>Ready to Transform Your Career?</h2>
                    <p>Join thousands of developers building their dream careers</p>
                    <a href="pages/signup.html" class="btn btn-primary">Start Your Journey</a>
                </div>
            </section>
            
            <footer class="footer">
                <div class="container">
                    <p>&copy; 2024 GenAI Career Path Planner. All rights reserved.</p>
                </div>
            </footer>
        `;
    }
}
