// ─────────────────────────────────────────────
//  ELSA Madrid UCM — main.js
// ─────────────────────────────────────────────
console.log('ELSA Madrid UCM site loaded');

// ── Scroll-triggered "in-view" animations ────
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.dataset.delay || 0);
                setTimeout(() => el.classList.add('in-view'), delay);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stat-item, .overview-card').forEach(el => {
        observer.observe(el);
    });
}

// ── Animated number counter ───────────────────
function animateCounter(el, target, duration = 1600) {
    const suffix = el.nextElementSibling; // .stat-suffix sibling
    const start = performance.now();
    const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    };
    requestAnimationFrame(update);
}

function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });
}

// ── Hamburger menu ────────────────────────────
function initMobileMenu() {
    const burger = document.getElementById('navbar-burger');
    const nav    = document.getElementById('navbar-nav');
    if (!burger || !nav) return;
    burger.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
    });
    // Cerrar al hacer clic en un enlace
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}

// ── Sticky navbar hide/show on scroll ─────────
function initStickyHeader() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > 100) {
            navbar.classList.toggle('hide', y > lastY);
        } else {
            navbar.classList.remove('hide');
        }
        lastY = y;
    }, { passive: true });
}

// ── JSON data loaders ─────────────────────────
async function loadJSON(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('Network response was not ok');
        return await res.json();
    } catch (e) {
        console.error('Error loading JSON:', e);
        return [];
    }
}

async function renderEvents() {
    const events = await loadJSON('data/events.json');
    const container = document.getElementById('events-list');
    if (!container) return;
    if (events.length === 0) {
        container.innerHTML = '<p>No hay eventos programados.</p>';
        return;
    }
    container.innerHTML = events.map(e =>
        `<div class="event-card">
            <h4>${e.title}</h4>
            <small>${e.date}</small>
            <p>${e.description}</p>
        </div>`
    ).join('');
}

async function renderPosts() {
    const posts = await loadJSON('data/posts.json');
    const container = document.getElementById('posts-list');
    if (!container) return;
    if (posts.length === 0) {
        container.innerHTML = '<p>No hay noticias aún.</p>';
        return;
    }
    container.innerHTML = posts.map(p =>
        `<article class="post-card">
            <h4><a href="${p.url}">${p.title}</a></h4>
            <small>${p.date}</small>
            <p>${p.excerpt}</p>
        </article>`
    ).join('');
}

// ── Contact form ──────────────────────────────
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;
        const subject = encodeURIComponent('Contacto desde web ELSA Madrid UCM');
        const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:elsa.madrid.ucm@example.com?subject=${subject}&body=${body}`;
    });
}

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounters();
    initStickyHeader();
    initMobileMenu();
    renderEvents();
    renderPosts();
    initContactForm();
});
