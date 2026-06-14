/**
 * Alp Psikoloji - Interactive Engine
 * Author: Antigravity Pair-Programming with Alp
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Preloader
    initPreloader();

    // Initialize Theme
    initTheme();

    // Scroll Effects (Sticky header, back-to-top)
    initScrollEffects();

    // Mobile Drawer Menu
    initMobileNav();

    // Intersection Observer for Reveal Animations
    initScrollReveal();

    // Tabs for Hizmetler & Ekoller
    initTabs();

    // FAQ Accordion
    initFaqAccordion();

    // Detail Modals (Populated dynamically)
    initDetailModals();

    // Interactive Appointment Booking Wizard
    initBookingWizard();

    // Book Waitlist Subscription Form
    initWaitlistForm();

    // Direct Contact Form
    initDirectContactForm();

    // Blog Section Reader
    initBlogSection();

    // KVKK Modal Overlay
    initKvkkModal();
});

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('use');
    
    // Check saved theme (default to dark if not set)
    const savedTheme = localStorage.getItem('alp-psikoloji-theme');
    const initialTheme = savedTheme || 'dark';
    
    setTheme(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('alp-psikoloji-theme', theme);
        
        // Update SVG icon path
        if (theme === 'dark') {
            // Sun icon path
            themeIcon.setAttribute('href', '#icon-sun');
        } else {
            // Moon icon path
            themeIcon.setAttribute('href', '#icon-moon');
        }
    }
}

/* ==========================================================================
   Scroll Effects (Sticky Nav & active link tracker)
   ========================================================================== */
function initScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav Link highlight on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160; // Offset for sticky navbar
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Smooth navigation clicking
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offset = 100; // spacing for header
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetSection.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Smooth logo click on homepage to avoid reload or adding #home hash
    const logoLinks = document.querySelectorAll('.logo-link');
    logoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const isHomepage = window.location.pathname === '/' || 
                               window.location.pathname.endsWith('index.html') || 
                               window.location.protocol === 'file:';
            const targetHref = link.getAttribute('href');
            if (isHomepage && (targetHref === 'index.html' || targetHref === '#home' || targetHref.endsWith('index.html'))) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                if (history.pushState) {
                    history.pushState(null, null, window.location.pathname + window.location.search);
                } else {
                    window.location.hash = '';
                }
            }
        });
    });
}

/* ==========================================================================
   Mobile Nav Drawer
   ========================================================================== */
function initMobileNav() {
    const burgerMenu = document.getElementById('burger-menu');
    const mobileOverlay = document.getElementById('mobile-nav');
    if (!burgerMenu || !mobileOverlay) return;
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const burgerBars = document.querySelectorAll('.burger-bar');

    burgerMenu.addEventListener('click', () => {
        const isActive = mobileOverlay.classList.toggle('active');
        
        // Morph burger to Close icon (X)
        if (isActive) {
            burgerBars[0].style.transform = 'translateY(8px) rotate(45deg)';
            burgerBars[1].style.opacity = '0';
            burgerBars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            burgerBars[0].style.transform = 'none';
            burgerBars[1].style.opacity = '1';
            burgerBars[2].style.transform = 'none';
        }
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            mobileOverlay.classList.remove('active');
            burgerBars[0].style.transform = 'none';
            burgerBars[1].style.opacity = '1';
            burgerBars[2].style.transform = 'none';

            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    setTimeout(() => {
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = targetSection.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 300); // Wait for drawer transition to finish
                }
            }
        });
    });
}

/* ==========================================================================
   Reveal Animations on Scroll (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after revealing
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% is visible
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Tabs Management (Hizmetler / Ekoller)
   ========================================================================== */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = question.nextElementSibling;
            const isActive = faqItem.classList.contains('active');

            // Close all items first
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle clicked item
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================================
   Detail Modals (Dynamic Information Cards Overlay)
   ========================================================================== */
