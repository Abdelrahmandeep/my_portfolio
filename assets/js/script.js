/* ============================================================
   script.js — Full Portfolio Script
   ============================================================ */

// ─── Loading Screen ───────────────────────────────────────────
// Removed as requested by user


// ─── Image Fallback ──────────────────────────────────────────
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.style.background = 'var(--card-bg)';
        img.style.display = 'flex';
        img.alt = img.alt || 'Image not found';
    });
});

// ─── Dark / Light Mode Toggle ─────────────────────────────────
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggleBtn.querySelector('i');

// Apply saved theme OR detect system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') icon.classList.replace('fa-moon', 'fa-sun');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.setAttribute('data-theme', 'dark');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggleBtn.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
});

// ─── Language Translation Switcher ────────────────────────────
const langToggleBtn = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const htmlEl = document.documentElement;

// Typing animation globals referenced in switcher
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const setLanguage = (lang) => {
    htmlEl.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
    
    if (lang === 'en') {
        langText.textContent = 'العربية';
        htmlEl.removeAttribute('dir');
    } else {
        langText.textContent = 'English';
        htmlEl.setAttribute('dir', 'rtl');
    }
    
    // Toggle input placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        el.setAttribute('placeholder', el.getAttribute(`data-${lang}-placeholder`));
    });

    // Reset typing animation values on language change to prevent overflow
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;
};

// Apply saved language OR default to English
const savedLang = localStorage.getItem('lang') || 'en';
setLanguage(savedLang);

langToggleBtn.addEventListener('click', () => {
    const currentLang = htmlEl.getAttribute('lang') === 'ar' ? 'en' : 'ar';
    setLanguage(currentLang);
});

// ─── Mobile Navigation ────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.getElementById('nav-overlay');

const openNav = () => { navLinks.classList.add('active'); navOverlay.classList.add('visible'); document.body.style.overflow = 'hidden'; hamburger.setAttribute('aria-expanded', 'true'); };
const closeNav = () => { navLinks.classList.remove('active'); navOverlay.classList.remove('visible'); document.body.style.overflow = ''; hamburger.setAttribute('aria-expanded', 'false'); };

hamburger.addEventListener('click', () => navLinks.classList.contains('active') ? closeNav() : openNav());
navOverlay.addEventListener('click', closeNav);

document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', closeNav);
});

// ─── Scroll Reveal ────────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const wh = window.innerHeight;
    revealElements.forEach(el => {
        if (el.getBoundingClientRect().top < wh - 100) el.classList.add('active');
    });
};

// ─── Active Nav Link on Scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const setActiveLink = () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 130) current = s.getAttribute('id');
    });
    navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
};

// ─── Sticky Navbar Shadow ─────────────────────────────────────
const navbar = document.getElementById('navbar');

// ─── Scroll Progress Bar ──────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');

// ─── Unified Scroll Handler (throttled with rAF) ─────────────
let scrollTicking = false;
let scrollDelta = 0;
let lastScrollY = window.scrollY;
let scrollSpeed = 0;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDelta = currentScrollY - lastScrollY;
    scrollSpeed = Math.min(Math.abs(scrollDelta), 30);
    lastScrollY = currentScrollY;

    if (!scrollTicking) {
        requestAnimationFrame(() => {
            revealOnScroll();
            setActiveLink();
            // Navbar shadow
            navbar.style.boxShadow = window.scrollY > 50
                ? '0 4px 20px rgba(0,0,0,0.12)'
                : 'none';
            // Progress bar
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});
revealOnScroll();
setActiveLink();

// ─── Back to Top Button ───────────────────────────────────────
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Typing Animation ─────────────────────────────────────────
const typedEl = document.getElementById('typed-text');
const phrasesEn = ['Data Analyst', 'BI Developer', 'Power BI Specialist'];
const phrasesAr = ['محلل بيانات', 'مطور ذكاء أعمال (BI)', 'أخصائي Power BI'];

const type = () => {
    const currentLang = htmlEl.getAttribute('lang') || 'en';
    const phrases = currentLang === 'ar' ? phrasesAr : phrasesEn;
    
    // Prevent out-of-bounds index on language switch
    const phrase = phrases[phraseIndex] || phrases[0] || '';
    
    typedEl.textContent = isDeleting
        ? phrase.substring(0, charIndex - 1)
        : phrase.substring(0, charIndex + 1);

    isDeleting ? charIndex-- : charIndex++;

    let delay = isDeleting ? 60 : 100;
    if (!isDeleting && charIndex === phrase.length) { delay = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
    }
    setTimeout(type, delay);
};
type();

// ─── Stats Counter Animation ──────────────────────────────────
const counters = document.querySelectorAll('.counter');
let statsStarted = false;

const startCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1800;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const update = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                setTimeout(update, stepTime);
            } else {
                counter.textContent = target;
                const parent = counter.closest('.stat-item');
                if (parent && !parent.querySelector('.stat-suffix')) {
                    const suffix = document.createElement('span');
                    suffix.className = 'stat-suffix';
                    suffix.textContent = '+';
                    suffix.style.cssText = 'font-size:2rem;color:var(--secondary-color);font-weight:700;';
                    counter.after(suffix);
                }
            }
        };
        update();
    });
};

