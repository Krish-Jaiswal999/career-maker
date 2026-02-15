/**
 * Portfolio Information Form JavaScript
 */

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    loadPortfolioInfo();
});

async function loadPortfolioInfo() {
    try {
        const info = await API.getPortfolioInfo();
        
        // Populate form with existing data
        document.getElementById('phone').value = info.phone || '';
        document.getElementById('city').value = info.city || '';
        document.getElementById('state').value = info.state || '';
        document.getElementById('country').value = info.country || '';
        document.getElementById('professional_summary').value = info.professional_summary || '';
        document.getElementById('email').value = info.email || '';
        document.getElementById('linkedin_url').value = info.linkedin_url || '';
        document.getElementById('github_url').value = info.github_url || '';
        document.getElementById('portfolio_url').value = info.portfolio_url || '';
        document.getElementById('twitter_url').value = info.twitter_url || '';
        document.getElementById('highest_degree').value = info.highest_degree || '';
        document.getElementById('university').value = info.university || '';
        document.getElementById('major').value = info.major || '';
        document.getElementById('graduation_year').value = info.graduation_year || '';
        document.getElementById('additional_certifications').value = info.additional_certifications || '';
        document.getElementById('current_title').value = info.current_title || '';
        document.getElementById('current_company').value = info.current_company || '';
        document.getElementById('total_experience').value = info.total_experience || '';
        document.getElementById('work_experience').value = info.work_experience || '';
        document.getElementById('achievements').value = info.achievements || '';
        document.getElementById('projects').value = info.projects || '';
        document.getElementById('languages').value = info.languages || '';
    } catch (error) {
        console.log('No existing portfolio info found, starting fresh');
    }
}

document.getElementById('portfolio-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
        { id: 'phone', label: 'Phone Number' },
        { id: 'city', label: 'City' },
        { id: 'state', label: 'State/Province' },
        { id: 'country', label: 'Country' },
        { id: 'email', label: 'Email' },
        { id: 'highest_degree', label: 'Highest Degree' },
        { id: 'university', label: 'University/School' },
        { id: 'major', label: 'Major/Field of Study' },
        { id: 'total_experience', label: 'Total Years of Experience' }
    ];
    
    let missingFields = [];
    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value || element.value.trim() === '') {
            missingFields.push(field.label);
        }
    }
    
    if (missingFields.length > 0) {
        alert('Please fill in all required fields:\n\n' + missingFields.join('\n'));
        return;
    }
    
    const formData = {
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        country: document.getElementById('country').value,
        professional_summary: document.getElementById('professional_summary').value || null,
        email: document.getElementById('email').value,
        linkedin_url: document.getElementById('linkedin_url').value || null,
        github_url: document.getElementById('github_url').value || null,
        portfolio_url: document.getElementById('portfolio_url').value || null,
        twitter_url: document.getElementById('twitter_url').value || null,
        highest_degree: document.getElementById('highest_degree').value,
        university: document.getElementById('university').value,
        major: document.getElementById('major').value,
        graduation_year: document.getElementById('graduation_year').value ? 
            parseInt(document.getElementById('graduation_year').value) : null,
        additional_certifications: document.getElementById('additional_certifications').value || null,
        current_title: document.getElementById('current_title').value || null,
        current_company: document.getElementById('current_company').value || null,
        total_experience: parseInt(document.getElementById('total_experience').value) || 0,
        work_experience: document.getElementById('work_experience').value || null,
        achievements: document.getElementById('achievements').value || null,
        projects: document.getElementById('projects').value || null,
        languages: document.getElementById('languages').value || null
    };
    
    console.log('Form data being sent:', formData);
    
    try {
        await API.savePortfolioInfo(formData);
        alert('Portfolio information saved successfully!');
        window.location.href = 'portfolio.html';
    } catch (error) {
        console.error('Failed to save portfolio information:', error);
        alert('Failed to save portfolio information. Please try again.');
    }
});

function goBack() {
    window.history.back();
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
