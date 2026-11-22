// =========================================================
// TWO-PAGE A4 PDF TEMPLATE & DOWNLOADER
// =========================================================
function getPdfPhotoSrc() {
    const liveImg = document.getElementById('cv-photo');
    if (liveImg && liveImg.complete && liveImg.naturalWidth > 0) {
        try {
            const canvas = document.createElement('canvas');
            const tw = 660;
            const th = 840;
            canvas.width = tw;
            canvas.height = th;
            const scale = Math.max(tw / liveImg.naturalWidth, th / liveImg.naturalHeight);
            const sw = tw / scale;
            const sh = th / scale;
            const sx = (liveImg.naturalWidth - sw) / 2;
            const sy = 0;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(liveImg, sx, sy, sw, sh, 0, 0, tw, th);
            return canvas.toDataURL('image/png');
        } catch (err) {
            // file:// origin taints canvas; fall back to embedded base64
        }
    }
    if (window.cvPhotoDataUri) return window.cvPhotoDataUri;
    return 'cv_ph.jpeg';
}

// Isolate Latin/English runs inside RTL text so html2canvas renders their word order cleanly without overlapping
function isolateLtrForPdf(html, isRtl) {
    if (!isRtl || html === null || html === undefined) return html;
    const latinRunRegex = /(\([A-Za-z\u00C0-\u024F][^()\u0600-\u06FF]*[A-Za-z0-9\u00C0-\u024F)]\)|[A-Za-z\u00C0-\u024F][A-Za-z0-9\u00C0-\u024F.,&'’+\-/\s]*[A-Za-z0-9\u00C0-\u024F]|[A-Za-z\u00C0-\u024F])/g;
    return String(html).split(/(<[^>]+>)/g).map(part => {
        if (part.startsWith('<')) return part;
        return part.replace(latinRunRegex, match => {
            const trimmed = match.trim();
            if (!trimmed) return match;
            const start = match.indexOf(trimmed);
            const lead = match.slice(0, start);
            const trail = match.slice(start + trimmed.length);
            return `${lead}<span dir="ltr" style="display:inline-block; unicode-bidi:isolate;">${trimmed}</span>${trail}`;
        });
    }).join('');
}

// Build Exact Two-Page A4 HTML Template (2 x 210mm x 297mm)
function buildTwoPageA4HTML(data, photoSrc) {
    const isRtl = data.dir === 'rtl';
    const t = (val) => isolateLtrForPdf(val, isRtl);
    const cleanBullet = (html) => t(html.replace(/class="metric-highlight"/g, 'class="a4-metric"'));
    const renderA4Dots = (score) => {
        let dots = '<span style="display:inline-flex; gap:3.5px; align-items:center; flex-shrink:0;">';
        for (let i = 1; i <= 5; i++) {
            dots += `<span style="width:7px; height:7px; border-radius:50%; display:inline-block; background:${i <= score ? '#0284c7' : '#cbd5e1'};"></span>`;
        }
        dots += '</span>';
        return dots;
    };

    const renderBulletList = (bullets, extraStyle = '') => `
        <div style="font-size:8.8pt; color:#1e293b; line-height:1.45; ${extraStyle}">
            ${bullets.map(b => `
                <div style="display:flex; align-items:flex-start; gap:7px; margin-bottom:3.5px;">
                    <span style="color:#0284c7; font-weight:800; line-height:1.35;">•</span>
                    <span style="flex:1;">${cleanBullet(b)}</span>
                </div>
            `).join('')}
        </div>
    `;

    const renderExpItem = (exp) => `
        <div style="margin-bottom:11px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;">
                <span style="font-size:9.8pt; font-weight:800; color:#0f172a;">${t(exp.role)}</span>
                <span style="font-size:8.5pt; font-weight:700; color:#0369a1; white-space:nowrap;">${t(exp.period)}</span>
            </div>
            <div style="font-size:8.6pt; font-weight:600; color:#475569; margin:1.5px 0 4px 0;">${t(exp.company)}</div>
            ${renderBulletList(exp.bullets)}
        </div>
    `;

    // Split experience across Page 1 (first 4 roles) and Page 2 (remaining role + Projects + Skills)
    const page1Experiences = data.experience.slice(0, 4).map(renderExpItem).join('');
    const page2Experiences = data.experience.slice(4).map(renderExpItem).join('');

    const personalGridHtml = data.personal.map(p => `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:5px; padding:5px 8px;">
            <div style="font-size:7.2pt; color:#64748b; font-weight:600;">${t(p.label)}</div>
            <div style="font-size:8.2pt; color:#0f172a; font-weight:700; margin-top:1px;">${t(p.value)}</div>
        </div>
    `).join('');

    const langsHtml = data.languages.map(l => `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:8.4pt; margin-bottom:4px;">
            <div>
                <span style="font-weight:700; color:#0f172a;">${t(l.name)}</span>
                <span style="color:#64748b; font-size:7.6pt; margin-${isRtl ? 'right' : 'left'}:4px;">(${t(l.levelText)})</span>
            </div>
            ${renderA4Dots(l.score)}
        </div>
    `).join('');

    const eduHtml = data.education.map(edu => `
        <div>
            <div style="font-size:8.8pt; font-weight:800; color:#0f172a;">${t(edu.degree)}</div>
            <div style="font-size:8.2pt; font-weight:700; color:#0369a1; margin-top:1px;">${t(edu.institution)} (${t(edu.period)})</div>
            <div style="font-size:7.8pt; color:#475569; margin-top:2px;">${t(edu.description)}</div>
        </div>
    `).join('');

    const projHtml = data.projects.map(proj => `
        <div style="margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <span style="font-size:9.8pt; font-weight:800; color:#0f172a;">${t(proj.title)}</span>
                <span style="font-size:8.5pt; font-weight:700; color:#475569;">${t(proj.organization)}</span>
            </div>
            ${renderBulletList(proj.bullets, 'margin-top:4px;')}
        </div>
    `).join('');

    const skillsGridHtml = data.skillGroups.map(g => `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px;">
            <div style="font-size:8.6pt; font-weight:800; color:#0284c7; margin-bottom:6px; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${t(g.category)}</div>
            <div>
                ${g.items.map(s => `
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; font-size:8.3pt; color:#1e293b; line-height:1.4; margin-bottom:4px;">
                        <span>• ${t(s.name)}</span>
                        ${renderA4Dots(s.level)}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    const pageLabel1 = currentLang === 'tr' ? 'Sayfa 1 / 2' : (currentLang === 'ar' ? 'صفحة 1 / 2' : 'Page 1 of 2');
    const pageLabel2 = currentLang === 'tr' ? 'Sayfa 2 / 2' : (currentLang === 'ar' ? 'صفحة 2 / 2' : 'Page 2 of 2');

    return `
        <!-- ==================== PAGE 1 ==================== -->
        <div class="a4-sheet" dir="${data.dir}" style="page-break-after: always; break-after: page;">
            <div style="flex:1; display:flex; flex-direction:column;">
                <!-- Top Header -->
                <div class="a4-header">
                    <div style="width:33mm; height:42mm; border-radius:4px; background:#ffffff; border:2px solid rgba(255,255,255,0.28); overflow:hidden; flex-shrink:0;">
                        <img src="${photoSrc}" alt="${data.hero.name}" style="display:block; width:33mm; height:42mm;">
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:18pt; font-weight:800; color:#ffffff; line-height:1.15;">${t(data.hero.name)}</div>
                        <div style="font-size:9.3pt; font-weight:700; color:#e0f2fe; margin:3px 0 6px 0;">${t(data.hero.title)}</div>
                        <div style="font-size:8.2pt; color:#f4f4f5; line-height:1.42;">${t(data.hero.bio)}</div>
                    </div>
                    <div style="text-align:${isRtl ? 'left' : 'right'}; font-size:7.9pt; color:#ffffff; line-height:1.7; white-space:nowrap; background:rgba(0,0,0,0.18); border:1px solid rgba(255,255,255,0.22); padding:7px 9px; border-radius:6px; flex-shrink:0;">
                        <div style="display:flex; align-items:center; justify-content:${isRtl ? 'flex-start' : 'flex-end'}; gap:5px;">
                            <a href="tel:+905318259956" style="color:#ffffff; text-decoration:none;"><strong>${t(data.ui.trPhoneLabel)}</strong> <span dir="ltr">+90 531 825 9956</span></a>
                            <a href="https://wa.me/905318259956" style="display:inline-flex; align-items:center; gap:3px; background:#dcfce7; color:#15803d; border:1px solid #86efac; border-radius:4px; padding:1px 5px; font-size:7.1pt; font-weight:700; text-decoration:none; line-height:1.2;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="9" height="9" fill="#15803d" style="display:block;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                                <span>WhatsApp</span>
                            </a>
                        </div>
                        <div><a href="tel:+966502717235" style="color:#ffffff; text-decoration:none;"><strong>${t(data.ui.saPhoneLabel)}</strong> <span dir="ltr">+966 50 271 7235</span></a></div>
                        <div><a href="mailto:mert.koc.ksa@gmail.com" dir="ltr" style="color:#bae6fd; font-weight:700; text-decoration:none;">mert.koc.ksa@gmail.com</a></div>
                    </div>
                </div>

                <!-- Personal Info Grid -->
                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:6px; margin-bottom:10px;">
                    ${personalGridHtml}
                </div>

                <!-- Education & Languages Two-Column Bar -->
                <div style="display:grid; grid-template-columns: 52% 46%; gap:2%; margin-bottom:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px;">
                    <div>
                        <div class="a4-sec-title" style="margin-bottom:5px;">${t(data.ui.educationTitle)}</div>
                        ${eduHtml}
                    </div>
                    <div>
                        <div class="a4-sec-title" style="margin-bottom:5px;">${t(data.ui.languagesTitle)}</div>
                        ${langsHtml}
                    </div>
                </div>

                <!-- Work Experience (Part 1) -->
                <div style="flex:1;">
                    <div class="a4-sec-title">${t(data.ui.experienceTitle)}</div>
                    ${page1Experiences}
                </div>
            </div>

            <!-- Footer Page 1 -->
            <div style="border-top:1px solid #e2e8f0; padding-top:5px; display:flex; justify-content:space-between; font-size:7.8pt; color:#64748b;">
                <span>${t(`${data.hero.name} — CV`)}</span>
                <span>${pageLabel1}</span>
            </div>
        </div>

        <!-- ==================== PAGE 2 ==================== -->
        <div class="a4-sheet" dir="${data.dir}">
            <div style="flex:1; display:flex; flex-direction:column;">
                <!-- Continuation Header -->
                <div style="border-bottom:1.5px solid #cbd5e1; padding-bottom:6px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:11pt; font-weight:800; color:#0f172a;">${t(data.hero.name)}</span>
                    <span style="font-size:8.5pt; font-weight:600; color:#0284c7;">${t(data.hero.title)}</span>
                </div>

                <!-- Work Experience (Continued) -->
                ${page2Experiences ? `
                    <div style="margin-bottom:14px;">
                        <div class="a4-sec-title">${t(data.ui.experienceTitle)}</div>
                        ${page2Experiences}
                    </div>
                ` : ''}

                <!-- Projects -->
                <div style="margin-bottom:16px;">
                    <div class="a4-sec-title">${t(data.ui.projectsTitle)}</div>
                    ${projHtml}
                </div>

                <!-- Skills (3 Columns) -->
                <div style="margin-bottom:16px;">
                    <div class="a4-sec-title">${t(data.ui.skillsTitle)}</div>
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
                        ${skillsGridHtml}
                    </div>
                </div>

                <!-- References Note -->
                <div style="margin-top:8px; padding:10px 12px; background:#f8fafc; border-${isRtl ? 'right' : 'left'}:3px solid #0284c7; border-radius:4px; font-size:8.6pt; font-style:italic; color:#334155;">
                    ${t(data.ui.references)}
                </div>
            </div>

            <!-- Footer Page 2 -->
            <div style="border-top:1px solid #e2e8f0; padding-top:5px; display:flex; justify-content:space-between; font-size:7.8pt; color:#64748b;">
                <span>${t(`${data.hero.name} — CV`)}</span>
                <span>${pageLabel2}</span>
            </div>
        </div>
    `;
}

// Direct Two-Page A4 PDF Generator & Downloader
async function downloadPDF() {
    const data = window.cvData[currentLang];
    const btn = document.getElementById('btn-download-pdf');
    const btnText = document.getElementById('ui-print-btn');
    const btnIcon = document.getElementById('ui-pdf-icon');

    if (typeof html2pdf === 'undefined') {
        window.print();
        return;
    }

    btn.disabled = true;
    btnIcon.className = 'fa-solid fa-spinner fa-spin';
    btnText.textContent = data.ui.generatingPdf;

    const prevScrollX = window.scrollX;
    const prevScrollY = window.scrollY;

    // Show loading backdrop while rendering off-overlay A4 sheets at (0, 0)
    const overlay = document.createElement('div');
    overlay.id = 'pdf-loading-overlay';
    overlay.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin text-3xl text-sky-400"></i>
        <span class="text-sm font-semibold">${data.ui.generatingPdf}</span>
    `;
    document.body.appendChild(overlay);

    window.scrollTo(0, 0);

    const photoSrc = getPdfPhotoSrc();
    const wrapper = document.createElement('div');
    wrapper.id = 'a4-pdf-wrapper';
    wrapper.innerHTML = buildTwoPageA4HTML(data, photoSrc);
    document.body.appendChild(wrapper);

    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }
    await new Promise(resolve => setTimeout(resolve, 180));

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const renderScale = isIOS ? 3 : 4;

    const makePageOpt = (sheet) => ({
        margin: 0,
        filename: 'Mert_Koc_CV.pdf',
        image: { type: 'png' },
        html2canvas: {
            scale: renderScale,
            useCORS: true,
            backgroundColor: '#ffffff',
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0,
            width: sheet.offsetWidth,
            height: sheet.offsetHeight,
            windowWidth: sheet.offsetWidth,
            windowHeight: sheet.offsetHeight,
            ignoreElements: (el) => el.id === 'pdf-loading-overlay'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
    });

    let origFillText = null;
    if (data.dir === 'rtl' && typeof CanvasRenderingContext2D !== 'undefined') {
        origFillText = CanvasRenderingContext2D.prototype.fillText;
        CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
            const hasArabic = typeof text === 'string' && /[\u0600-\u06FF]/.test(text);
            if (hasArabic && 'direction' in this) {
                const prevDir = this.direction;
                const prevAlign = this.textAlign;
                this.direction = 'rtl';
                if (prevAlign === 'start' || !prevAlign) {
                    this.textAlign = 'left';
                }
                try {
                    return maxWidth !== undefined
                        ? origFillText.call(this, text, x, y, maxWidth)
                        : origFillText.call(this, text, x, y);
                } finally {
                    this.direction = prevDir;
                    this.textAlign = prevAlign;
                }
            }
            return maxWidth !== undefined
                ? origFillText.call(this, text, x, y, maxWidth)
                : origFillText.call(this, text, x, y);
        };
    }

    const cleanup = () => {
        if (origFillText && typeof CanvasRenderingContext2D !== 'undefined') {
            CanvasRenderingContext2D.prototype.fillText = origFillText;
            origFillText = null;
        }
        if (wrapper.parentNode) wrapper.remove();
        if (overlay.parentNode) overlay.remove();
        window.scrollTo(prevScrollX, prevScrollY);
        btn.disabled = false;
        btnIcon.className = 'fa-solid fa-file-pdf';
        btnText.textContent = data.ui.print;
    };

    try {
        const sheets = Array.from(wrapper.querySelectorAll('.a4-sheet'));
        sheets.forEach((s, idx) => {
            s.style.display = idx === 0 ? 'flex' : 'none';
        });

        const pdf = await html2pdf().set(makePageOpt(sheets[0])).from(sheets[0]).toPdf().get('pdf');

        for (let i = 1; i < sheets.length; i++) {
            sheets[i - 1].style.display = 'none';
            sheets[i].style.display = 'flex';
            const canvas = await html2pdf().set(makePageOpt(sheets[i])).from(sheets[i]).toCanvas().get('canvas');
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = Math.min((canvas.height * pageW) / canvas.width, pdf.internal.pageSize.getHeight());
            pdf.addPage('a4', 'portrait');
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageW, pageH, undefined, 'FAST');
        }

        pdf.save('Mert_Koc_CV.pdf');
        cleanup();
        showToast(data.ui.pdfReady);
    } catch (err) {
        console.error('PDF export error:', err);
        cleanup();
        window.print();
    }
}
