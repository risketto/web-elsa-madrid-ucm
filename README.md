# ELSA Madrid – Web

Static website built with HTML5, CSS3 and vanilla JavaScript. No build step, no dependencies.

---

## Requisitos

Necesitas tener instalado **uno** de los siguientes:

| Opción | Descarga |
|--------|----------|
| Python 3 _(recomendado)_ | https://www.python.org/downloads/ |
| Node.js | https://nodejs.org/ |

---

## Cómo levantar la web

### Opción A — doble clic (más fácil)

1. Abre la carpeta del proyecto en el Explorador de archivos.
2. Haz doble clic en **`serve.bat`**.
3. Se abre automáticamente el navegador en `http://localhost:8000`.

> Si Windows pide confirmación de seguridad, haz clic en "Ejecutar de todas formas".

---

### Opción B — desde la terminal

```powershell
# PowerShell
.\serve.ps1
```

```bash
# CMD
serve.bat
```

```bash
# Si tienes Python instalado directamente
python -m http.server 8000
```

```bash
# Si tienes Node.js instalado directamente
npx serve -l 8000 .

```

Abre el navegador en: **http://localhost:8000**

Para detener el servidor: `Ctrl + C`

---

## Estructura del proyecto

```
web-elsa-madrid-ucm/
├── index.html            # Página principal
├── serve.ps1             # Script de arranque (PowerShell)
├── serve.bat             # Script de arranque (doble clic)
├── README.md
└── assets/
    ├── css/
    │   └── styles.css    # Todos los estilos
    ├── js/
    │   └── main.js       # Lógica del frontend
    └── images/           # Imágenes e iconos
```

---

## Notas

- Es un sitio **100 % estático**. No tiene back-end ni base de datos.
- El formulario de contacto es solo una demo visual; no envía correos reales.
- Para producción, sube el contenido tal cual a cualquier hosting estático (GitHub Pages, Netlify, Vercel, etc.).
