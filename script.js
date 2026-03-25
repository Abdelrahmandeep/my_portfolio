/* ============================================================
   script.js — Full Portfolio Script
   ============================================================ */

// ─── Loading Screen ───────────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader.classList.add('hidden'), 1300);
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
    // Auto dark mode from OS — don't save to localStorage, let CSS handle variable overrides
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

// ─── Mobile Navigation ────────────────────────────────────────
const hamburger  = document.querySelector('.hamburger');
const navLinks   = document.querySelector('.nav-links');
const navOverlay = document.getElementById('nav-overlay');

const openNav  = () => { navLinks.classList.add('active'); navOverlay.classList.add('visible'); document.body.style.overflow = 'hidden'; };
const closeNav = () => { navLinks.classList.remove('active'); navOverlay.classList.remove('visible'); document.body.style.overflow = ''; };

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

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ─── Active Nav Link on Scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');

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

window.addEventListener('scroll', setActiveLink);
setActiveLink();

// ─── Sticky Navbar Shadow ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 50
        ? '0 4px 20px rgba(0,0,0,0.12)'
        : 'none';
});

// ─── Scroll Progress Bar ──────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
});

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
const typedEl  = document.getElementById('typed-text');
const phrases  = ['Data Analyst', 'Python Developer', 'Power BI Expert', 'ML Enthusiast'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

const type = () => {
    const phrase = phrases[phraseIndex];
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
                // Add + suffix for display
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

// ─── Animated Skill Bars on Scroll ───────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');
let skillsAnimated = false;

const skillObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillFills.forEach(fill => {
            const pct = fill.getAttribute('data-pct') || '0%';
            // slight random delay per bar for a staggered feel
            const delay = Math.random() * 300;
            setTimeout(() => { fill.style.width = pct; }, delay);
        });
    }
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ─── Particle Canvas (Hero Background) ───────────────────────
const canvas  = document.getElementById('particles-canvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let animId;
let mouse = { x: null, y: null };  // track mouse position

canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initParticles();
};

const getColor = () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    return isDark
        ? 'rgba(212, 163, 115, 0.35)'
        : 'rgba(139, 90, 43, 0.18)';
};

class Particle {
    constructor() { this.init(); }
    init() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.r  = Math.random() * 2 + 1;
        this.dx = (Math.random() - 0.5) * 0.5;
        this.dy = (Math.random() - 0.5) * 0.5;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > canvas.width)  this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.dy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = getColor();
        ctx.fill();
    }
}

const initParticles = () => {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < Math.min(count, 80); i++) particles.push(new Particle());
};

const connectParticles = () => {
    const maxDist = 130;
    const mouseDist = 160; // connection radius for mouse

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < maxDist) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                const opacity = (1 - dist / maxDist) * 0.4;
                ctx.strokeStyle = getColor().replace(/[\d.]+\)$/, `${opacity})`);
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        // Connect particles to mouse
        if (mouse.x !== null) {
            const mdx  = particles[i].x - mouse.x;
            const mdy  = particles[i].y - mouse.y;
            const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
            if (mdist < mouseDist) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                const opacity = (1 - mdist / mouseDist) * 0.55;
                ctx.strokeStyle = getColor().replace(/[\d.]+\)$/, `${opacity})`);
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }
        }
    }
};

const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animId = requestAnimationFrame(animateParticles);
};

window.addEventListener('resize', resize);
resize();
animateParticles();

// ─── Project Modals ───────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', e => {
        // Don't trigger if clicked on the "View Project" button or its children
        if (e.target.closest('.btn')) return;
        const modalId = card.getAttribute('data-modal');
        const modal   = document.getElementById(modalId);
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
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
});

// ─── Contact Form Submission Feedback ─────────────────────────
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                btn.textContent = '✓ Message Sent!';
                btn.style.background = '#4CAF50';
                form.reset();
                setTimeout(() => {
                    btn.textContent = 'Send Message 📨';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3500);
            } else {
                throw new Error('Failed');
            }
        } catch {
            btn.textContent = '✗ Try Again';
            btn.style.background = '#e53935';
            btn.disabled = false;
            setTimeout(() => {
                btn.textContent = 'Send Message 📨';
                btn.style.background = '';
            }, 3000);
        }
    });
}



// ─── Escape key closes nav & modals ──────────────────────────
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeNav();
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
});