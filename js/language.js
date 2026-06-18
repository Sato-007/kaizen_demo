document.addEventListener('DOMContentLoaded', () => {
    const languageToggle = document.getElementById('language-toggle');
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const errorBanner = document.getElementById('error-banner');
    
    // Set initial state of toggle
    if (languageToggle) {
        languageToggle.checked = (currentLang === 'ja');
        updateLabelState(currentLang);
        
        languageToggle.addEventListener('change', () => {
            const newLang = languageToggle.checked ? 'ja' : 'en';
            updateLabelState(newLang);
            setLanguage(newLang);
        });
    }

    // Initialize Language
    setLanguage(currentLang).catch(err => {
        console.error('Initial language load failed:', err);
        if (window.location.protocol === 'file:') {
            if (errorBanner) errorBanner.style.display = 'block';
        }
    });
});

function updateLabelState(lang) {
    const enLabel = document.querySelector('.en-label');
    const jpLabel = document.querySelector('.jp-label');
    if (enLabel && jpLabel) {
        if (lang === 'ja') {
            jpLabel.classList.add('active');
            enLabel.classList.remove('active');
        } else {
            enLabel.classList.add('active');
            jpLabel.classList.remove('active');
        }
    }
}

async function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;

    // Page Name Normalization
    let page = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    if (page === 'index') page = 'home';

    const errorBanner = document.getElementById('error-banner');

    try {
        // Load Translation Data
        const response = await fetch(`./lang/${lang}/${page}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const translations = await response.json();
        applyTranslations(translations);
        
        // Render Partners if on home page
        if (page === 'home' && translations.partners) {
            renderPartners(translations.partners);
            // Trigger main.js to re-initialize partners slider
            window.dispatchEvent(new CustomEvent('partnersLoaded'));
        }
        
        // Hide error banner if success
        if (errorBanner) errorBanner.style.display = 'none';
        
    } catch (error) {
        console.error('Translation error:', error);
        
        // Show error banner if we're on file:// protocol or if fetch failed
        if (window.location.protocol === 'file:' || error instanceof TypeError) {
            if (errorBanner) {
                errorBanner.style.display = 'block';
                // Also apply whatever translations we might have for the banner itself
                // (though if fetch failed, we can't get the banner text from JSON)
            }
        }
        throw error; // Re-throw to be caught by the initial caller
    }
}

function renderPartners(partnersData) {
    const container = document.getElementById('partners-slider-container');
    const controls = document.querySelector('.partners-controls');
    if (!container || !partnersData.list) return;

    container.innerHTML = '';
    if (controls) controls.innerHTML = '';

    const partnersPerPage = 6;
    const slidesCount = Math.ceil(partnersData.list.length / partnersPerPage);

    for (let i = 0; i < slidesCount; i++) {
        const slide = document.createElement('div');
        slide.className = `partner-slide ${i === 0 ? 'active' : ''}`;
        
        const start = i * partnersPerPage;
        const end = start + partnersPerPage;
        const pagePartners = partnersData.list.slice(start, end);

        pagePartners.forEach(partner => {
            const card = document.createElement('div');
            card.className = 'partner-card';
            card.innerHTML = `
                <div class="partner-logo-container">
                    <img src="${partner.logo}" alt="${partner.name}" class="partner-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="partner-logo-fallback" style="display: none;">
                        <span>${partner.name.charAt(0)}</span>
                    </div>
                </div>
                <span class="partner-name">${partner.name}</span>
            `;
            slide.appendChild(card);
        });

        container.appendChild(slide);

        // Add Dot
        if (controls) {
            const dot = document.createElement('div');
            dot.className = `partner-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-partner-slide', i);
            controls.appendChild(dot);
        }
    }
}

function applyTranslations(translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let text = translations;
        
        keys.forEach(k => {
            if (text) text = text[k];
        });

        if (text) {
            if (el.tagName === 'INPUT' && (el.type === 'placeholder' || el.getAttribute('placeholder'))) {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });
}