const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsStarted) {
        statsStarted = true;
        startCounters();
    }
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

// ─── Timeline Staggered Reveal ──────────────────────────────
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

timelineItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 200}ms`;
    timelineObserver.observe(item);
});

// ─── Enhanced Interactive Background Animation (Fixed Canvas Viewport) ──
(() => {
    const bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext('2d');

    let bgParticles = [];
    let floatingShapes = [];
    let ripples = [];
    let ambientOrbs = [];
    let mouseTrail = [];
    let bgAnimId = null;
    let bgMouse = { x: null, y: null, prevX: null, prevY: null, speed: 0, isDown: false };
    let lastTime = 0;
    let globalTime = 0;

    // ── Theme-aware color palette ──
    const getThemeColors = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark'
            || (!document.body.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

        return isDark ? {
            particleBase: [212, 163, 115],
            particleAccent: [255, 200, 140],
            lineColor: [212, 163, 115],
            glowColor: 'rgba(212, 163, 115, 0.18)',
            glowColorStrong: 'rgba(212, 163, 115, 0.35)',
            shapeFill: 'rgba(212, 163, 115, 0.05)',
            shapeStroke: 'rgba(212, 163, 115, 0.12)',
            rippleColor: [212, 163, 115],
            orbColors: [[212, 163, 115], [255, 200, 140], [180, 120, 80]],
            trailColor: [212, 163, 115],
            isDark: true,
        } : {
            particleBase: [139, 90, 43],
            particleAccent: [200, 140, 80],
            lineColor: [139, 90, 43],
            glowColor: 'rgba(139, 90, 43, 0.10)',
            glowColorStrong: 'rgba(139, 90, 43, 0.22)',
            shapeFill: 'rgba(139, 90, 43, 0.04)',
            shapeStroke: 'rgba(139, 90, 43, 0.08)',
            rippleColor: [139, 90, 43],
            orbColors: [[139, 90, 43], [200, 140, 80], [160, 110, 60]],
            trailColor: [139, 90, 43],
            isDark: false,
        };
    };

    // ── Resize handler ──
    const bgResize = () => {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight; // viewport dimensions to resolve vertical stretching aspect ratio mismatch
        initBgParticles();
        initFloatingShapes();
        initAmbientOrbs();
    };

    // ── Mouse tracking (Viewport coordinates) ──
    document.addEventListener('mousemove', e => {
        bgMouse.prevX = bgMouse.x;
        bgMouse.prevY = bgMouse.y;
        bgMouse.x = e.clientX;
        bgMouse.y = e.clientY;
        if (bgMouse.prevX !== null) {
            const dx = bgMouse.x - bgMouse.prevX;
            const dy = bgMouse.y - bgMouse.prevY;
            bgMouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy), 60);
        }
        // Mouse trail
        mouseTrail.push({ x: bgMouse.x, y: bgMouse.y, life: 1, size: 2 + bgMouse.speed * 0.15 });
        if (mouseTrail.length > 35) mouseTrail.shift();
    });

    document.addEventListener('mouseleave', () => {
        bgMouse.x = null;
        bgMouse.y = null;
        bgMouse.speed = 0;
    });

    // ── Click handler — ripple + explosion (Viewport coordinates) ──
    document.addEventListener('click', e => {
        const cx = e.clientX;
        const cy = e.clientY;
        // Create ripple waves
        for (let i = 0; i < 3; i++) {
            ripples.push({ x: cx, y: cy, radius: 5, maxRadius: 250 + i * 80, opacity: 0.5 - i * 0.1, speed: 3 + i * 0.8 });
        }
        // Explosion burst
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.3;
            const speed = 2 + Math.random() * 3;
            const p = new BgParticle(cx, cy);
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.isTemp = true;
            p.life = 1;
            p.baseRadius = 1.5 + Math.random() * 2;
            p.radius = p.baseRadius;
            p.opacity = 0.7;
            p.isExplosion = true;
            bgParticles.push(p);
        }
    });

    // ── Particle class ──
    class BgParticle {
        constructor(x, y) {
            this.x = x !== undefined ? x : Math.random() * bgCanvas.width;
            this.y = y !== undefined ? y : Math.random() * bgCanvas.height;
            this.baseRadius = Math.random() * 2.5 + 0.8;
            this.radius = this.baseRadius;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.45 + 0.15;
            this.baseOpacity = this.opacity;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.025 + 0.01;
            this.life = 1;
            this.isTemp = x !== undefined;
            this.isExplosion = false;
            this.orbitAngle = Math.random() * Math.PI * 2;
            this.orbitSpeed = (Math.random() - 0.5) * 0.03;
            this.trail = [];
            this.maxTrail = 5;

            if (this.isTemp) {
                this.life = 0.9;
                this.radius = Math.random() * 1.8 + 0.5;
                this.vx = (Math.random() - 0.5) * 2.5;
                this.vy = (Math.random() - 0.5) * 2.5;
                this.maxTrail = 8;
            }
        }
        update(dt) {
            // Save trail position
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrail) this.trail.shift();

            // Subtle floating motion
            this.pulsePhase += this.pulseSpeed;
            this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 0.6;

            // Scroll parallax drift (closer particles move faster)
            const parallaxFactor = (this.baseRadius / 3.3) * 0.5 + 0.15;
            this.y -= scrollDelta * parallaxFactor;

            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction
            if (bgMouse.x !== null) {
                const dx = this.x - bgMouse.x;
                const dy = this.y - bgMouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    const force = (100 - dist) / 100;
                    this.vx += (dx / dist) * force * 0.35;
                    this.vy += (dy / dist) * force * 0.35;
                    this.opacity = Math.min(this.baseOpacity + force * 0.4, 0.9);
                    this.radius = this.baseRadius + force * 3;
                } else if (dist < 250) {
                    this.orbitAngle += this.orbitSpeed * (1 + bgMouse.speed * 0.02);
                    const orbitForce = (250 - dist) / 250 * 0.08;
                    const tx = -dy / dist;
                    const ty = dx / dist;
                    this.vx += tx * orbitForce * 0.5;
                    this.vy += ty * orbitForce * 0.5;
                    this.vx -= (dx / dist) * orbitForce * 0.15;
                    this.vy -= (dy / dist) * orbitForce * 0.15;
                    this.opacity = this.baseOpacity + (250 - dist) / 250 * 0.15;
                } else {
                    this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                }
            } else {
                this.opacity += (this.baseOpacity - this.opacity) * 0.05;
            }

            // Scroll wave distortion
            if (scrollSpeed > 2) {
                const wave = Math.sin(this.x * 0.01 + globalTime * 0.05) * scrollSpeed * 0.08;
                this.vy += wave;
            }

            // Damping
            this.vx *= 0.992;
            this.vy *= 0.992;

            // Speed limit
            const maxSpeed = this.isExplosion ? 6 : 2;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }

            // Boundaries wrap around viewport limits
            if (this.x < -30) this.x = bgCanvas.width + 30;
            if (this.x > bgCanvas.width + 30) this.x = -30;
            if (this.y < -30) this.y = bgCanvas.height + 30;
            if (this.y > bgCanvas.height + 30) this.y = -30;

            if (this.isTemp) {
                this.life -= this.isExplosion ? 0.012 : 0.008;
                this.opacity = this.life * 0.6;
            }
        }
        draw(colors) {
            if (this.opacity <= 0) return;
            const [r, g, b] = colors.particleBase;
            const [ar, ag, ab] = colors.particleAccent;

            if (this.trail.length > 1) {
                for (let i = 0; i < this.trail.length - 1; i++) {
                    const t = this.trail[i];
                    const trailOpacity = (i / this.trail.length) * this.opacity * 0.25;
                    const trailRadius = this.radius * (i / this.trail.length) * 0.5;
                    bgCtx.save();
                    bgCtx.globalAlpha = trailOpacity;
                    bgCtx.beginPath();
                    bgCtx.arc(t.x, t.y, trailRadius, 0, Math.PI * 2);
                    bgCtx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, 0.5)`;
                    bgCtx.fill();
                    bgCtx.restore();
                }
            }

            // Glow aura
            bgCtx.save();
            bgCtx.globalAlpha = this.opacity * 0.25;
            const glowGrad = bgCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6);
            glowGrad.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, 0.2)`);
            glowGrad.addColorStop(1, `rgba(${ar}, ${ag}, ${ab}, 0)`);
            bgCtx.fillStyle = glowGrad;
            bgCtx.beginPath();
            bgCtx.arc(this.x, this.y, this.radius * 6, 0, Math.PI * 2);
            bgCtx.fill();
            bgCtx.restore();

            // Core particle
            bgCtx.save();
            bgCtx.globalAlpha = this.opacity;
            const coreGrad = bgCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            coreGrad.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, 0.9)`);
            coreGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.6)`);
            coreGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`);
            bgCtx.fillStyle = coreGrad;
            bgCtx.beginPath();
            bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            bgCtx.fill();
            bgCtx.restore();
        }
    }

    // ── Ambient Orb class ──
    class AmbientOrb {
        constructor() {
            this.x = Math.random() * bgCanvas.width;
            this.y = Math.random() * bgCanvas.height;
            this.radius = Math.random() * 200 + 100;
            this.vx = (Math.random() - 0.5) * 0.12;
            this.vy = (Math.random() - 0.5) * 0.12;
            this.phase = Math.random() * Math.PI * 2;
            this.phaseSpeed = Math.random() * 0.005 + 0.002;
            this.colorIndex = Math.floor(Math.random() * 3);
        }
        update() {
            // Scroll parallax drift (very slow since orbs are deep background)
            this.y -= scrollDelta * 0.08;

            this.x += this.vx;
            this.y += this.vy;
            this.phase += this.phaseSpeed;

            this.vx += (Math.random() - 0.5) * 0.002;
            this.vy += (Math.random() - 0.5) * 0.002;
            this.vx *= 0.999;
            this.vy *= 0.999;

            if (this.x < -this.radius * 2) this.x = bgCanvas.width + this.radius;
            if (this.x > bgCanvas.width + this.radius * 2) this.x = -this.radius;
            if (this.y < -this.radius * 2) this.y = bgCanvas.height + this.radius;
            if (this.y > bgCanvas.height + this.radius * 2) this.y = -this.radius;
        }
        draw(colors) {
            const [r, g, b] = colors.orbColors[this.colorIndex];
            const breathe = 0.4 + Math.sin(this.phase) * 0.15;
            const dynamicRadius = this.radius * (0.9 + Math.sin(this.phase * 0.7) * 0.1);

            bgCtx.save();
            bgCtx.globalAlpha = colors.isDark ? breathe * 0.08 : breathe * 0.045;
            const grad = bgCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, dynamicRadius);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
            grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.1)`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            bgCtx.fillStyle = grad;
            bgCtx.beginPath();
            bgCtx.arc(this.x, this.y, dynamicRadius, 0, Math.PI * 2);
            bgCtx.fill();
            bgCtx.restore();
        }
    }

    // ── Floating geometric shape class ──
    class FloatingShape {
        constructor() {
            this.x = Math.random() * bgCanvas.width;
            this.y = Math.random() * bgCanvas.height;
            this.size = Math.random() * 50 + 20;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.008;
            this.baseRotationSpeed = this.rotationSpeed;
            this.vx = (Math.random() - 0.5) * 0.18;
            this.vy = (Math.random() - 0.5) * 0.18;
            this.sides = [3, 4, 5, 6, 8][Math.floor(Math.random() * 5)];
            this.opacity = Math.random() * 0.08 + 0.02;
            this.baseOpacity = this.opacity;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.scale = 1;
        }
        update() {
            // Scroll parallax drift (medium depth background)
            this.y -= scrollDelta * 0.15;

            this.x += this.vx;
            this.y += this.vy;
            this.pulsePhase += 0.01;

            if (bgMouse.x !== null) {
                const dx = this.x - bgMouse.x;
                const dy = this.y - bgMouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 350) {
                    const force = (350 - dist) / 350;
                    this.rotationSpeed = this.baseRotationSpeed + force * 0.04 * Math.sign(this.baseRotationSpeed || 1);
                    this.scale = 1 + force * 0.4;
                    this.opacity = this.baseOpacity + force * 0.06;
                    this.x += (dx / dist) * force * 0.5;
                    this.y += (dy / dist) * force * 0.5;
                } else {
                    this.rotationSpeed += (this.baseRotationSpeed - this.rotationSpeed) * 0.05;
                    this.scale += (1 - this.scale) * 0.05;
                    this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                }
            } else {
                this.rotationSpeed += (this.baseRotationSpeed - this.rotationSpeed) * 0.05;
                this.scale += (1 - this.scale) * 0.05;
                this.opacity += (this.baseOpacity - this.opacity) * 0.05;
            }

            this.rotation += this.rotationSpeed;

            if (this.x < -this.size * 2) this.x = bgCanvas.width + this.size;
            if (this.x > bgCanvas.width + this.size * 2) this.x = -this.size;
            if (this.y < -this.size * 2) this.y = bgCanvas.height + this.size;
            if (this.y > bgCanvas.height + this.size * 2) this.y = -this.size;
        }
        draw(colors) {
            const dynamicOpacity = this.opacity + Math.sin(this.pulsePhase) * 0.02;
            const scaledSize = this.size * this.scale;

            bgCtx.save();
            bgCtx.globalAlpha = dynamicOpacity;
            bgCtx.translate(this.x, this.y);
            bgCtx.rotate(this.rotation);

            bgCtx.beginPath();
            for (let i = 0; i < this.sides; i++) {
                const angle = (Math.PI * 2 / this.sides) * i - Math.PI / 2;
                const px = Math.cos(angle) * scaledSize;
                const py = Math.sin(angle) * scaledSize;
                i === 0 ? bgCtx.moveTo(px, py) : bgCtx.lineTo(px, py);
            }
            bgCtx.closePath();

            bgCtx.fillStyle = colors.shapeFill;
            bgCtx.fill();
            bgCtx.strokeStyle = colors.shapeStroke;
            bgCtx.lineWidth = 1.5;
            bgCtx.stroke();

            bgCtx.globalAlpha = dynamicOpacity * 0.5;
            bgCtx.beginPath();
            for (let i = 0; i < this.sides; i++) {
                const angle = (Math.PI * 2 / this.sides) * i - Math.PI / 2 + Math.PI / this.sides;
                const px = Math.cos(angle) * scaledSize * 0.5;
                const py = Math.sin(angle) * scaledSize * 0.5;
                i === 0 ? bgCtx.moveTo(px, py) : bgCtx.lineTo(px, py);
            }
            bgCtx.closePath();
            bgCtx.strokeStyle = colors.shapeStroke;
            bgCtx.lineWidth = 0.8;
            bgCtx.stroke();

            bgCtx.restore();
        }
    }

    // ── Init functions ──
    const initBgParticles = () => {
        bgParticles = [];
        const area = bgCanvas.width * bgCanvas.height;
        const count = Math.min(Math.floor(area / 18000), 120);
        for (let i = 0; i < count; i++) {
            bgParticles.push(new BgParticle());
        }
    };

    const initFloatingShapes = () => {
        floatingShapes = [];
        const count = Math.min(Math.floor(bgCanvas.height / 300), 12);
        for (let i = 0; i < count; i++) {
            floatingShapes.push(new FloatingShape());
        }
    };

    const initAmbientOrbs = () => {
        ambientOrbs = [];
        const count = Math.min(Math.floor(bgCanvas.height / 400), 6);
        for (let i = 0; i < count; i++) {
            ambientOrbs.push(new AmbientOrb());
        }
    };

    // ── Draw connections ──
    const drawConnections = (colors) => {
        const maxDist = 160;
        const [r, g, b] = colors.lineColor;
        const [ar, ag, ab] = colors.particleAccent;

        for (let i = 0; i < bgParticles.length; i++) {
            const pi = bgParticles[i];
            for (let j = i + 1; j < bgParticles.length; j++) {
                const pj = bgParticles[j];

                const dx = pi.x - pj.x;
                const dy = pi.y - pj.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDist * maxDist) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / maxDist) * 0.3;

                    let nearMouse = false;
                    if (bgMouse.x !== null) {
                        const mid = { x: (pi.x + pj.x) / 2, y: (pi.y + pj.y) / 2 };
                        const mdx = mid.x - bgMouse.x;
                        const mdy = mid.y - bgMouse.y;
                        nearMouse = (mdx * mdx + mdy * mdy) < 200 * 200;
                    }

                    bgCtx.beginPath();
                    bgCtx.moveTo(pi.x, pi.y);
                    bgCtx.lineTo(pj.x, pj.y);

                    if (nearMouse) {
                        const grad = bgCtx.createLinearGradient(pi.x, pi.y, pj.x, pj.y);
                        grad.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, ${opacity * 1.5})`);
                        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 2})`);
                        grad.addColorStop(1, `rgba(${ar}, ${ag}, ${ab}, ${opacity * 1.5})`);
                        bgCtx.strokeStyle = grad;
                        bgCtx.lineWidth = 1.2;
                    } else {
                        bgCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                        bgCtx.lineWidth = 0.7;
                    }
                    bgCtx.stroke();
                }
            }

            if (bgMouse.x !== null) {
                const mdx = pi.x - bgMouse.x;
                const mdy = pi.y - bgMouse.y;
                const mdistSq = mdx * mdx + mdy * mdy;
                const mouseRange = 220;

                if (mdistSq < mouseRange * mouseRange) {
                    const mdist = Math.sqrt(mdistSq);
                    const opacity = (1 - mdist / mouseRange) * 0.55;

                    bgCtx.beginPath();
                    bgCtx.moveTo(pi.x, pi.y);
                    bgCtx.lineTo(bgMouse.x, bgMouse.y);

                    const grad = bgCtx.createLinearGradient(pi.x, pi.y, bgMouse.x, bgMouse.y);
                    grad.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, ${opacity})`);
                    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacity * 0.15})`);
                    bgCtx.strokeStyle = grad;
                    bgCtx.lineWidth = 1.2;
                    bgCtx.stroke();
                }
            }
        }
    };

    // ── Mouse glow ──
    const drawMouseGlow = (colors) => {
        if (bgMouse.x === null) return;
        const [r, g, b] = colors.particleAccent;

        const glowRadius = 220 + bgMouse.speed * 4;
        const gradient = bgCtx.createRadialGradient(
            bgMouse.x, bgMouse.y, 0,
            bgMouse.x, bgMouse.y, glowRadius
        );
        gradient.addColorStop(0, colors.glowColorStrong);
        gradient.addColorStop(0.3, colors.glowColor);
        gradient.addColorStop(1, 'transparent');

        bgCtx.save();
        bgCtx.fillStyle = gradient;
        bgCtx.beginPath();
        bgCtx.arc(bgMouse.x, bgMouse.y, glowRadius, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();

        const ringCount = 3;
        for (let i = 0; i < ringCount; i++) {
            const phase = globalTime * 0.02 + i * (Math.PI * 2 / ringCount);
            const ringRadius = 30 + Math.sin(phase) * 15 + i * 25 + bgMouse.speed * 1.5;
            const ringOpacity = (0.15 - i * 0.04) * (1 + bgMouse.speed * 0.01);

            bgCtx.save();
            bgCtx.globalAlpha = ringOpacity;
            bgCtx.beginPath();
            bgCtx.arc(bgMouse.x, bgMouse.y, ringRadius, 0, Math.PI * 2);
            bgCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
            bgCtx.lineWidth = 1.5;
            bgCtx.setLineDash([4, 6 + i * 2]);
            bgCtx.lineDashOffset = -globalTime * (1 + i * 0.5);
            bgCtx.stroke();
            bgCtx.restore();
        }

        // Center dot
        bgCtx.save();
        bgCtx.globalAlpha = 0.3 + bgMouse.speed * 0.005;
        bgCtx.beginPath();
        bgCtx.arc(bgMouse.x, bgMouse.y, 3 + bgMouse.speed * 0.1, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
        bgCtx.fill();
        bgCtx.restore();
    };

    // ── Mouse trail ──
    const drawMouseTrail = (colors) => {
        if (mouseTrail.length < 2) return;
        const [r, g, b] = colors.trailColor;

        for (let i = 1; i < mouseTrail.length; i++) {
            const t = mouseTrail[i];
            const prev = mouseTrail[i - 1];
            t.life -= 0.03;
            if (t.life <= 0) continue;

            const opacity = t.life * 0.2;
            const size = t.size * t.life;

            bgCtx.save();
            bgCtx.globalAlpha = opacity;
            bgCtx.beginPath();
            bgCtx.moveTo(prev.x, prev.y);
            bgCtx.lineTo(t.x, t.y);
            bgCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            bgCtx.lineWidth = size;
            bgCtx.lineCap = 'round';
            bgCtx.stroke();
            bgCtx.restore();
        }

        mouseTrail = mouseTrail.filter(t => t.life > 0);
    };

    // ── Ripple waves ──
    const drawRipples = (colors) => {
        const [r, g, b] = colors.rippleColor;

        ripples.forEach(rip => {
            rip.radius += rip.speed;
            rip.opacity -= 0.006;

            if (rip.opacity <= 0) return;

            bgCtx.save();
            bgCtx.globalAlpha = rip.opacity;
            bgCtx.beginPath();
            bgCtx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
            bgCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${rip.opacity})`;
            bgCtx.lineWidth = 2;
            bgCtx.stroke();

            bgCtx.globalAlpha = rip.opacity * 0.3;
            const ripGrad = bgCtx.createRadialGradient(rip.x, rip.y, rip.radius * 0.8, rip.x, rip.y, rip.radius);
            ripGrad.addColorStop(0, 'transparent');
            ripGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.15)`);
            bgCtx.fillStyle = ripGrad;
            bgCtx.beginPath();
            bgCtx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
            bgCtx.fill();
            bgCtx.restore();
        });

        ripples = ripples.filter(r => r.opacity > 0 && r.radius < r.maxRadius);
    };

    // ── Spawn particles ──
    let spawnCooldown = 0;
    const spawnMouseParticles = () => {
        if (bgMouse.x === null || bgMouse.speed < 5) return;
        spawnCooldown++;
        if (spawnCooldown % 2 !== 0) return;

        const p = new BgParticle(
            bgMouse.x + (Math.random() - 0.5) * 30,
            bgMouse.y + (Math.random() - 0.5) * 30
        );
        p.vx += (Math.random() - 0.5) * bgMouse.speed * 0.1;
        p.vy += (Math.random() - 0.5) * bgMouse.speed * 0.1;
        bgParticles.push(p);

        if (bgParticles.length > 250) {
            bgParticles = bgParticles.filter(p => !p.isTemp || p.life > 0);
        }
    };

    // ── Main animation loop ──
    const animateBg = (timestamp) => {
        const dt = Math.min(timestamp - lastTime, 32);
        lastTime = timestamp;
        globalTime += dt * 0.06;

        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

        const colors = getThemeColors();

        ambientOrbs.forEach(orb => {
            orb.update();
            orb.draw(colors);
        });

        floatingShapes.forEach(shape => {
            shape.update();
            shape.draw(colors);
        });

        drawRipples(colors);
        drawMouseTrail(colors);
        drawMouseGlow(colors);
        spawnMouseParticles();

        bgParticles.forEach(p => {
            p.update(dt);
            p.draw(colors);
        });

        bgParticles = bgParticles.filter(p => !p.isTemp || p.life > 0);
        drawConnections(colors);

        // Decay
        bgMouse.speed *= 0.9;
        scrollSpeed *= 0.92;
        scrollDelta = 0; // reset scrollDelta after processing this frame

        bgAnimId = requestAnimationFrame(animateBg);
    };

    // ── Resize ──
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(bgResize, 200);
    });

    const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (bgCanvas.height !== window.innerHeight || bgCanvas.width !== window.innerWidth) {
                bgResize();
            }
        }, 300);
    });
    resizeObserver.observe(document.body);

    // ── Start ──
    bgResize();
    bgAnimId = requestAnimationFrame(animateBg);

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(bgAnimId);
            bgAnimId = null;
        } else {
            lastTime = performance.now();
            if (!bgAnimId) bgAnimId = requestAnimationFrame(animateBg);
        }
    });
})();

// ─── Project & Certificate Modals ─────────────────────────────────
document.querySelectorAll('.project-card, .cert-card[data-modal]').forEach(card => {
    card.addEventListener('click', e => {
        if (e.target.closest('.btn')) return;
        const modalId = card.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('open');
    });
});

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal-overlay').classList.remove('open');
    });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeNav();
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
});

// ─── Contact Form Submission Feedback ─────────────────────────
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const currentLang = htmlEl.getAttribute('lang') || 'en';
        btn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
        btn.disabled = true;

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                btn.textContent = currentLang === 'ar' ? '✓ تم الإرسال بنجاح!' : '✓ Message Sent!';
                btn.style.background = '#4CAF50';
                form.reset();
                setTimeout(() => {
                    btn.textContent = currentLang === 'ar' ? 'إرسال الرسالة 📨' : 'Send Message 📨';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3500);
            } else {
                throw new Error('Failed');
            }
        } catch {
            btn.textContent = currentLang === 'ar' ? '✗ فشل الإرسال، جاري فتح البريد...' : '✗ Opening mail client...';
            btn.style.background = '#e53935';

            // Graceful fallback to mailto link if endpoint fails
            const name = form.querySelector('[name="name"]')?.value || '';
            const email = form.querySelector('[name="email"]')?.value || '';
            const message = form.querySelector('[name="message"]')?.value || '';
            const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
            const bodyText = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:abdelrahmanallnn@gmail.com?subject=${subject}&body=${bodyText}`;

            setTimeout(() => {
                btn.textContent = currentLang === 'ar' ? 'إرسال الرسالة 📨' : 'Send Message 📨';
                btn.style.background = '';
                btn.disabled = false;
            }, 3500);
        }
    });
}

// ─── Project Insight Read More / Read Less Toggle (Mobile) ────
document.querySelectorAll('.insight-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering modal overlay
        const insightCard = btn.closest('.project-insight');
        if (!insightCard) return;
        const textWrapper = insightCard.querySelector('.project-insight-text');
        if (!textWrapper) return;

        const isClamped = textWrapper.classList.toggle('clamped');
        const enSpan = btn.querySelector('.lang-en');
        const arSpan = btn.querySelector('.lang-ar');
        if (enSpan && arSpan) {
            enSpan.textContent = isClamped ? 'Read more' : 'Read less';
            arSpan.textContent = isClamped ? 'اقرأ المزيد' : 'عرض أقل';
        }
    });
});
