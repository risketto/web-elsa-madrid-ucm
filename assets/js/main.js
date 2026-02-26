// Placeholder for future interactivity
console.log('ELSA Madrid UCM site loaded');

// load JSON data and render sections
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

document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
    renderPosts();
    const form = document.getElementById('contact-form');
    if (form) {
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
});