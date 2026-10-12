# GasVolcan · Sistema de venta y distribución de gas

Proyecto semestral de Desarrollo Web Fullstack (DSY1104), construido con **Vite + React (React Compiler)**,
**React Router**, **Vitest**, **Playwright** y desplegado en **GitHub Pages** con GitHub Actions.

## Historias de usuario

| HU    | Descripción                                             | Dónde                              |
| ----- | ------------------------------------------------------- | ---------------------------------- |
| HU-01 | Catálogo interactivo con carrito persistente            | `src/pages/Catalogo.jsx`           |
| HU-02 | Registro con validación de RUN y correos institucionales | `src/pages/Contacto.jsx`           |
| HU-03 | Panel administrativo con alerta de stock crítico        | `src/pages/Admin.jsx`              |

### Funcionalidades

- **Catálogo** con búsqueda por nombre/código y orden por precio; carrito persistente que respeta el stock.
- **Registro** con validación de RUN (módulo 11), correos permitidos y sin RUN ni correo repetidos; regiones y comunas desde un JSON.
- **Inicio de sesión** para clientes y administradores, con el nombre y "Cerrar sesión" en el menú.
- **Pedidos**: el cliente confirma el carrito con su dirección de despacho; se descuenta el stock
  y puede seguir el estado en **Mis pedidos** (Pendiente → En reparto → Entregado / Cancelado).
- **Panel admin** (ruta protegida): gestión de pedidos (cancelar repone stock), inventario con
  alerta de stock crítico y stock editable, y CRUD de usuarios.
- **Menú responsive** con botón ☰ en pantallas chicas.

Usuario administrador de prueba: `admin@duoc.cl` / `admin123` (entra en **Iniciar sesión**)
(⚠️ solo para la demo: no hay backend, los datos viven en `localStorage`).

> 📘 ¿Quieres construir el proyecto desde cero? Sigue la [guía paso a paso](GUIA_INSTALACION.md).

## Ejecutar

```bash
npm install
npx playwright install chromium   # solo la primera vez
npm run dev                       # http://localhost:5173
```

## Verificar

```bash
npm run lint           # ESLint
npm run test:run       # Vitest (unitarias + componentes)
npm run test:coverage  # + informe en coverage/index.html (mínimo 80 %)
npm run test:e2e       # Playwright en navegador real
npm run build          # versión de producción en dist/
```

## Estructura

```
src/
├── main.jsx                 HashRouter (necesario para GitHub Pages)
├── App.jsx                  tabla de rutas
├── components/              Layout, Navbar, Footer, ProductCard, Carrito, Filtros, Checkout,
│   │                        UserForm, RutaProtegida, EstadoPedido
│   └── admin/               Pedidos, Inventario, Usuarios (secciones del panel)
├── pages/                   Home, Catalogo, Contacto, Login, MisPedidos, Admin, NotFound
├── hooks/                   useFetch, useLocalStorage, useStore
├── context/                 estado global (productos, carrito, usuarios, sesión, pedidos)
├── services/                funciones puras: validation, cart, products, users, regiones, orders
└── test/                    setup, mocks, datos de prueba y helpers de formularios
public/
├── img/                     imágenes de los cilindros
└── data/regiones.json       regiones y comunas (se cargan con useFetch)
e2e/                         pruebas Playwright
docs/legacy/                 versión original en HTML + JS (solo referencia)
```

## Despliegue

Cada `git push` a `main` ejecuta `.github/workflows/deploy.yml`: lint → cobertura → E2E → build → publica.
Activar una sola vez: **Settings → Pages → Source: GitHub Actions**.
