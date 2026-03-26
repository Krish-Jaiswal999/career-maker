/**
 * Dashboard JavaScript
 */

let userSkills = [];

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    
    try {
        const user = await API.getCurrentUser();
        document.getElementById('user-name').textContent = user.full_name;
        
        // Try to load existing profile
        try {
            const profile = await API.getProfile();
            displayProfile(profile);
        } catch (e) {
            console.log('No profile yet');
        }
    } catch (error) {
        console.error('Failed to load user:', error);
    }
});

function toggleCareerForm() {
    const form = document.getElementById('career-form');
    const display = document.getElementById('career-goal-display');
    const btn = document.getElementById('start-btn');
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        display.style.display = 'none';
        btn.textContent = 'Cancel';
    } else {
        form.style.display = 'none';
        btn.textContent = 'Start Planning';
    }
}

function editCareerGoal() {
    toggleCareerForm();
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    document.getElementById('career-goal').value = profile.career_goal || '';
    document.getElementById('years-exp').value = profile.years_experience || 0;
}

document.getElementById('career-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const career_goal = document.getElementById('career-goal').value;
    const years_exp = parseInt(document.getElementById('years-exp').value) || 0;
    
    try {
        const profile = await API.createProfile(career_goal, userSkills, years_exp);
        localStorage.setItem('profile', JSON.stringify(profile));
        
        // Hide form and show goal
        document.getElementById('career-form').style.display = 'none';
        document.getElementById('career-goal-display').style.display = 'block';
        document.getElementById('goal-text').textContent = career_goal;
        
        // Show analysis section
        document.getElementById('analysis-section').style.display = 'block';
        
        // Update keyword suggestions
        updateKeywordSuggestions(career_goal);
        
        // Analyze career
        const analysis = await API.analyzeCareer(career_goal);
        displayAnalysis(analysis);
        
    } catch (error) {
        alert('Failed to save profile: ' + error);
    }
});

function displayProfile(profile) {
    document.getElementById('career-goal-display').style.display = 'block';
    document.getElementById('goal-text').textContent = profile.career_goal;
    userSkills = profile.current_skills || [];
    updateSkillsDisplay();
    
    // Update keyword suggestions based on career goal
    updateKeywordSuggestions(profile.career_goal);
}

function addSkill() {
    const input = document.getElementById('skill-input');
    const skill = input.value.trim();
    
    if (skill && !userSkills.includes(skill)) {
        userSkills.push(skill);
        input.value = '';
        updateSkillsDisplay();
        // Auto-save skills to backend
        saveSkills();
    }
}

async function saveSkills() {
    try {
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
        // Only save if we have a valid career goal
        if (profile.career_goal && profile.career_goal !== 'Not set') {
            const updatedProfile = await API.createProfile(
                profile.career_goal,
                userSkills,
                profile.years_experience || 0,
                profile.linkedin_url || '',
                profile.github_url || ''
            );
            localStorage.setItem('profile', JSON.stringify(updatedProfile));
            
            // Regenerate roadmap when skills change
            try {
                const roadmapResult = await API.generateRoadmap();
                localStorage.setItem('roadmap', JSON.stringify(roadmapResult));
                console.log('Roadmap regenerated with updated skills');
            } catch (error) {
                console.log('Could not regenerate roadmap:', error);
            }
        }
    } catch (error) {
        console.error('Failed to save skills:', error);
    }
}

function removeSkill(skill) {
    userSkills = userSkills.filter(s => s !== skill);
    updateSkillsDisplay();
    // Auto-save skills to backend
    saveSkills();
}

function updateSkillsDisplay() {
    const container = document.getElementById('skills-list');
    container.innerHTML = userSkills.map(skill => `
        <span class="skill-tag">
            ${skill}
            <button type="button" onclick="removeSkill('${skill}')" class="skill-remove">×</button>
        </span>
    `).join('');
}

async function generateRoadmap() {
    try {
        const result = await API.generateRoadmap();
        localStorage.setItem('roadmap', JSON.stringify(result));
        
        // Display roadmap preview
        document.getElementById('roadmap-section').style.display = 'block';
        displayRoadmapPreview(result);
        
    } catch (error) {
        alert('Failed to generate roadmap: ' + error);
    }
}

