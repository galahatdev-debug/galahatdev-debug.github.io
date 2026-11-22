let currentLang = 'tr';

// =========================================================
// RENDERING ENGINE & UI HELPERS
// =========================================================
function renderDots(score, max = 5) {
    let html = '<div class="flex items-center gap-1.5" aria-label="' + score + ' / ' + max + '">';
    for (let i = 1; i <= max; i++) {
        html += `<span class="skill-dot ${i <= score ? 'active' : 'inactive'}"></span>`;
    }
    html += '</div>';
    return html;
}

function setLanguage(lang) {
    if (!window.cvData || !window.cvData[lang]) return;
    currentLang = lang;
    const data = window.cvData[lang];

    // Update HTML lang and dir attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = data.dir;

    // Update active button states in header
    ['tr', 'en', 'ar'].forEach(code => {
        const btn = document.getElementById(`btn-lang-${code}`);
        if (code === lang) {
            btn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 bg-sky-500 text-zinc-950 shadow-sm';
        } else {
            btn.className = `px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 text-zinc-400 hover:text-white ${code === 'ar' ? 'font-arabic' : ''}`;
        }
    });

    // UI Labels
    document.getElementById('ui-status-badge').textContent = data.ui.status;
    document.getElementById('ui-print-btn').textContent = data.ui.print;
    document.getElementById('cv-tr-label').textContent = data.ui.trPhoneLabel;
    document.getElementById('cv-sa-label').textContent = data.ui.saPhoneLabel;

    const photoImg = document.getElementById('cv-photo');
    if (photoImg) photoImg.alt = data.hero.name;

    const photoPlaceholder = document.getElementById('cv-photo-placeholder');
    if (photoPlaceholder) photoPlaceholder.textContent = data.ui.photoLabel;

    document.getElementById('ui-personal-title').textContent = data.ui.personalTitle;
    document.getElementById('ui-skills-title').textContent = data.ui.skillsTitle;
    document.getElementById('ui-languages-title').textContent = data.ui.languagesTitle;
    document.getElementById('ui-experience-title').textContent = data.ui.experienceTitle;
    document.getElementById('ui-projects-title').textContent = data.ui.projectsTitle;
    document.getElementById('ui-education-title').textContent = data.ui.educationTitle;
    document.getElementById('ui-footer-copyright').textContent = data.ui.copyright;
    document.getElementById('ui-footer-references').textContent = data.ui.references;
    document.getElementById('toast-msg').textContent = data.ui.copied;

    // Hero Content
    document.getElementById('cv-name').textContent = data.hero.name;
    document.getElementById('cv-title').textContent = data.hero.title;
    document.getElementById('cv-bio').textContent = data.hero.bio;
    document.getElementById('cv-hero-location').textContent = data.hero.location;

    // 1. Personal Info
    const personalList = document.getElementById('cv-personal-list');
    personalList.innerHTML = data.personal.map(item => `
        <li class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 flex-shrink-0 mt-0.5">
                <i class="fa-solid ${item.icon} text-xs"></i>
            </div>
            <div>
                <span class="block text-xs text-zinc-400">${item.label}</span>
                <span class="font-medium text-zinc-100">${item.value}</span>
            </div>
        </li>
    `).join('');

    // 2. Skills
    const skillsContainer = document.getElementById('cv-skills-container');
    skillsContainer.innerHTML = data.skillGroups.map(group => `
        <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-sky-400/90 mb-3">${group.category}</h3>
            <div class="space-y-2.5">
                ${group.items.map(skill => `
                    <div class="flex items-center justify-between gap-2 text-sm">
                        <span class="text-zinc-200 font-medium">${skill.name}</span>
                        ${renderDots(skill.level)}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // 3. Languages
    const languagesContainer = document.getElementById('cv-languages-container');
    languagesContainer.innerHTML = data.languages.map(langItem => `
        <div class="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div>
                <div class="font-semibold text-sm text-zinc-100">${langItem.name}</div>
                <div class="text-xs text-zinc-400">${langItem.levelText}</div>
            </div>
            ${renderDots(langItem.score)}
        </div>
    `).join('');

    // 4. Work Experience
    const expList = document.getElementById('cv-experience-list');
    expList.innerHTML = data.experience.map(exp => `
        <article class="timeline-item group">
            <span class="timeline-dot"></span>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
                <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    ${exp.role}
                </h3>
                <span class="badge-pill inline-flex items-center self-start sm:self-auto px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-400/25 text-sky-400 text-xs font-semibold whitespace-nowrap">
                    ${exp.period}
                </span>
            </div>
            <div class="text-xs sm:text-sm font-semibold text-zinc-400 mb-3">
                ${exp.company}
            </div>
            <ul class="space-y-2 text-sm text-zinc-300 list-disc list-inside marker:text-sky-400">
                ${exp.bullets.map(bullet => `<li class="leading-relaxed">${bullet}</li>`).join('')}
            </ul>
        </article>
    `).join('');

    // 5. Projects
    const projList = document.getElementById('cv-projects-list');
    projList.innerHTML = data.projects.map(proj => `
        <article class="timeline-item group">
            <span class="timeline-dot"></span>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
                <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    ${proj.title}
                </h3>
                <span class="badge-pill inline-flex items-center self-start sm:self-auto px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-zinc-300 text-xs font-semibold">
                    ${proj.organization}
                </span>
            </div>
            <ul class="space-y-2 text-sm text-zinc-300 list-disc list-inside marker:text-sky-400 mt-2">
                ${proj.bullets.map(bullet => `<li class="leading-relaxed">${bullet}</li>`).join('')}
            </ul>
        </article>
    `).join('');

    // 6. Education
    const eduList = document.getElementById('cv-education-list');
    eduList.innerHTML = data.education.map(edu => `
        <article class="timeline-item group">
            <span class="timeline-dot"></span>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
                <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    ${edu.degree}
                </h3>
                <span class="badge-pill inline-flex items-center self-start sm:self-auto px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-400/25 text-sky-400 text-xs font-semibold">
                    ${edu.period}
                </span>
            </div>
            <div class="text-sm font-semibold text-zinc-300 mb-1.5">
                ${edu.institution}
            </div>
            <p class="text-sm text-zinc-400">
                ${edu.description}
            </p>
        </article>
    `).join('');
}

function selectLanguage(lang) {
    setLanguage(lang);
    const modal = document.getElementById('lang-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Show Toast Helper
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-2');
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
    }, 2800);
}

// Copy Email Helper with Toast
function copyText(text, e) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    showToast(window.cvData[currentLang].ui.copied);
}
