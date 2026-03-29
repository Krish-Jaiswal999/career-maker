/**
 * Roadmap JavaScript
 */

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await loadRoadmap();
    loadProjects();
    loadProgressOverview();
    displaySkillsLearned();
    displaySkillsToLearn();
});

let currentRoadmap = null;  // Store roadmap for progress extraction

async function loadRoadmap() {
    try {
        const roadmap = await API.getUserRoadmap();
        currentRoadmap = roadmap;
        displayRoadmap(roadmap);
    } catch (error) {
        console.error('Failed to load roadmap:', error);
        // Try to generate a new roadmap if it doesn't exist
        try {
            console.log('Generating new roadmap...');
            const generatedRoadmap = await API.generateRoadmap();
            currentRoadmap = generatedRoadmap.roadmap;
            displayRoadmap(currentRoadmap);
        } catch (generateError) {
            console.error('Failed to generate roadmap:', generateError);
            document.getElementById('roadmap-timeline').innerHTML = '<p>Please create a career goal and add skills first!</p>';
            document.getElementById('phases-container').innerHTML = '<p>Then click "Generate Roadmap" on the dashboard.</p>';
            currentRoadmap = null;
        }
    }
}

function displayRoadmap(roadmap) {
    const timeline = document.getElementById('roadmap-timeline');
    const phasesContainer = document.getElementById('phases-container');
    
    let timelineHTML = '';
    let phasesHTML = '';
    
    if (roadmap.phases) {
        roadmap.phases.forEach((phase, index) => {
            const completed = false; // Track in DB
            timelineHTML += `
                <div class="timeline-item ${completed ? 'completed' : ''}">
                    <div class="timeline-marker">${index + 1}</div>
                    <div class="timeline-content">
                        <h3>${phase.phase_name || 'Phase ' + (index + 1)}</h3>
                        <p>${phase.duration}</p>
                    </div>
                </div>
            `;
            
            // Format projects as a list
            const projectsList = phase.projects && phase.projects.length > 0 
                ? phase.projects.map(p => `<li>📌 ${p}</li>`).join('')
                : '<li>No projects defined</li>';
            
            // Format skills as badges
            const skillsList = phase.skills && phase.skills.length > 0
                ? phase.skills.map(s => `<span class="skill-badge">${s}</span>`).join('')
                : '<span class="skill-badge">TBD</span>';
            
            // Format milestones with checkboxes
            const milestonesList = phase.milestones && phase.milestones.length > 0
                ? phase.milestones.map(m => `<li><input type="checkbox" class="milestone-checkbox"> ${m}</li>`).join('')
                : '<li>No milestones defined</li>';
            
            phasesHTML += `
                <div class="phase-card">
                    <h3>🎯 ${phase.phase_name || 'Phase ' + (index + 1)}</h3>
                    <p><strong>⏱️ Duration:</strong> ${phase.duration}</p>
                    
                    <div class="phase-section">
                        <h4>📚 Skills to Learn</h4>
                        <div class="skills-container">
                            ${skillsList}
                        </div>
                    </div>
                    
                    <div class="phase-section">
                        <h4>🛠️ Build These Projects</h4>
                        <ul class="projects-list">
                            ${projectsList}
                        </ul>
                    </div>
                    
                    <div class="phase-section">
                        <h4>✅ Milestones</h4>
                        <ul class="milestones-list">
                            ${milestonesList}
                        </ul>
                    </div>
                </div>
            `;
        });
    }
    
    timeline.innerHTML = timelineHTML || '<p>No phases found</p>';
    phasesContainer.innerHTML = phasesHTML || '<p>No phases found</p>';
}

