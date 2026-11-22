window.cvData = window.cvData || {};

window.cvData.tr = {
    dir: 'ltr',
    ui: {
        status: 'Güncel',
        print: 'PDF İndir',
        generatingPdf: 'PDF Hazırlanıyor...',
        pdfReady: 'Mert_Koc_CV.pdf indirildi!',
        trPhoneLabel: 'Türkiye:',
        saPhoneLabel: 'Suudi Arabistan:',
        photoLabel: 'Fotoğraf',
        personalTitle: 'Kişisel Bilgiler',
        skillsTitle: 'Beceriler',
        languagesTitle: 'Diller',
        experienceTitle: 'İş Deneyimi',
        projectsTitle: 'Projeler',
        educationTitle: 'Eğitim',
        copyright: '© 2026 Mert Koç. Tüm hakları saklıdır.',
        references: 'Referanslar ve ilgili belgeler talep edildiğinde sunulacaktır.',
        copied: 'E-posta panoya kopyalandı!'
    },
    hero: {
        name: 'Mert Koç',
        title: 'İşletme Yönetimi | Satış, Dijital Pazarlama ve Proje Yönetimi Uzmanı',
        bio: 'Satış, dijital pazarlama, ithalat-ihracat ve proje yönetimi alanlarında deneyimli işletme yönetimi profesyoneli. Girişimcilik ve müşteri hizmetleri geçmişiyle birlikte hem bireysel müşterilere hem de firmalara satış yapma, yeni müşteriler bulma, reklam yönetme ve ekip kurma konularında uzman.',
        location: 'Suudi Arabistan / Riyad & Türkiye'
    },
    personal: [
        { icon: 'fa-location-dot', label: 'Konum', value: 'Suudi Arabistan / Riyad & Türkiye' },
        { icon: 'fa-passport', label: 'Uyruk', value: 'T.C. / Suriye Çifte Vatandaşı' },
        { icon: 'fa-id-card', label: 'Ehliyet', value: 'Türk Sürücü Belgesi (B Sınıfı)' },
        { icon: 'fa-plane-departure', label: 'Taşınma Durumu', value: 'İş teklifi halinde şehir ve ülke değiştirebilir' }
    ],
    skillGroups: [
        {
            category: 'Satış & Müşteri',
            items: [
                { name: 'Bireysel ve Kurumsal Satış', level: 5 },
                { name: 'Mağaza Yönetimi', level: 5 },
                { name: 'Müşteri İlişkileri Takibi', level: 5 },
                { name: 'İkna ve Pazarlık', level: 4 },
                { name: 'Sunum Becerileri', level: 4 }
            ]
        },
        {
            category: 'Pazarlama & Analiz',
            items: [
                { name: 'Dijital Reklam Yönetimi', level: 4 },
                { name: 'Sosyal Medya ve İçerik Üretimi', level: 5 },
                { name: 'Veri Analizi ve Raporlama', level: 4 },
                { name: 'Girişimcilik ve İş Geliştirme', level: 4 }
            ]
        },
        {
            category: 'Yönetim & Ofis',
            items: [
                { name: 'Ekip Liderliği', level: 5 },
                { name: 'İthalat ve İhracat Süreçleri', level: 4 },
                { name: 'Problem Çözme', level: 5 },
                { name: 'Microsoft Office (Word, Excel, PowerPoint)', level: 4 }
            ]
        }
    ],
    languages: [
        { name: 'Arapça', levelText: 'Anadil', score: 5 },
        { name: 'Türkçe', levelText: 'Çok İyi / Akıcı', score: 5 },
        { name: 'İngilizce', levelText: 'Orta Seviye', score: 3 }
    ],
    experience: [
        {
            role: 'Satış ve Pazarlama Uzmanı',
            period: '2025 – 2026',
            company: 'BusinessPillars (Arkan Al-Aamal for Industry) — Suudi Arabistan',
            bullets: [
                'Mağaza satışlarını yönettim, satış ekibine liderlik ettim ve satışları başarıyla kapattım.',
                'Hem bireysel müşterilere hem de şirketlere yönelik yeni satış kanalları ve iş ortaklıkları kurdum.',
                'Dijital reklamları iyileştirerek aynı bütçeyle reklamlara tıklanma sayısını <span class="metric-highlight">16 kat artırdım</span>, tıklama başına maliyeti <span class="metric-highlight">%94 düşürdüm</span>.',
                'Markanın sosyal medya ve görsel içeriklerini hazırlayarak dijital görünürlüğünü güçlendirdim.',
                'Yeni işe başlayan personelin alım ve eğitim süreçlerini yönettim.'
            ]
        },
        {
            role: 'Proje Yöneticisi ve Girişimci',
            period: '2022 – 2025',
            company: 'One Qirat Jewelry — Suudi Arabistan',
            bullets: [
                'Projelerin başından sonuna kadar tüm adımlarını planladım ve takip ettim.',
                'Reklam sonuçlarını ve piyasa trendlerini inceleyerek yeni pazarlama planları uyguladım.',
                'Sosyal medya hesaplarını yönettim ve tanıtım kampanyaları düzenledim.',
                'Müşterilerle birebir ilgilenerek yüksek müşteri memnuniyeti sağladım.'
            ]
        },
        {
            role: 'Proje Yöneticisi ve Müşteri Hizmetleri',
            period: '2020 – 2022',
            company: 'Almasat Alkhalij Jewelry — Suudi Arabistan ve Kuveyt',
            bullets: [
                'Satış rakamlarını düzenli takip edip raporladım, satışları artırmak için yeni yöntemler geliştirdim.',
                'Önemli müşterilerle uzun vadeli ve güvene dayalı ticari ilişkiler kurdum.',
                'Sosyal medya ve dijital reklam verilerini analiz ederek sonraki kampanyaları planladım.'
            ]
        },
        {
            role: 'Müşteri Hizmetleri ve Çağrı Merkezi',
            period: '2019 – 2020',
            company: 'Royal Home Real Estate — Türkiye',
            bullets: [
                'Müşterileri telefonla arayarak kampanyaları tanıttım ve yeni satışlar gerçekleştirdim.',
                'Ev almak isteyen müşterilere yer gösterimi ve tanıtım turları düzenledim.'
            ]
        },
        {
            role: 'Tur Rehberi',
            period: '2012 – 2014',
            company: 'Alawadi Company for Hajj and Umrah — Suudi Arabistan',
            bullets: [
                'Hac ve Umre turlarında kafilelerin güvenliğini ve konforunu sağladım, yolculara net bilgi ve yönlendirme verdim.',
                'Diğer rehberler ve saha ekibiyle birlikte çalışarak turların sorunsuz ilerlemesini sağladım.',
                'Misafirlerin tüm ihtiyaçlarıyla yakından ilgilenerek yüksek memnuniyet sağladım.'
            ]
        }
    ],
    projects: [
        {
            title: 'Üretim ve Operasyon Yönetimi',
            organization: 'KHB Company',
            bullets: [
                'Su manyetize etme cihazları ve parfüm üretim süreçlerini baştan sona yönettim.',
                'Yurt dışı alım-satım (ithalat ve ihracat) işlemlerini yürüttüm.'
            ]
        }
    ],
    education: [
        {
            degree: 'İşletme Lisans Mezunu',
            period: '2020 Mezuniyeti',
            institution: 'Karabük Üniversitesi',
            description: 'İşletme yönetimi, pazarlama ve ticaret alanlarında lisans eğitimi.'
        }
    ]
};
