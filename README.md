# ELSA Madrid UCM Website

This repository contains a simple static website for the local group **ELSA Madrid UCM**. It is built with plain HTML, CSS, and JavaScript.

## Structure

- `index.html` – Home page with hero banner and overview
- `about.html` – Information about the local group

Layout uses a wave header and the primary colors azul (#004080), naranja (#ffa500) y blanco.- `events.html` – Upcoming events
- `blog.html` – News and articles
- `board.html` – Composition of the local board
- `contact.html` – Contact form
- `assets/css/style.css` – Global styles
- `assets/js/main.js` – JavaScript for interactivity (load events/posts, contact form)
- `data/events.json` & `data/posts.json` – sample content for dynamic loading

## Getting started

1. Open this folder in your code editor.
2. Edit the HTML files to add content and links to the national association when provided.
3. You can serve the site locally using the helper script `run-dev.ps1` (recommended)

### Run locally (one command)

From PowerShell, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-dev.ps1
```

This script will:
- buscar `python` en PATH o en `%APPDATA%\uv` y arrancar `python -m http.server 8080` si está disponible.
- si no encuentra Python, usará `serve.ps1` como fallback (PowerShell HTTP listener con MIME correctos).
- abrirá automaticamente `http://localhost:8080/` en tu navegador por defecto.

If you prefer to run python directly:

```powershell
# from the project root
& 'C:\Users\sofis\AppData\Roaming\uv\python\cpython-3.14.3-windows-x86_64-none\python.exe' -m http.server 8080
```

4. Deploy to any static hosting (GitHub Pages, Netlify, etc.) when ready.

## Future enhancements

- Add a dynamic blog or CMS for easier updates
- Integrate an event calendar plugin
- Hook the contact form to an email service or backend

Feel free to expand or change the design as needed.  