async function loadProjects() {
    try {
        const result = await API.recommendProjects();
        displayProjects(result.projects);
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    
    if (!projects || projects.length === 0) {
        container.innerHTML = '<p>No projects recommended yet</p>';
        return;
    }
    
    let html = '';
    projects.forEach(project => {
        html += `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p>${project.description || 'No description'}</p>
                <div class="project-info">
                    <p><strong>Difficulty:</strong> ${project.difficulty}</p>
                    <p><strong>Duration:</strong> ${project.duration}</p>
                </div>
                <div class="skills-list">
                    ${project.skills?.map(s => `<span class="skill-tag">${s}</span>`).join('') || ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

async function loadResources() {
    try {
        const learningPath = await API.getLearningPath();
        displayResources(learningPath);
    } catch (error) {
        console.error('Failed to load resources:', error);
        document.getElementById('resources-container').innerHTML = '<p>Loading resources...</p>';
    }
}

function displayResources(learningPath) {
    const container = document.getElementById('resources-container');
    
    if (!learningPath.skills_to_learn || learningPath.skills_to_learn.length === 0) {
        container.innerHTML = '<p>🎉 All skills mastered! No more resources needed.</p>';
        return;
    }
    
    let html = '';
    
    learningPath.skills_to_learn.forEach(skillData => {
        html += `
            <div class="skill-resources">
                <h3>📚 ${skillData.skill}</h3>
                <ul class="resources-list">
        `;
        
        if (skillData.resources && skillData.resources.length > 0) {
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
        } else {
            html += '<li>No resources available</li>';
        }
        
        html += `
                </ul>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

async function loadProgressOverview() {
    const progressContainer = document.getElementById('progress-container');
    
    try {
        const learningPath = await API.getLearningPath();
        
        // Use backend learning path progress so it matches dashboard progress
        const currentSkills = learningPath.current_skills || [];
        const skillsToLearn = learningPath.skills_to_learn || [];
        const totalSkillsInRoadmap = learningPath.total_skills_needed || (currentSkills.length + skillsToLearn.length);
        const progressPercent = Math.round(learningPath.progress_percentage || 0);
        const matchedSkillsCount = totalSkillsInRoadmap - skillsToLearn.length;
        const skillsLearned = JSON.parse(localStorage.getItem('skillsLearned')) || [];
        
        let html = `
            <p><strong>Career Goal:</strong> ${learningPath.career_goal}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <p><strong>${matchedSkillsCount} of ${totalSkillsInRoadmap} skills completed (${progressPercent}%)</strong></p>
            
            <div class="progress-section">
                <h3>📚 Skills to Learn (from Roadmap)</h3>
        `;
        
        if (skillsToLearn.length > 0) {
            html += '<div class="skills-to-learn">';
            // Remove duplicates
            const uniqueSkillsList = [...new Set(skillsToLearn.map(item => item.skill))];
            uniqueSkillsList.forEach(skill => {
                const isLearned = skillsLearned.some(learned => learned.toLowerCase() === skill.toLowerCase());
                if (isLearned) {
                    html += `<span class="skill-badge" style="background: #d4edda; color: #155724;">✅ ${skill}</span>`;
                } else {
                    html += `<span class="skill-badge-todo">${skill}</span>`;
                }
            });
            html += '</div>';
        } else {
            html += '<p><em>No more skills to learn! You\'re all caught up!</em></p>';
        }
        
        // Show current skills
        if (learningPath.current_skills.length > 0) {
            html += `
                <h3>✅ Skills You Already Have</h3>
                <div class="skills-container">
            `;
            learningPath.current_skills.forEach(item => {
                html += `<span class="skill-badge">${item.skill}</span>`;
            });
            html += '</div>';
        }
        
        html += '</div>';
        progressContainer.innerHTML = html;
    } catch (error) {
        console.error('Failed to load progress overview:', error);
        progressContainer.innerHTML = '<p>Unable to load progress. Please refresh the page.</p>';
    }
}

function startProject(title) {
    alert(`Starting: ${title}`);
    // Implement project tracking
}

function generatePortfolio() {
    window.location.href = 'portfolio.html';
}

// Skill Learned Tracker
let skillsLearned = JSON.parse(localStorage.getItem('skillsLearned')) || [];

function addSkillLearned() {
    const input = document.getElementById('skill-input');
    const skill = input.value.trim();
    
    if (!skill) {
        alert('Please enter a skill name');
        return;
    }
    
    // Check if skill matches any in skills to learn
    const skillsToLearn = [];
    if (currentRoadmap && currentRoadmap.phases) {
        currentRoadmap.phases.forEach(phase => {
            if (phase.skills && Array.isArray(phase.skills)) {
                skillsToLearn.push(...phase.skills);
            }
        });
    }
    
    const skillMatches = skillsToLearn.some(s => s.toLowerCase() === skill.toLowerCase());
    
    if (!skillsLearned.includes(skill)) {
        skillsLearned.push(skill);
        localStorage.setItem('skillsLearned', JSON.stringify(skillsLearned));
        
        // Show feedback
        if (skillMatches) {
            alert(`✅ Great! "${skill}" is in your roadmap and has been marked as learned!`);
        } else {
            alert(`Added "${skill}" to your learned skills.`);
        }
        
        // Update progress bar
        updateProgressOverview();
        displaySkillsLearned();
    } else {
        alert(`"${skill}" is already in your learned skills list`);
    }
    
    input.value = '';
}

function displaySkillsLearned() {
    const container = document.getElementById('skills-learned-container');
    if (!container) return;
    
    if (skillsLearned.length === 0) {
        container.innerHTML = '<p style="color: #666;">No skills learned yet. Start adding them!</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
    skillsLearned.forEach(skill => {
        html += `
            <div style="background: #d4edda; padding: 8px 12px; border-radius: 5px; display: flex; align-items: center; gap: 8px;">
                <span>✅ ${skill}</span>
                <button onclick="removeSkillLearned('${skill}')" style="background: none; border: none; color: #dc3545; cursor: pointer; font-size: 1.2rem;">×</button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function removeSkillLearned(skill) {
    skillsLearned = skillsLearned.filter(s => s !== skill);
    localStorage.setItem('skillsLearned', JSON.stringify(skillsLearned));
    displaySkillsLearned();
    updateProgressOverview();
}

function displaySkillsToLearn() {
    const container = document.getElementById('skills-to-learn-container');
    if (!container) return;
    
    const skillsToLearn = [];
    if (currentRoadmap && currentRoadmap.phases) {
        currentRoadmap.phases.forEach(phase => {
            if (phase.skills && Array.isArray(phase.skills)) {
                phase.skills.forEach(skill => {
                    if (!skillsToLearn.includes(skill)) {
                        skillsToLearn.push(skill);
                    }
                });
            }
        });
    }
    
    if (skillsToLearn.length === 0) {
        container.innerHTML = '<p style="color: #666;">No skills to learn defined in roadmap.</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
    skillsToLearn.forEach(skill => {
        const isLearned = skillsLearned.some(s => s.toLowerCase() === skill.toLowerCase());
        if (isLearned) {
            html += `<span class="skill-badge" style="background: #d4edda; color: #155724; text-decoration: line-through;">✅ ${skill}</span>`;
        } else {
            html += `<span class="skill-badge">${skill}</span>`;
        }
    });
    html += '</div>';
    container.innerHTML = html;
}

// Update initialization to display skills learned
function updateProgressOverview() {
    displaySkillsLearned();
    displaySkillsToLearn();
    loadProgressOverview(); // Recalculate progress
}