function displayRoadmapPreview(roadmap) {
    const content = document.getElementById('roadmap-content');
    
    let html = '<div class="phases-preview">';
    if (roadmap.roadmap && roadmap.roadmap.phases) {
        roadmap.roadmap.phases.forEach((phase, index) => {
            html += `
                <div class="phase-preview">
                    <h3>${phase.phase_name || 'Phase ' + (index + 1)}</h3>
                    <p><strong>Duration:</strong> ${phase.duration || 'TBD'}</p>
                    <p><strong>Skills:</strong> ${phase.skills?.join(', ') || 'N/A'}</p>
                </div>
            `;
        });
    }
    html += '</div>';
    content.innerHTML = html;
}

function displayAnalysis(analysis) {
    const resultsDiv = document.getElementById('analysis-results');
    
    let html = '<div class="analysis-result">';
    if (analysis.analysis) {
        const gaps = analysis.analysis;
        html += `
            <h3>Skill Gaps</h3>
            <p>Missing skills: ${gaps.skill_gaps?.join(', ') || 'None!'}</p>
            <p>Readiness: ${Math.round(gaps.completion_percentage)}%</p>
        `;
    }
    html += '</div>';
    
    resultsDiv.innerHTML = html;
}

function viewFullRoadmap() {
    window.location.href = 'roadmap.html';
}

async function loadProgress() {
    const container = document.getElementById('progress-container');
    
    try {
        const learningPath = await API.getLearningPath();
        console.log('Learning path data:', learningPath);
        const skillsCount = learningPath.learned_skills_count !== undefined ? learningPath.learned_skills_count : Math.round(learningPath.progress_percentage / 100 * learningPath.total_skills_needed);
        console.log('Skills count:', skillsCount);
        const skillsToLearn = learningPath.skills_to_learn;
        const totalSkills = learningPath.total_skills_needed;
        const progressPercent = Math.round(learningPath.progress_percentage);
        
        let html = `
            <p><strong>Career Goal:</strong> ${learningPath.career_goal}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <p><strong>${skillsCount} of ${totalSkills} skills completed (${progressPercent}%)</strong></p>
            
            <div class="progress-section">
                <h3>Skills to Learn</h3>
        `;
        
        if (skillsToLearn.length > 0) {
            html += '<div class="skills-to-learn">';
            skillsToLearn.forEach(item => {
                html += `<span class="skill-badge-todo">${item.skill}</span>`;
            });
            html += '</div>';
        } else {
            html += '<p><em>No more skills to learn! You\'re all caught up!</em></p>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Failed to load progress:', error);
        // Fallback to basic progress
        const skillsCount = userSkills.length;
        const totalSkills = 16;
        const percentComplete = (skillsCount / totalSkills) * 100;
        
        container.innerHTML = `
            <p>Track your progress through the roadmap</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentComplete}%"></div>
            </div>
            <p>${skillsCount} of ${totalSkills} skills added (${Math.round(percentComplete)}%)</p>
        `;
    }
}

