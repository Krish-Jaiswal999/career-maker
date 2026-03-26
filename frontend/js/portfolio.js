/**
 * Portfolio Builder JavaScript
 */

let selectedTemplate = 'faang';
let portfolioInfo = null;

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await checkPortfolioInfo();
});

async function checkPortfolioInfo() {
    try {
        portfolioInfo = await API.getPortfolioInfo();
        // Show template options if portfolio info exists
        if (portfolioInfo && portfolioInfo.email) {
            document.getElementById('template-section').style.display = 'block';
        }
    } catch (error) {
        console.log('No portfolio info found yet');
    }
}

function goToPortfolioInfo() {
    window.location.href = 'portfolio-info.html';
}

function editInfo() {
    window.location.href = 'portfolio-info.html';
}

function selectTemplate(template) {
    selectedTemplate = template;
    
    // Highlight selected template
    const cards = document.querySelectorAll('.template-card');
    cards.forEach(card => {
        card.style.border = '2px solid transparent';
        card.style.backgroundColor = '#f9f9f9';
    });
    
    // Find and highlight the selected card
    const event = new Event('click');
    const selectedCard = Array.from(cards).find(card => 
        card.textContent.toLowerCase().includes(template)
    );
    if (selectedCard) {
        selectedCard.style.border = '3px solid #667eea';
        selectedCard.style.backgroundColor = '#f0f4ff';
        selectedCard.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.3)';
    }
    
    generatePreview();
}

async function generatePreview() {
    try {
        const result = await API.generatePortfolioHtml(selectedTemplate);
        displayPreview(result.html);
        document.getElementById('preview-section').style.display = 'block';
    } catch (error) {
        alert('Failed to generate portfolio: ' + error);
    }
}

function displayPreview(htmlContent) {
    const preview = document.getElementById('portfolio-preview');
    preview.srcdoc = htmlContent;
}

function exportPortfolio() {
    const preview = document.getElementById('portfolio-preview');
    const htmlContent = preview.srcdoc;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));
    element.setAttribute('download', 'portfolio.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function publishPortfolio() {
    alert('Portfolio publishing feature coming soon! You can download it now using "Export HTML".');
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