function initDetailModals() {
    const modalOverlay = document.getElementById('details-modal');
    if (!modalOverlay) return;
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    const modalTitle = modalOverlay.querySelector('.detail-modal-title');
    const modalTag = modalOverlay.querySelector('.detail-modal-tag');
    const modalContent = modalOverlay.querySelector('.detail-modal-content');

    // Content database for therapy styles
    const contentDb = {
        'schema-terapi': {
            tag: 'Terapi Yöntemleri',
            title: 'Şema Terapi',
            body: `
                <p>Şema Terapi; geleneksel Bilişsel Davranışçı Terapi tekniklerini, psikodinamik, nesne ilişkileri, bağlanma teorisi ve yaşantısal ekollerle birleştiren, özellikle kökeni çocukluk dönemine dayanan kronik problemler ve kişilik sorunlarında oldukça etkili, bütünleştirici bir terapi yaklaşımıdır.</p>
                <p>ISST (Uluslararası Şema Terapi Derneği) onaylı Şema Terapist Klinik Psikolog Ömer Aykutalp Börklü eşliğinde yürütülen seanslarda:</p>
                <ul>
                    <li>Çocukluk döneminde karşılanmamış temel duygusal ihtiyaçların (güvenli bağlanma, özerklik, kendini ifade etme özgürlüğü, gerçekçi sınırlar) belirlenmesi.</li>
                    <li>Bu eksiklikler doğrultusunda gelişen uyumsuz şemaların (örn. terk edilme, kusurluluk, başarısızlık, boyun eğicilik) keşfedilmesi.</li>
                    <li>Şemalarımızın tetiklendiği anlarda takındığımız baş etme modlarının (teslimci, kaçınmacı, aşırı telafi eden) fark edilmesi.</li>
                    <li>Yaşantısal teknikler (sandalye diyalogları, imajinasyonla yeniden senaryolaştırma) ve bilişsel/davranışsal yöntemlerle şemaların gücünün azaltılması, Sağlıklı Yetişkin modunun güçlendirilmesi hedeflenir.</li>
                </ul>
            `
        },
        'emdr-terapisi': {
            tag: 'Terapi Yöntemleri',
            title: 'EMDR Terapisi',
            body: `
                <p>EMDR (Göz Hareketleriyle Duyarsızlaştırma ve Yeniden İşleme); bireyin yaşadığı travmatik, rahatsız edici veya hayat kalitesini düşüren anıların, zihinde işlevsel olmayan biçimde depolanmasını engelleyerek, bu anıların adaptif (uyumsal) bir şekilde yeniden işlenmesini sağlayan fizyolojik temelli bir psikoterapi yaklaşımıdır.</p>
                <p>II. Düzey EMDR Terapisti Klinik Psikolog Ömer Aykutalp Börklü gözetiminde uygulanan süreç şunları kapsar:</p>
                <ul>
                    <li>Kaygı bozuklukları, travma sonrası stres, fobi ve yas süreçlerinde hedeflenen olumsuz geçmiş anıların saptanması.</li>
                    <li>Çift yönlü uyarım (göz hareketleri, dokunsal veya işitsel uyaranlar) yardımıyla beynin sağ ve sol yarım kürelerinin aktifleşmesi.</li>
                    <li>Anının tetiklediği yoğun olumsuz duygu, beden duyumu ve "değersizim", "güvende değilim" gibi inançların gücünü kaybetmesi.</li>
                    <li>Sürecin sonunda, anının tamamen unutulması değil; hatırlandığında artık bireye yoğun acı, kaygı veya bedensel rahatsızlık vermeyecek şekilde nötrleşmesi sağlanır.</li>
                </ul>
            `
        },
        'bdt-terapisi': {
            tag: 'Terapi Yöntemleri',
            title: 'Bilişsel Davranışçı Terapi (BDT)',
            body: `
                <p>Bilişsel Davranışçı Terapi (BDT); günümüzde etkinliği bilimsel araştırmalarla en çok kanıtlanmış, yapılandırılmış, hedef odaklı ve işlevsel olmayan düşünce kalıplarını değiştirmeye odaklanan aktif bir terapi ekolüdür.</p>
                <p>BDT yaklaşımında odaklanılan alanlar:</p>
                <ul>
                    <li>Duygu ve davranışlarımızı belirleyen şeyin olayların kendisi değil, olayları "nasıl algıladığımız" ve zihnimizden geçen düşünceler olduğu ilkesi.</li>
                    <li>Zihindeki otomatik düşüncelerin, bilişsel çarpıtmaların (örn. felaketleştirme, ya hep ya hiç düşüncesi) ve temel inançların tespiti.</li>
                    <li>Danışan ile terapistin iş birliği içinde birer bilim insanı gibi çalışarak bu alternatif olmayan düşünceleri test etmesi.</li>
                    <li>Seanslar arası verilen pratik uygulamalar (ev ödevleri, davranışsal deneyler) ile kazanılan farkındalıkların günlük hayata entegre edilmesi.</li>
                </ul>
            `
        },
        'psikodrama': {
            tag: 'Terapi Yöntemleri',
            title: 'Psikodrama',
            body: `
                <p>Psikodrama; bireylerin geçmişte yaşadıkları, geleceğe dair kaygı duydukları ya da şimdiki zamanda çözmekte zorlandıkları problemleri "aksiyon, sahneleme ve rol oynama" tekniklerini kullanarak canlandırdıkları, grup etkileşimine dayalı köklü bir terapi yöntemidir.</p>
                <p>Klinik seanslarda kullanılan psikodramatik yöntemler:</p>
                <ul>
                    <li>Bireyin iç dünyasındaki çatışmaları, ilişkili olduğu kişileri veya soyut kavramları sahneye taşıyarak somutlaştırması.</li>
                    <li>"Rol Değiştirme", "Eşleme" ve "Ayna" teknikleri sayesinde karşı tarafın gözünden bakabilme (empati) yetisinin gelişmesi.</li>
                    <li>Kelimelerin yetersiz kaldığı durumlarda, bedensel eylem ve spontanlık ile bastırılmış duyguların boşalımı (katarsis) ve zihinsel bütünleşme sağlanması.</li>
                </ul>
            `
        },
        'yetiskin-terapisi': {
            tag: 'Çalışma Alanları',
            title: 'Yetişkin Psikoterapisi',
            body: `
                <p>Yetişkin psikoterapisi; bireylerin günlük yaşamda karşılaştıkları duygusal, ilişkisel veya zihinsel zorlukları anlamlandırma, baş etme becerilerini geliştirme ve kendilerini daha derinden tanıma sürecidir.</p>
                <p>Çalışılan temel yetişkin sorunları:</p>
                <ul>
                    <li>Kaygı Bozuklukları (Panik Atak, Sosyal Kaygı, Yaygın Anksiyete)</li>
                    <li>Depresyon ve Duygu Durum Dalgalanmaları</li>
                    <li>Öfke Kontrol Problemleri ve Stres Yönetimi</li>
                    <li>Kişiler arası iletişim sorunları ve özgüven eksikliği</li>
                </ul>
            `
        },
        'cift-terapisi': {
            tag: 'Çalışma Alanları',
            title: 'Aile ve Çift Danışmanlığı',
            body: `
                <p>Çift terapisi; ilişkide tıkanıklık yaşayan, iletişim problemleri, güven kaybı, aldatma veya uyum problemleriyle karşılaşan partnerlerin, ilişkisel döngülerini fark edip daha güvenli bir bağlanma kurmalarını amaçlayan süreçtir.</p>
                <p>İlişkisel hedefler:</p>
                <ul>
                    <li>Savunmacı ve suçlayıcı iletişim kalıplarının yerine yapıcı, duygusal açıdan açık diyalogların kurulması.</li>
                    <li>Partnerlerin birbirlerinin geçmiş kırılganlıklarını (şemalarını) anlayarak tetiklenmelerini yönetebilmesi.</li>
                    <li>İlişkideki duygusal bağın, yakınlığın ve ortak hedeflerin yeniden inşa edilmesi.</li>
                </ul>
            `
        },
        'ergen-terapisi': {
            tag: 'Çalışma Alanları',
            title: 'Çocuk-Ergen Danışmanlığı',
            body: `
                <p>Çocuk ve ergenlik dönemi; kimlik arayışı, hormonal değişimler ve sosyal uyum çabaları nedeniyle özel bir hassasiyet gerektirir. Süreç, gencin kendisini güvende hissettiği bir ortamda, aile iş birliğiyle yürütülür.</p>
                <p>Çalışılan alanlar:</p>
                <ul>
                    <li>Sınav kaygısı, akademik odaklanma problemleri.</li>
                    <li>Akran zorbalığı, sosyal izolasyon, özgüven sorunları.</li>
                    <li>Ebeveyn-ergen arası çatışmalar ve iletişim engelleri.</li>
                    <li>Duygusal regülasyon (duyguları düzenleyebilme) becerilerinin kazandırılması.</li>
                </ul>
            `
        },
        'yas-danismanligi': {
            tag: 'Çalışma Alanları',
            title: 'Yas Danışmanlığı',
            body: `
                <p>Bir yakının kaybı, boşanma, iş kaybı veya büyük hayat değişimleri sonrasında yaşanan acı doğal bir süreçtir. Yas danışmanlığı, bu sürecin tıkanıp patolojik bir hal almasını önleyerek, bireyin kaybı kabul edip hayata yeniden uyum sağlamasına destek olur.</p>
                <p>Klinik yaklaşımlar:</p>
                <ul>
                    <li>Duyguların (özlem, öfke, suçluluk) güvenli bir alanda ifade edilmesi.</li>
                    <li>Kaybın ardından değişen yaşam rollerinin ve benlik algısının yeniden tanımlanması.</li>
                    <li>EMDR terapisi eşliğinde, kaybın getirdiği travmatik acının işlenmesi.</li>
                </ul>
            `
        }
    };

    // Trigger details modal on card/item click
    const cardTriggers = document.querySelectorAll('[data-content-key]');
    cardTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const key = trigger.getAttribute('data-content-key');
            const data = contentDb[key];
            if (data) {
                modalTitle.textContent = data.title;
                modalTag.textContent = data.tag;
                modalContent.innerHTML = data.body;
                
                modalOverlay.style.display = 'flex';
                // Trigger reflow for transition
                modalOverlay.offsetHeight;
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scroll
            }
        });
    });

    // Close details modal
    closeBtn.addEventListener('click', closeDetailsModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeDetailsModal();
    });

    function closeDetailsModal() {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 400); // Match CSS transition duration
    }
}