// Keyword Analyzer - Comprehensive suggestions for all career fields
const keywordSuggestions = {
    // IT & Tech
    'software engineer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'SQL', 'REST APIs', 'Docker'],
    'data scientist': ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Pandas', 'TensorFlow', 'Data Visualization', 'NumPy'],
    'web developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'Bootstrap'],
    'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Git', 'Jenkins', 'Terraform'],
    'product manager': ['Market Research', 'User Research', 'Analytics', 'SQL', 'Product Strategy', 'Roadmapping', 'Prototyping'],
    'ui/ux designer': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'CSS', 'HTML', 'Usability Testing'],
    'cloud architect': ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform', 'Security', 'Networking'],
    'machine learning': ['Python', 'TensorFlow', 'PyTorch', 'Statistics', 'Linear Algebra', 'Deep Learning', 'NLP', 'Computer Vision'],
    'cybersecurity': ['Network Security', 'Encryption', 'Linux', 'Penetration Testing', 'Risk Management', 'Security Protocols', 'SIEM', 'Firewalls'],
    'backend developer': ['Python', 'Java', 'Node.js', 'Databases', 'REST APIs', 'Microservices', 'Docker', 'Spring Boot'],
    'frontend developer': ['JavaScript', 'React', 'Vue.js', 'CSS', 'HTML', 'TypeScript', 'Bootstrap', 'Webpack'],
    
    // Engineering
    'mechanical engineer': ['CAD', 'SolidWorks', 'AutoCAD', 'Thermodynamics', 'Materials Science', 'MATLAB', 'Finite Element Analysis', 'Design'],
    'civil engineer': ['AutoCAD', 'Structural Analysis', 'Project Management', 'Building Codes', 'REVIT', 'BIM', 'Surveying', 'Estimation'],
    'electrical engineer': ['Circuit Design', 'SPICE Simulation', 'Power Systems', 'Embedded Systems', 'Arduino', 'PCB Design', 'Control Systems', 'MATLAB'],
    'chemical engineer': ['Process Design', 'ASPEN', 'Thermodynamics', 'Heat Transfer', 'Mass Balance', 'Safety', 'HAZOP', 'Modeling'],
    'engineer': ['CAD', 'Problem Solving', 'Technical Writing', 'Project Management', 'Safety Standards', 'Mathematics', 'Physics', 'Design Thinking'],
    
    // Business & Management
    'project manager': ['Agile', 'Scrum', 'Communication', 'Risk Management', 'Budgeting', 'Leadership', 'Stakeholder Management', 'Jira'],
    'marketing manager': ['SEO', 'Content Strategy', 'Social Media', 'Analytics', 'Email Marketing', 'Brand Strategy', 'Google Analytics', 'Copywriting'],
    'sales manager': ['Negotiation', 'CRM', 'Salesforce', 'Team Management', 'Lead Generation', 'Closing Techniques', 'Forecasting', 'Communication'],
    'business analyst': ['Requirements Analysis', 'Data Analysis', 'SQL', 'Excel', 'Visualization', 'Process Mapping', 'Communication', 'Documentation'],
    'consultant': ['Problem Solving', 'Business Analysis', 'Communication', 'Excel', 'Presentation', 'Research', 'Strategic Thinking', 'Report Writing'],
    
    // Finance & Accounting
    'accountant': ['Accounting', 'Excel', 'Tax Law', 'Auditing', 'Financial Reporting', 'GAAP', 'QuickBooks', 'Generally Accepted Accounting Principles'],
    'financial analyst': ['Financial Analysis', 'Excel', 'Valuation', 'Risk Analysis', 'Budgeting', 'Investment Analysis', 'SQL', 'Power BI'],
    'finance': ['Financial Analysis', 'Excel', 'Accounting', 'Valuation', 'Risk Analysis', 'Budgeting', 'Investment Analysis', 'Financial Modeling'],
    
    // Healthcare
    'physician': ['Medical Diagnosis', 'Patient Care', 'Clinical Research', 'Medical Terminology', 'EHR Systems', 'Pharmacology', 'Evidence-Based Medicine', 'Communication'],
    'nurse': ['Patient Care', 'Medical Terminology', 'EHR Systems', 'Clinical Nursing', 'Patient Safety', 'Critical Thinking', 'Communication', 'Compassion'],
    'therapist': ['Patient Assessment', 'Treatment Planning', 'Clinical Skills', 'Psychology', 'Documentation', 'Empathy', 'Communication', 'Research Methods'],
    
    // Human Resources
    'hr': ['Recruitment', 'Employee Relations', 'Payroll', 'Training & Development', 'HRIS', 'Labor Law', 'Performance Management', 'Compensation'],
    'recruiter': ['Recruitment', 'Sourcing', 'Interviewing', 'Communication', 'ATS Systems', 'Market Knowledge', 'Networking', 'Sales Skills'],
    
    // Creative & Design
    'graphic designer': ['Adobe Creative Suite', 'UI/UX Design', 'Branding', 'Typography', 'Color Theory', 'Figma', 'Illustrator', 'InDesign'],
    'video editor': ['Adobe Premiere', 'Video Effects', 'Color Grading', 'Motion Graphics', 'Audio Editing', 'DaVinci Resolve', 'Storytelling', 'Pacing'],
    'architect': ['CAD', 'Architecture Design', 'Building Codes', 'Project Management', 'Materials Science', 'Sustainability', '3D Modeling', 'REVIT'],
    
    // Marketing & Communications
    'marketing': ['SEO', 'Content Strategy', 'Social Media', 'Analytics', 'Email Marketing', 'Marketing Automation', 'Brand Strategy', 'Copywriting'],
    'journalist': ['Writing', 'Research', 'Interviewing', 'Fact-Checking', 'Communication', 'Publishing Platforms', 'News Judgment', 'Breaking News'],
    'copywriter': ['Writing', 'Brand Voice', 'SEO', 'Persuasion', 'Research', 'Editing', 'Marketing Knowledge', 'Storytelling'],
    
    // Sales 
    'sales': ['Negotiation', 'CRM', 'Salesforce', 'Communication', 'Lead Generation', 'Closing Techniques', 'Product Knowledge', 'Presentation'],
    'sales representative': ['Negotiation', 'CRM', 'Communication', 'Lead Generation', 'Closing Techniques', 'Product Knowledge', 'Relationship Building', 'Follow-up'],
    
    // Education
    'teacher': ['Curriculum Design', 'Teaching Methods', 'Student Assessment', 'Communication', 'Classroom Management', 'Subject Matter Expertise', 'Mentoring', 'Patience'],
    'professor': ['Research', 'Publishing', 'Curriculum Design', 'Mentoring', 'Subject Matter Expertise', 'Academic Writing', 'Presentation', 'Peer Collaboration'],
    'educator': ['Teaching', 'Curriculum Design', 'Assessment', 'Communication', 'Subject Expertise', 'Student Engagement', 'Feedback', 'Patience'],
    
    // Legal
    'lawyer': ['Legal Research', 'Contract Drafting', 'Communication', 'Case Management', 'Writing', 'Negotiation', 'Compliance', 'Legal Ethics'],
    'legal assistant': ['Legal Research', 'Document Preparation', 'Client Support', 'Organization', 'Legal Terminology', 'Communication', 'Writing', 'Attention to Detail'],
    
    // Other
    'hospitality': ['Customer Service', 'Team Management', 'Event Planning', 'Communication', 'Problem-Solving', 'Food Safety', 'Booking Systems', 'Training'],
    'chef': ['Culinary Skills', 'Menu Planning', 'Food Safety', 'Kitchen Management', 'Plating', 'Recipe Development', 'Team Leadership', 'Creativity'],
    'real estate': ['Market Knowledge', 'Negotiation', 'CRM', 'Communication', 'Property Analysis', 'Sales', 'Legal Knowledge', 'Networking']
};

