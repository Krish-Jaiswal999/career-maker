/**
 * Learning Resources Page
 */

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    
    try {
        const user = await API.getCurrentUser();
        const learningPath = await API.getLearningPath();
        
        displayResources(learningPath);
    } catch (error) {
        console.error('Failed to load resources:', error);
        document.getElementById('loading').innerHTML = `
            <p style="color: #e74c3c;">Failed to load resources. Please try again later.</p>
        `;
    }
});

function displayResources(learningPath) {
    const container = document.getElementById('resources-container');
    document.getElementById('loading').style.display = 'none';
    
    if (!learningPath.skills_to_learn || learningPath.skills_to_learn.length === 0) {
        container.innerHTML = `
            <div class="card">
                <h2>🎉 All Skills Mastered!</h2>
                <p>You've learned all the skills needed for <strong>${learningPath.career_goal}</strong>. Great job!</p>
                <p>Continue learning advanced topics and stay updated with industry trends.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="card">
            <h2>Your Learning Path</h2>
            <p><strong>Career Goal:</strong> ${learningPath.career_goal}</p>
            <p><strong>Progress:</strong> ${learningPath.progress_percentage}% complete</p>
            
            <h3 style="margin-top: 2rem; color: #667eea;">Skills to Learn</h3>
    `;
    
    learningPath.skills_to_learn.forEach(skillData => {
        html += `
            <div class="resources-section">
                <h3 style="margin-top: 1.5rem; color: #333;">📚 ${skillData.skill}</h3>
                <ul class="resources-list">
        `;
        
        skillData.resources.forEach(resource => {
            html += `
                <li class="resource-item">
                    <span class="resource-type">${resource.type}</span>
                    <a href="${resource.link}" target="_blank" rel="noopener noreferrer">
                        ${resource.title}
                    </a>
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Add current skills section
    if (learningPath.current_skills && learningPath.current_skills.length > 0) {
        html += `
            <div class="card">
                <h2>✅ Skills You Already Have</h2>
                <div class="skills-container">
        `;
        
        learningPath.current_skills.forEach(skillData => {
            html += `<span class="skill-badge">${skillData.skill}</span>`;
        });
        
        html += `</div></div>`;
    }
    
    container.innerHTML = html;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function checkAuth() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
    }
}