/* ==========================================================================
   Appointment Booking Wizard (Multi-step Modals)
   ========================================================================== */
function initBookingWizard() {
    const bookingOverlay = document.getElementById('booking-modal');
    if (!bookingOverlay) return;
    const openWizardBtns = document.querySelectorAll('.open-booking-wizard');
    const closeWizardBtn = bookingOverlay.querySelector('.modal-close-btn');
    
    const steps = bookingOverlay.querySelectorAll('.wizard-pane');
    const indicators = bookingOverlay.querySelectorAll('.wizard-step-indicator-item');
    const nextBtn = document.getElementById('wizard-next');
    const prevBtn = document.getElementById('wizard-prev');

    let currentStep = 0;
    let appointmentData = {
        service: '',
        date: '',
        time: '',
        name: '',
        phone: '',
        email: '',
        notes: ''
    };

    // Open Wizard
    openWizardBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingOverlay.style.display = 'flex';
            bookingOverlay.offsetHeight;
            bookingOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            resetWizard();
        });
    });

    // Close Wizard
    closeWizardBtn.addEventListener('click', closeWizard);
    bookingOverlay.addEventListener('click', (e) => {
        if (e.target === bookingOverlay) closeWizard();
    });

    function closeWizard() {
        bookingOverlay.classList.remove('active');
        setTimeout(() => {
            bookingOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }

    function resetWizard() {
        currentStep = 0;
        appointmentData = { service: '', date: '', time: '', name: '', phone: '', email: '', notes: '' };
        
        // Remove selections
        bookingOverlay.querySelectorAll('.wizard-card-option').forEach(c => c.classList.remove('selected'));
        document.getElementById('book-date').value = '';
        document.getElementById('book-time').value = '';
        document.getElementById('book-name').value = '';
        document.getElementById('book-phone').value = '';
        document.getElementById('book-email').value = '';
        document.getElementById('book-notes').value = '';
        document.getElementById('book-kvkk').checked = false;
        
        showStep(currentStep);
    }

    function showStep(stepIndex) {
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx === stepIndex);
        });

        // Update Indicators
        indicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === stepIndex);
            indicator.classList.toggle('completed', idx < stepIndex);
        });

        // Update Button labels
        if (stepIndex === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = 'İleri';
        } else if (stepIndex === steps.length - 2) {
            prevBtn.style.display = 'inline-flex';
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = 'Randevuyu Tamamla';
        } else if (stepIndex === steps.length - 1) {
            // Success Pane
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = 'Kapat';
        } else {
            prevBtn.style.display = 'inline-flex';
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = 'İleri';
        }

        validateCurrentStep();
    }

    // Step 1: Selection card click
    const serviceCards = bookingOverlay.querySelectorAll('.wizard-card-option');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            appointmentData.service = card.getAttribute('data-service');
            validateCurrentStep();
        });
    });

    // Step 2: Date & Time change listener
    const dateInput = document.getElementById('book-date');
    const timeSelect = document.getElementById('book-time');
    
    // Disable past dates in datepicker
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    dateInput.addEventListener('change', () => {
        appointmentData.date = dateInput.value;
        validateCurrentStep();
    });
    timeSelect.addEventListener('change', () => {
        appointmentData.time = timeSelect.value;
        validateCurrentStep();
    });

    // Step 3: Contact Inputs listeners
    const contactInputs = [
        document.getElementById('book-name'),
        document.getElementById('book-phone'),
        document.getElementById('book-email')
    ];

    contactInputs.forEach(input => {
        input.addEventListener('input', validateCurrentStep);
    });
    
    document.getElementById('book-kvkk').addEventListener('change', validateCurrentStep);

    // Validation engine
    function validateCurrentStep() {
        let isValid = false;

        if (currentStep === 0) {
            isValid = appointmentData.service !== '';
        } else if (currentStep === 1) {
            isValid = appointmentData.date !== '' && appointmentData.time !== '';
        } else if (currentStep === 2) {
            const name = contactInputs[0].value.trim();
            const phone = contactInputs[1].value.trim();
            const email = contactInputs[2].value.trim();
            const kvkkChecked = document.getElementById('book-kvkk').checked;
            
            // Basic regex checks
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            isValid = name.length > 2 && phone.length > 8 && emailRegex.test(email) && kvkkChecked;
        } else {
            isValid = true; // Success page doesn't need validation
        }

        nextBtn.disabled = !isValid;
        nextBtn.style.opacity = isValid ? '1' : '0.5';
        nextBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }

    // Navigation Click Handlers
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            if (currentStep === steps.length - 2) {
                // Submit Form - show spinner
                nextBtn.disabled = true;
                nextBtn.textContent = 'Gönderiliyor...';
                
                appointmentData.name = contactInputs[0].value.trim();
                appointmentData.phone = contactInputs[1].value.trim();
                appointmentData.email = contactInputs[2].value.trim();
                appointmentData.notes = document.getElementById('book-notes').value.trim();

                // Generate mailto link
                const subject = `Randevu Talebi - ${appointmentData.service} - ${appointmentData.name}`;
                const body = `Merhaba,

Web siteniz üzerinden yeni bir randevu talebi oluşturuldu.

Seçilen Hizmet: ${appointmentData.service}
Tercih Edilen Tarih: ${appointmentData.date}
Tercih Edilen Saat Dilimi: ${appointmentData.time}

Danışan Bilgileri:
Adı Soyadı: ${appointmentData.name}
Telefon: ${appointmentData.phone}
E-posta: ${appointmentData.email}
Notlar: ${appointmentData.notes || 'Belirtilmedi'}

Bu danışan KVKK Aydınlatma Metnini okuyup kabul etmiştir.`;

                const mailtoUrl = `mailto:aykutalpborklu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoUrl;

                // Mock API dispatch
                setTimeout(() => {
                    currentStep++;
                    // Populate success screen summary
                    document.getElementById('summary-service').textContent = appointmentData.service;
                    document.getElementById('summary-datetime').textContent = `${formatDate(appointmentData.date)} - Saat: ${appointmentData.time}`;
                    showStep(currentStep);
                }, 1500);
            } else {
                currentStep++;
                showStep(currentStep);
            }
        } else {
            // Last page: Close button
            closeWizard();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Helper functions
    function formatDate(dateString) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return dateString;
    }
}

/* ==========================================================================
   Book Waitlist Form Submissions
   ========================================================================== */
function initWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    if (!form) return;
    const input = form.querySelector('.waitlist-input');
    const submitBtn = form.querySelector('.btn');
    const successMsg = form.querySelector('.form-success-msg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = input.value.trim();
        
        if (email) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Kaydediliyor...';
            
            // Generate mailto link
            const subject = 'Kitap Ön Kayıt - Alp Psikoloji';
            const body = `Merhaba,

"Kendi Ebeveynimiz Olma" kitabı için yeni bir ön kayıt talebi alındı.

E-posta Adresi: ${email}

İyi çalışmalar.`;

            const mailtoUrl = `mailto:aykutalpborklu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
            
            setTimeout(() => {
                form.reset();
                submitBtn.style.display = 'none';
                input.style.display = 'none';
                
                successMsg.textContent = 'Ön kaydınız başarıyla alındı! Kitap çıktığında sizi bilgilendireceğiz.';
                successMsg.style.display = 'block';
            }, 1200);
        }
    });
}

