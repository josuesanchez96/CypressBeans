# ☕ CypressBeans - Sistema de Pedidos de Cafetería & Suite E2E

Aplicación Full-Stack de extremo a extremo (E2E) para la gestión y realización de pedidos en una cafetería de especialidad, construida en **TypeScript**, **React**, **Node.js/Express** y con una suite completa de pruebas automatizadas en **Cypress**.

---

## 1. Arquitectura del Proyecto y Dependencias

El proyecto está diseñado bajo una arquitectura modular y desacoplada con TypeScript estricto de extremo a extremo.

```
CypressBeans/
├── server/                    # Capa de Backend API (Express + Node.js)
│   ├── index.ts               # Servidor HTTP en puerto 3001
│   ├── db.ts                  # Persistencia en memoria con seeding y aislamiento
│   ├── routes/api.ts          # Endpoints de productos, órdenes y reset de BD
│   └── types.ts               # Modelos de datos compartidos
├── src/                       # Frontend SPA (React + TypeScript + Vite)
│   ├── components/            # Componentes accesibles con data-cy
│   │   ├── Header.tsx         # Encabezado con control de reset
│   │   ├── ProductList.tsx    # Listado y filtrado por categoría
│   │   ├── ProductCard.tsx    # Tarjeta de producto con validación de stock
│   │   ├── Cart.tsx           # Carrito en tiempo real y cálculo de total
│   │   └── OrderConfirmation.tsx # Modal de confirmación de pedido
│   ├── api/client.ts          # Cliente HTTP desacoplado
│   ├── App.tsx                # Estado global del frontend
│   └── index.css              # Sistema visual Glassmorphism & Dark Mode
├── cypress/                   # Suite de Pruebas E2E (TypeScript)
│   ├── e2e/                   # Especificaciones de prueba
│   │   ├── 01_happy_path.cy.ts# Camino exitoso y verificación de persistencia
│   │   ├── 02_validation.cy.ts# Bloqueo de carritos vacíos y stocks inválidos
│   │   └── 03_network_error.cy.ts # Mocks de error 500 y fallo de red con alias
│   └── support/               # Comandos personalizados (cy.getBySel, cy.resetDatabase)
└── .github/workflows/          # Integración Continua (CI/CD)
    └── cypress.yml            # Pipeline de GitHub Actions con artefactos
```

### Tecnologías & Dependencias Principales

* **Frontend**: React 18, Vite, TypeScript, Lucide React Icons.
* **Backend**: Express.js, TypeScript, CORS.
* **Persistencia**: Persistencia en memoria determinista con reseteo rápido de estado.
* **Pruebas E2E**: Cypress 13 (TypeScript), `wait-on`, `concurrently`.
* **CI/CD**: GitHub Actions con captura de artefactos (pantallazos y videos) en fallos.

---

## 2. Instrucciones y Comandos de Ejecución

### Prerrequisitos
* Node.js v18+ o v20+
* npm v9+

### Instalación de dependencias
```bash
npm install
```

### Ejecutar Servidores en Desarrollo (Frontend + Backend)
Para iniciar simultáneamente la API (puerto `3001`) y la app React (puerto `5173`):
```bash
npm run dev
```

### Ejecutar Pruebas de Cypress

1. **Modo Interactivo (Cypress Test Runner)**:
   ```bash
   npm run cy:open
   ```
2. **Modo Headless (Consola / CI)**:
   ```bash
   npm run cy:run
   ```
3. **Ejecución Automatizada Completa (Levanta Servidores + Ejecuta Pruebas)**:
   ```bash
   npm run test:e2e
   ```

---

## 3. Estrategia de Datos y Aislamiento (Seed / Reset)

Para garantizar que cada prueba E2E sea **independiente y determinista**, el servidor expone un endpoint exclusivo:
* `POST /api/reset` (o `POST /api/seed`)

### ¿Cómo funciona?
1. Cada especificación de Cypress ejecuta `cy.resetDatabase()` en el hook `beforeEach()`.
2. El servidor restaura el inventario de productos a su estado original (precios, existencias y badges).
3. Se vacían las órdenes anteriores registradas en memoria.
4. Con esto se evita la contaminación de estado entre pruebas sin necesidad de reinicios lentos de servidores o bases de datos externas.

---

## 4. Comparativa: Cypress vs Playwright vs Agent Browser

| Criterio | **Cypress**  | **Playwright**  | **Agent Browser**  |
| :--- | :--- | :--- | :--- |
| **Arquitectura** | Se ejecuta dentro de la misma ventana del navegador (Event Loop de JS). | Controla navegadores remotamente a través de Chrome DevTools Protocol (CDP) / WebSocket. | Agente IA autónomo basado en visión y DOM interactivo. |
| **Soporte Multi-tab y Multi-domain** | Limitado (diseñado para una sola pestaña/dominio a la vez). | Nativo y robusto (múltiples pestañas, ventanas e incógnito). | Completo (navega cualquier web como un usuario humano). |
| **Velocidad y Paralelismo** | Excelente en navegador local; paralelismo con Cypress Cloud. | Extremadamente rápido con ejecuciones paralelas nativas sin costo. | Basado en velocidad de inferencia de LLM y renderizado. |
| **Capacidades de Mocking** | Excelente en capas de red con `cy.intercept()`. | Excelente soporte para red e interceptores. | Adaptable a nivel de interfaz visual sin necesidad de mocks. |
| **Experiencia de Desarrollador (DX)** | Excepcional Test Runner interactivo visual con viajes en el tiempo (Time-traveling). | Excelente CLI, inspector visual (Trace Viewer) y generador de código. | Cero configuración de código; basado en instrucciones en lenguaje natural. |

### ¿Cuándo elegir cada herramienta?

* **Elige Cypress cuando**:
  * Tu equipo busca una experiencia de desarrollo fluida con una interfaz visual paso a paso en tiempo real.
  * Requieres interceptar y simular respuestas de API (mocks) de forma expresiva y directa (`cy.intercept`).
  * Estás probando aplicaciones de una sola página (SPA) donde los selectores estables (`data-cy`) están integrados en los componentes.

* **Elige Playwright cuando**:
  * Necesites probar flujos complejos entre múltiples pestañas, dominios o roles simultáneos (ej. Administrador y Cliente al mismo tiempo).
  * Requieras pruebas en dispositivos móviles o navegadores Safari (WebKit) auténticos en Linux/Windows.
  * Busques ejecutar suites masivas de pruebas paralelas en CI/CD con el mínimo tiempo de ejecución posible.

* **Elige Agent Browser cuando**:
  * Desees realizar exploraciones autónomas QA sin escribir código de prueba rígido.
  * Quieras validar flujos visuales dinámicos de extremo a extremo que cambian con frecuencia.
  * Requieras que un agente de IA interactúe con aplicaciones existentes para verificar la UX en lenguaje natural.

---

## 5. Declaración sobre el Uso de Inteligencia Artificial (IA)

En cumplimiento con los requerimientos de la evaluación:
* **Herramienta utilizada**: Antigravity AI Assistant (Google DeepMind).
* **Propósito y uso**: Se utilizó el asistente de IA para proponer la arquitectura inicial de componentes, estructurar la suite de pruebas E2E en TypeScript, diseñar selectores estables `data-cy` y formatear el pipeline de CI/CD en GitHub Actions.
* **Control y Determinismo**: Todas las sugerencias generadas fueron auditadas y ajustadas manualmente para asegurar pruebas 100% deterministas, sin esperas numéricas estáticas y con aislamiento estricto mediante endpoints de seeding.
