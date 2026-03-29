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
                <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="window.location.href='/'">
                        <div class="logo" style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px;">🚀</div>
                        <div class="nav-brand">GenAI Career Planner</div>
                    </div>
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
                        <a href="pages/login.html" class="btn btn-secondary">Try Demo</a>
                        <a href="#features" class="btn btn-secondary">Learn More</a>
                    </div>
                </div>
            </div>
            
            <section id="features" class="features-section">
                <div class="container">
                    <h2>Features</h2>
                    <div class="features-grid">
                        <div class="feature-card" onclick="showFeaturePopup('Career Analysis', 'AI-powered analysis of your career goals, skill gaps, and market demands. Get personalized insights about your current skills and what you need to learn to reach your dream career.')">
                            <div class="feature-icon">🎯</div>
                            <h3>Career Analysis</h3>
                            <p>AI-powered analysis of your career goals and skill gaps</p>
                        </div>
                        <div class="feature-card" onclick="showFeaturePopup('Learning Roadmaps', 'Personalized learning paths with phases and milestones. Our AI creates a structured roadmap tailored to your goals, breaking down complex skills into manageable learning phases.')">
                            <div class="feature-icon">🗺️</div>
                            <h3>Learning Roadmaps</h3>
                            <p>Personalized learning paths with phases and milestones</p>
                        </div>
                        <div class="feature-card" onclick="showFeaturePopup('Learning Resources', 'Aggregated learning materials from top sources including courses, tutorials, books, and interactive platforms. Curated specifically for each skill in your roadmap.')">
                            <div class="feature-icon">📚</div>
                            <h3>Resources</h3>
                            <p>Aggregated learning materials from top sources</p>
                        </div>
                        <div class="feature-card" onclick="showFeaturePopup('Portfolio Builder', 'Generate professional portfolios with multiple design styles suitable for any field of work. Showcase your skills, projects, and experience with elegantly designed templates.')">
                            <div class="feature-icon">💼</div>
                            <h3>Portfolio Builder</h3>
                            <p>Generate professional portfolios with multiple styles</p>
                        </div>
                        <div class="feature-card" onclick="showFeaturePopup('AI-Powered', 'Smart recommendations based on machine learning algorithms. Our AI learns from industry trends and your preferences to provide personalized guidance throughout your career journey.')">
                            <div class="feature-icon">🤖</div>
                            <h3>AI-Powered</h3>
                            <p>Smart recommendations based on ML algorithms</p>
                        </div>
                        <div class="feature-card" onclick="showFeaturePopup('Project Suggestions', 'Get recommended projects specifically designed to help you practice the skills you are learning. Build real-world projects that you can add to your portfolio.')">
                            <div class="feature-icon">🔍</div>
                            <h3>Project Suggestions</h3>
                            <p>Recommended projects to build your portfolio</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <footer class="footer">
                <div class="container">
                    <p>&copy; 2026 GenAI Career Path Planner. All rights reserved.</p>
                </div>
            </footer>
        `;
        
        // Store the modal in global scope for the function to work
        window.featureChapters = {
            'Career Analysis': 'AI-powered analysis of your career goals, skill gaps, and market demands. Get personalized insights about your current skills and what you need to learn to reach your dream career.',
            'Learning Roadmaps': 'Personalized learning paths with phases and milestones. Our AI creates a structured roadmap tailored to your goals, breaking down complex skills into manageable learning phases.',
            'Learning Resources': 'Aggregated learning materials from top sources including courses, tutorials, books, and interactive platforms. Curated specifically for each skill in your roadmap.',
            'Portfolio Builder': 'Generate professional portfolios with multiple design styles suitable for any field of work. Showcase your skills, projects, and experience with elegantly designed templates.',
            'AI-Powered': 'Smart recommendations based on machine learning algorithms. Our AI learns from industry trends and your preferences to provide personalized guidance throughout your career journey.',
            'Project Suggestions': 'Get recommended projects specifically designed to help you practice the skills you are learning. Build real-world projects that you can add to your portfolio.'
        };
    }
}

function showFeaturePopup(title, description) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 0 30px rgba(0,0,0,0.3);">
            <h2 style="margin-top: 0; color: #333;">${title}</h2>
            <p style="color: #666; line-height: 1.6; font-size: 1rem;">${description}</p>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1rem;">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}