/* ==========================================================================
   Direct Contact Form Submission
   ========================================================================== */
function initDirectContactForm() {
    const form = document.getElementById('direct-contact-form');
    if (!form) return;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('contact-success-msg');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subjectSelect = document.getElementById('form-subject');
        const subject = subjectSelect.options[subjectSelect.selectedIndex].text;
        const msg = document.getElementById('form-msg').value.trim();
        const kvkkChecked = document.getElementById('form-kvkk').checked;
        
        if (!name || !phone || !email || !kvkkChecked) {
            alert('Lütfen tüm zorunlu alanları doldurun ve KVKK metnini onaylayın.');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Gönderiliyor...';
        
        // Generate mailto link
        const mailSubject = `İletişim Formu - ${subject} - ${name}`;
        const mailBody = `Merhaba,

Web sitenizdeki Detaylı Bilgi Talep Formu üzerinden yeni bir mesaj gönderildi.

Adı Soyadı: ${name}
Telefon: ${phone}
E-posta: ${email}
Başvuru Nedeni / Konu: ${subject}
Mesaj:
${msg || 'Belirtilmedi'}

Bu danışan KVKK Aydınlatma Metnini okuyup kabul etmiştir.`;

        const mailtoUrl = `mailto:aykutalpborklu@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
        window.location.href = mailtoUrl;
        
        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Formu Gönder';
            
            successMsg.textContent = 'Mesajınız başarıyla iletildi (Mail uygulamanız açıldıysa gönder butonuna basarak işlemi tamamlayabilirsiniz).';
            successMsg.style.display = 'block';
            
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 8000);
        }, 1200);
    });
}

/* ==========================================================================
   KVKK Modal Overlay
   ========================================================================== */
function initKvkkModal() {
    const kvkkOverlay = document.getElementById('kvkk-modal');
    if (!kvkkOverlay) return;
    const openBtns = document.querySelectorAll('.open-kvkk-modal');
    const closeBtn = kvkkOverlay.querySelector('.modal-close-btn');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            kvkkOverlay.style.display = 'flex';
            kvkkOverlay.offsetHeight;
            kvkkOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeKvkkModal);
    kvkkOverlay.addEventListener('click', (e) => {
        if (e.target === kvkkOverlay) closeKvkkModal();
    });

    function closeKvkkModal() {
        kvkkOverlay.classList.remove('active');
        setTimeout(() => {
            kvkkOverlay.style.display = 'none';
            // Only restore body scroll if no other overlay is open
            const bookingModal = document.getElementById('booking-modal');
            const detailsModal = document.getElementById('details-modal');
            const isAnyOtherModalActive = (bookingModal && bookingModal.classList.contains('active')) || 
                                          (detailsModal && detailsModal.classList.contains('active'));
            if (!isAnyOtherModalActive) {
                document.body.style.overflow = '';
            }
        }, 400);
    }
}

/* ==========================================================================
   Blog Posts Overlay Reader
   ========================================================================== */
function initBlogSection() {
    const blogPosts = {
        '1': {
            category: 'Şema Terapi',
            title: 'Şemalarımız Hayatımızı Nasıl Şekillendirir?',
            date: '12 Haziran 2026',
            content: `
                <p>Hayatımız boyunca tekrar eden ilişkisel hayal kırıklıkları, değersizlik hissi ya da kronik bir onaylanma ihtiyacı mı yaşıyorsunuz? Psikoterapide sıkça karşılaştığımız bu durumların arkasında, genellikle çocukluk döneminde temelleri atılan ve dünyayı algılama biçimimizi belirleyen "şemalar" yer alır.</p>
                <p>Şema Terapi ekolünün kurucusu Jeffrey Young'a göre şemalar, çocukluk ve ergenlik dönemi boyunca gelişen, yaşamımız boyunca eklenen yeni deneyimlerle kemikleşen, kendimiz ve dünya hakkındaki köklü inanç kalıplarıdır. Çocuklukta karşılanmayan temel duygusal ihtiyaçlarımız (güvenlik, sevgi, özerklik, sınırlar) sonucunda ortaya çıkarlar.</p>
                <h4>En Sık Karşılaşılan Uyumsuz Şemalar</h4>
                <p>İşte yetişkinlik hayatını gölgeleyen bazı temel şemalar:</p>
                <ul>
                    <li><strong>Kuşkuculuk / Kötüye Kullanılma Şeması:</strong> Başkalarının kendisini sömüreceğine, aldatacağına ya da zarar vereceğine dair derin bir inançtır.</li>
                    <li><strong>Kusurluluk Şeması:</strong> Kişinin kendisini içten içe kusurlu, sevilmeye layık olmayan, değersiz hissetmesidir.</li>
                    <li><strong>Boyun Eğicilik Şeması:</strong> Çatışmadan kaçınmak ve başkalarını memnun etmek adına kendi haklarından, isteklerinden ve duygularından feragat etmektir.</li>
                    <li><strong>Yüksek Standartlar Şeması:</strong> Hata yapmaktan aşırı korkmak ve kendisi için gerçekçi olmayan hedefler belirlemektir.</li>
                </ul>
                <blockquote>Şemalarımız, taktığımız filtrelenmiş bir gözlük gibidir. Çevremizdeki her şeyi bu gözlüğün rengine göre yorumlarız. Örneğin kusurluluk şeması olan bir kişi, arkadaşının yorgunluktan kaynaklanan sessizliğini "beni sevmiyor, sıkıcı buluyor" diye yorumlayabilir.</blockquote>
                <h4>Farkındalık ve Değişim Adımları</h4>
                <p>Şemaların etkisini azaltmak ve sağlıklı bir yetişkin moduna geçmek için ilk adım farkındalıktır. Hangi şemaların tetiklendiğini fark ettiğiniz an, şemanın size dikte ettiği savunma yöntemleri (kaçınma, aşırı telafi veya teslim olma) yerine Sağlıklı Yetişkin yanınızla duruma şefkatli ve rasyonel bir yaklaşım sergileyebilirsiniz. Bu süreç, profesyonel bir destekle çok daha kalıcı ve derinlemesine yapılandırılabilir.</p>
            `
        },
        '2': {
            category: 'Kendine Yardım',
            title: 'İçimizdeki Yaralı Çocukla Karşılaşmak',
            date: '8 Haziran 2026',
            content: `
                <p>Bir yetişkin olarak günlük hayatımızı sürdürürken, bazen hiç beklenmedik bir olay karşısında verdiğimiz tepkinin olgunluğumuzla örtüşmediğini fark ederiz. Örneğin, basit bir eleştiriye aşırı öfkelenebilir, partnerimizin geç kalmasıyla derin bir terk edilme paniği yaşayabiliriz. İşte bu anlar, içimizdeki "Yaralı Çocuk" modunun devreye girdiği anlardır.</p>
                <p>"Kendi ebeveynimiz olmak" (reparenting) kavramı, çocukluk dönemimizde anne-babamız veya bakım verenlerimiz tarafından karşılanamayan, eksik kalan duygusal ihtiyaçlarımızı (koşulsuz sevgi, onay, korunma hissi vb.) bugün kendi yetişkin benliğimizle sarmalama sürecini ifade eder.</p>
                <h4>Yaralı Çocuk Neden Tetiklenir?</h4>
                <p>Çocuklukta yalnız bırakıldığımızda, haksızlığa uğradığımızda veya duygularımız küçümsendiğinde hissettiğimiz o acı veren duygular yok olmaz; zihnimizin derinliklerinde saklanır. Yetişkinlikte bu anıları hatırlatan benzer bir durumla (örneğin eşimizin bizi dinlememesi) karşılaştığımızda, içimizdeki o çocuk aynı çaresizlik ve korkuyla tepki verir.</p>
                <blockquote>İçimizdeki çocuğu iyileştirmek, geçmişi değiştirmek anlamına gelmez. Geçmişin üzerimizdeki yıkıcı gücünü, şimdiki aklımız ve şefkatimizle dönüştürmektir.</blockquote>
                <h4>Kendi Ebeveyniniz Nasıl Olursunuz?</h4>
                <p>Kendi kendinize uygulayabileceğiniz bazı temel yaklaşımlar:</p>
                <ul>
                    <li><strong>Duyguyu fark edin ve isimlendirin:</strong> Şu an hissettiğim şey ne? Öfke mi, çaresizlik mi?</li>
                    <li><strong>Çocuğu selamlayın:</strong> Kendinize "Şu an içimdeki küçük çocuk korkuyor ve ilgi istiyor" deyin.</li>
                    <li><strong>Şefkatli ses tonunu kullanın:</strong> Kendinize, sevgi dolu bir ebeveynin çocuğuna konuşacağı gibi yaklaşın: "Seni duyuyorum, buradayım ve güvendesin."</li>
                    <li><strong>Sınırlar koyun:</strong> Sağlıklı yetişkin olarak hem kendinizi koruyun hem de başkalarına sağlıklı sınırlar çekin.</li>
                </ul>
                <p>İçsel ebeveynlik becerilerini geliştirmek zaman alan bir pratik sürecidir. Kendinize karşı sabırlı olun ve bu yolculukta kendinize şefkat göstermeyi ihmal etmeyin.</p>
            `
        },
        '3': {
            category: 'EMDR',
            title: 'EMDR Terapisi ve Travmaların Sindirilmesi',
            date: '3 Haziran 2026',
            content: `
                <p>Beynimiz, yaşadığımız her deneyimi işleme ve sindirme kapasitesine sahip muazzam bir bilgi işleme sistemidir. Ancak, bizi derinden sarsan, korkutan veya çaresiz bırakan olaylar (kazalar, kayıplar, şiddet, hatta çocukluktaki ihmaller) bu sistemin çalışmasını bozabilir. Bu duruma travmatik yaşantılar diyoruz.</p>
                <p>EMDR (Eye Movement Desensitization and Reprocessing / Göz Hareketleriyle Duyarsızlaştırma ve Yeniden İşleme), bu işlenememiş travmatik anıların beyinde sağlıklı bir şekilde sindirilmesini sağlayan, kanıta dayalı, güçlü bir psikoterapi yöntemidir.</p>
                <h4>Travmatik Anı Neden "Sindirilmez"?</h4>
                <p>Normal şartlarda deneyimlerimiz beyindeki uyumsal bilgi işleme sistemiyle işlenerek hafıza ağlarına entegre edilir. Fakat travma anında, aşırı uyarılma nedeniyle sistem kilitlenir. Olay, yaşandığı günkü haliyle; yani o anki görüntüler, sesler, bedensel duyumlar ve inançlarla ("ben değersizim", "güvende değilim") sağ beyinde izole bir şekilde donup kalır. Bu yüzden, yıllar sonra bile o anıyı hatırlatan bir tetikleyiciyle karşılaştığımızda, acıyı dün gibi taze hissederiz.</p>
                <blockquote>EMDR, beynin kendi kendini iyileştirme mekanizmasını harekete geçirir. Tıpkı fiziksel bir yaranın temizlenip kabuk bağlamasına izin verilmesi gibi, zihinsel yaraların da temizlenmesini sağlar.</blockquote>
                <h4>EMDR Nasıl Çalışır?</h4>
                <p>EMDR seanslarında, danışanın travmatik anıya odaklanması sağlanırken, terapist çift yönlü uyarımlar (göz hareketleri, sesler veya dokunuşlar) verir. Bu çift yönlü uyarım, beynin her iki yarım küresini sırayla aktive ederek donmuş anının çözülmesini sağlar. Sürecin sonunda:</p>
                <ul>
                    <li>Anının uyandırdığı acı verici duygular ve bedensel rahatsızlıklar kaybolur veya minimuma iner.</li>
                    <li>Kişi anıya dair "Ben güçsüzüm" gibi olumsuz inançlar yerine "Elimden geleni yaptım, artık güvendediyim" gibi olumlu inançlar geliştirir.</li>
                    <li>Olay unutulmaz, ancak hayatı kısıtlayan bir acı olmaktan çıkıp sıradan bir geçmiş anıya dönüşür.</li>
                </ul>
            `
        },
        '4': {
            category: 'Farkındalık',
            title: 'Kronik Stres ve Bedensel Tepkilerimiz',
            date: '28 Mayıs 2026',
            content: `
                <p>Zihnimizin taşıdığı yükler, sadece düşüncelerimizle sınırlı kalmaz. Beden ve zihin, birbirine kopmaz bağlarla bağlı tek bir sistemdir. Çoğu zaman zihnimizde bastırmaya çalıştığımız, yüzleşmekten kaçındığımız stres ve kaygı, kendini bedensel semptomlar aracılığıyla gösterir. Bedenimiz, zihnimizin sessizce çığlık attığı bir alandır.</p>
                <p>Günümüz dünyasında sıkça maruz kaldığımız kronik stres, otonom sinir sistemimizi sürekli bir "savaş ya da kaç" modunda tutar. Bu durum, uzun vadede bedenin kaynaklarının tükenmesine ve somatik (bedensel) rahatsızlıkların ortaya çıkmasına yol açar.</p>
                <h4>Stresin Bedensel İpuçları</h4>
                <p>Stres altındayken bedenimizde sıklıkla şu değişimler gözlenir:</p>
                <ul>
                    <li><strong>Kas Gerginliği ve Ağrılar:</strong> Özellikle omuz, boyun ve çene kaslarının sürekli sıkılması, kronik baş ve sırt ağrılarına neden olur.</li>
                    <li><strong>Sindirim Sistemi Problemleri:</strong> Bağırsaklarımız "ikinci beynimiz" olarak adlandırılır. Hassas bağırsak sendromu (IBS), şişkinlik ve mide ağrıları doğrudan stresle ilişkilidir.</li>
                    <li><strong>Sığ Nefes ve Çarpıntı:</strong> Kaygı anında nefes alışverişimiz hızlanır ve sığlaşır; bu da kalbimizin gereğinden hızlı çarpmasına sebep olur.</li>
                    <li><strong>Uyku Bozuklukları ve Yorgunluk:</strong> Kortizol hormonunun sürekli yüksek olması, derin uyku evrelerine geçmeyi zorlaştırır ve kişi sabahları yorgun uyanır.</li>
                </ul>
                <blockquote>Bedenimiz, zihnimizin konuşamadığı dili konuşur. Dinlemediğimiz her hafif fısıltı, zamanla şiddetli bir bedensel çığlığa dönüşebilir.</blockquote>
                <h4>Bedenle Yeniden Bağ Kurmak</h4>
                <p>Kronik stresin etkilerini hafifletmek için zihinsel çalışmaların yanında somatik (bedensel) farkındalık pratikleri uygulamak şarttır. Gün içinde derin diyafram nefesleri almak, kasları sırayla sıkıp gevşetmek (progresif kas gevşetme) ve düzenli egzersizler sinir sistemini sakinleştirir. Bedeninizin verdiği sinyalleri düşmanca değil, sizi korumaya çalışan bir dostun uyarıları olarak görmeye başladığınızda, iyileşme süreci de başlamış demektir.</p>
            `
        }
    };

    const blogOverlay = document.getElementById('blog-modal');
    if (!blogOverlay) return;

    const openBtns = document.querySelectorAll('.blog-card-btn');
    const closeBtn = blogOverlay.querySelector('.modal-close-btn');

    const modalCategory = blogOverlay.querySelector('.blog-modal-category');
    const modalTitle = blogOverlay.querySelector('.blog-modal-title');
    const modalDate = blogOverlay.querySelector('.blog-modal-date');
    const modalContent = blogOverlay.querySelector('.blog-modal-content');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = btn.getAttribute('data-post-id');
            const post = blogPosts[postId];

            if (post) {
                modalCategory.textContent = post.category;
                modalTitle.textContent = post.title;
                modalDate.textContent = post.date;
                modalContent.innerHTML = post.content;

                blogOverlay.style.display = 'flex';
                blogOverlay.offsetHeight; // force reflow
                blogOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeBtn.addEventListener('click', closeBlogModal);
    blogOverlay.addEventListener('click', (e) => {
        if (e.target === blogOverlay) closeBlogModal();
    });

    function closeBlogModal() {
        blogOverlay.classList.remove('active');
        setTimeout(() => {
            blogOverlay.style.display = 'none';
            // Only restore body scroll if no other overlay is active
            const bookingModal = document.getElementById('booking-modal');
            const detailsModal = document.getElementById('details-modal');
            const kvkkModal = document.getElementById('kvkk-modal');
            const isAnyOtherModalActive = (bookingModal && bookingModal.classList.contains('active')) || 
                                          (detailsModal && detailsModal.classList.contains('active')) || 
                                          (kvkkModal && kvkkModal.classList.contains('active'));
            if (!isAnyOtherModalActive) {
                document.body.style.overflow = '';
            }
        }, 400);
    }
}

/* ==========================================================================
   Preloader Hiding Logic
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    const hideLoader = () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 800); // 800ms minimum display for premium branding transition
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
}
