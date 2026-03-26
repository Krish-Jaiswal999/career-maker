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