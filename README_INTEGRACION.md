
# Proyecto Todo App - Frontend + Backend

Este proyecto está compuesto por:

- 📦 **Backend**: ASP.NET Core Web API (`TodoAppApi`)
- 💻 **Frontend**: React + Vite (`todo-app/todo-app`)

---

## 📁 Estructura de Carpetas

```
TallerFinalWebApi/            # Backend ASP.NET Core
└── TodoAppApi/               # Proyecto Web API

todo-app/
└── todo-app/                 # Frontend React (con package.json y Vite)
    ├── src/
    ├── index.html
    └── vite.config.js
```

---

## ▶️ Cómo ejecutar el proyecto

### 1. Iniciar el Backend (.NET API)

```bash
cd TallerFinalWebApi/TodoAppApi
dotnet run
```

Por defecto se ejecuta en:
- `https://localhost:5001`
- `http://localhost:5000`

---

### 2. Iniciar el Frontend (React + Vite)

```bash
cd todo-app/todo-app
npm install
npm run dev
```

Se abre en:
- `http://localhost:5173`

---

## 🔁 Integración API

El archivo `vite.config.js` incluye un proxy para redirigir automáticamente las llamadas `/api` al backend:

```js
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:5001',
      changeOrigin: true,
      secure: false
    }
  }
}
```

Esto permite que en React puedas usar:

```js
fetch('/api/tareas')
```

En lugar de usar la URL completa.

---

## ✅ Recomendaciones

- Asegúrate de que el backend esté corriendo **antes** de iniciar el frontend.
- Usa HTTPS (`https://localhost:5001`) si tu API así lo requiere.
- Evita estar en la carpeta raíz equivocada; los comandos deben ejecutarse dentro de `todo-app/todo-app`.

---

## ✨ Autor

Integración realizada automáticamente por IA 🤖 con supervisión del usuario.