function updateKeywordSuggestions(careerGoal) {
    const container = document.getElementById('keyword-suggestions');
    if (!container) return;
    
    const goalLower = careerGoal.toLowerCase();
    let suggestions = [];
    
    // Find matching suggestions - check for exact and partial matches
    for (const [key, value] of Object.entries(keywordSuggestions)) {
        if (goalLower.includes(key)) {
            suggestions = value;
            break;
        }
    }
    
    // If no exact match, try to find keywords that are contained in the career goal
    if (suggestions.length === 0) {
        // Extract key words from goal and try to match
        const goalKeywords = goalLower.split(' ').filter(w => w.length > 3);
        for (const keyword of goalKeywords) {
            for (const [key, value] of Object.entries(keywordSuggestions)) {
                if (key.includes(keyword)) {
                    suggestions = value;
                    break;
                }
            }
            if (suggestions.length > 0) break;
        }
    }
    
    // Fallback: generic professional skills
    if (suggestions.length === 0) {
        suggestions = ['Problem Solving', 'Communication', 'Leadership', 'Project Management', 'Time Management', 'Team Collaboration', 'Critical Thinking', 'Adaptability'];
    }
    
    // Filter out skills already added
    const filteredSuggestions = suggestions.filter(s => !userSkills.includes(s));
    
    if (filteredSuggestions.length === 0) {
        container.innerHTML = '<span style="color: #999; font-size: 0.9rem;">All suggested skills have been added!</span>';
        return;
    }
    
    let html = '';
    filteredSuggestions.forEach(skill => {
        html += `
            <button type="button" onclick="quickAddSkill('${skill}')" style="
                background: #e8f0ff;
                border: 1px solid #667eea;
                color: #667eea;
                padding: 6px 12px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.85rem;
                transition: all 0.2s;
            " onmouseover="this.style.background='#667eea'; this.style.color='white';" onmouseout="this.style.background='#e8f0ff'; this.style.color='#667eea';">
                + ${skill}
            </button>
        `;
    });
    
    container.innerHTML = html;
}

function quickAddSkill(skill) {
    document.getElementById('skill-input').value = skill;
    addSkill();
}