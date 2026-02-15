/**
 * API Client for frontend
 * Handles all communication with backend
 */

const API_BASE_URL = 'http://localhost:8000/api';

class APIClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` })
        };
    }

    async request(method, endpoint, data = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: this.getHeaders()
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const responseData = await response.json();
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }
                
                // Format error message
                let errorMessage = `API Error: ${response.status}`;
                
                if (Array.isArray(responseData.detail)) {
                    // Handle Pydantic validation errors (array of error objects)
                    const errors = responseData.detail.map(err => {
                        const field = err.loc ? err.loc[err.loc.length - 1] : 'unknown';
                        return `${field}: ${err.msg}`;
                    });
                    errorMessage += ' - ' + errors.join('; ');
                    console.error('Validation Errors:', errors);
                } else if (responseData.detail) {
                    // Handle simple error message
                    errorMessage += ' - ' + responseData.detail;
                }
                
                console.error('API Error Details:', responseData);
                throw new Error(errorMessage);
            }

            return responseData;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async signup(email, username, full_name, password) {
        const data = await this.request('POST', '/auth/signup', {
            email, username, full_name, password
        });
        this.token = data.access_token;
        return data;
    }

    async login(email, password) {
        const data = await this.request('POST', '/auth/login', {
            email, password
        });
        this.token = data.access_token;
        return data;
    }

    async getCurrentUser() {
        return this.request('GET', '/auth/me');
    }

    async createProfile(career_goal, current_skills, years_experience, linkedin_url, github_url) {
        return this.request('POST', '/auth/profile', {
            career_goal,
            current_skills,
            years_experience,
            linkedin_url,
            github_url
        });
    }

    async getProfile() {
        return this.request('GET', '/auth/profile');
    }

    // AI/Roadmap endpoints
    async analyzeCareer(career_goal) {
        return this.request('GET', `/analyze-career?career_goal=${encodeURIComponent(career_goal)}`);
    }

    async generateRoadmap() {
        return this.request('POST', '/generate-roadmap');
    }

    async getUserRoadmap() {
        return this.request('GET', '/user-roadmap');
    }

    async matchSkills(career_goal) {
        return this.request('GET', `/match-skills?career_goal=${encodeURIComponent(career_goal)}`);
    }

    async recommendProjects() {
        return this.request('POST', '/recommend-projects');
    }

    async recommendResources(skill) {
        return this.request('GET', `/recommend-resources/${encodeURIComponent(skill)}`);
    }

    // Portfolio endpoints
    async generatePortfolio(template_type = 'faang') {
        return this.request('POST', `/generate-portfolio?template_type=${template_type}`);
    }

    async getPortfolio() {
        return this.request('GET', '/portfolio');
    }

    async analyzeLinkedIn(profile_url) {
        return this.request('POST', `/analyze-linkedin/${encodeURIComponent(profile_url)}`);
    }

    async getTrendingProjects(language = 'python') {
        return this.request('GET', `/trending-projects/${language}`);
    }

    async getLearningResources(skill) {
        return this.request('GET', `/learning-resources/${encodeURIComponent(skill)}`);
    }

    async getResources(skill = null) {
        if (skill) {
            return this.request('GET', `/recommend-resources?skill=${encodeURIComponent(skill)}`);
        }
        return this.request('GET', '/recommend-resources');
    }

    async getLearningPath() {
        return this.request('GET', '/learning-path');
    }

    async getPortfolioInfo() {
        return this.request('GET', '/portfolio-info');
    }

    async savePortfolioInfo(data) {
        return this.request('POST', '/portfolio-info', data);
    }

    async generatePortfolioHtml(templateType) {
        return this.request('POST', '/generate-portfolio-html', { template: templateType });
    }
}

const API = new APIClient();

// Utility function for logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Check if user is authenticated
function checkAuth() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
    }
}
