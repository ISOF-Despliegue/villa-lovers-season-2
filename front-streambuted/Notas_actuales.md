# Estado actual de arquitectura (Frontend) – StreamButed

## 1) Resumen ejecutivo

El proyecto está actualmente orientado a **frontend puro** y funciona correctamente para prototipado y validación visual/funcional.  
La estructura ya tiene separación por páginas y componentes, pero la lógica principal está muy concentrada en `StreamButed.tsx`, lo cual limita escalabilidad al integrar backend real, esta parte será la que se trabajará a partir de ahora para cumplir con la funcionalidad correcta y esperada del proyecto, basándonos en la propuesta presentada en nuestra documentación.

---

## 2) Qué se tiene actualmente

### Estructura funcional observada

- `src/pages/`
  - `AuthPages.jsx`
  - `SettingsPage.jsx`
  - `admin/AdminPages.jsx`
  - `artist/ArtistPages.jsx`
  - `listener/ListenerPages.jsx`
- `src/components/`
  - `layout/` (sidebar, players, logout button)
  - `ui/` (cards, rows, barra de progreso, toast)
  - `icons/`
- `src/data/mockData.js`
  - Datos simulados (tracks, álbumes, artistas, usuarios, etc.)
- `src/StreamButed.tsx` (o `.jsx`)
  - “Shell” principal de toda la app

---

## 3) Cómo funge la división actual

## Flujo general

1. `App.jsx` renderiza `StreamButed`.
2. `StreamButed` controla:
   - autenticación local (login/register simulado),
   - navegación interna por estado (`setPage`),
   - render por rol (`listener`, `artist`, `admin`),
   - estado de reproducción y player,
   - toasts.
3. Las páginas consumen datos mock y callbacks desde el shell.

## Fortalezas actuales

- Separación visual por rol y por dominio (`pages`).
- Componentes reutilizables (`components/ui` y `components/layout`).
- Iteración rápida sin depender de servidor.

## Debilidades actuales

- Demasiada lógica centralizada en `StreamButed`.
- Sin capa de API/servicios desacoplada.
- Navegación por estado local en vez de rutas reales.
- Dependencia fuerte de `mockData` en UI.

---

## 4) ¿Está listo para dividir frontend/backend?

## Respuesta corta

**Parcialmente.**  
Sí se puede integrar backend, pero conviene hacer refactor previo para evitar deuda técnica.

## Qué pasaría si se conecta backend “tal cual”

- Funcionará para endpoints simples.
- Se volverá difícil mantener:
  - autenticación robusta,
  - control de errores global,
  - caching,
  - crecimiento de módulos.

---

## 5) Qué habría que modificar para una integración correcta

## 5.1 Capa de acceso a datos (API)

Crear `src/api/`:

- `http.ts` (cliente base: fetch/axios, headers, token, interceptores)
- `authApi.ts`
- `tracksApi.ts`
- `albumsApi.ts`
- `usersApi.ts` (admin)

Objetivo: que las páginas **no** llamen backend directo.

## 5.2 Estado global de sesión

Mover auth/session fuera de `StreamButed` a:

- `src/context/AuthContext.tsx` (o Zustand/Redux)

Objetivo: sesión consistente en toda la app.

## 5.3 Ruteo real

Agregar `react-router-dom`:

- rutas públicas: `/login`, `/register`
- rutas protegidas por rol:
  - `/listener/*`
  - `/artist/*`
  - `/admin/*`

Objetivo: reemplazar `setPage(...)` por navegación declarativa.

## 5.4 Tipado y contratos

Crear `src/types/`:

- `auth.ts`
- `music.ts`
- `admin.ts`

Objetivo: modelos frontend alineados con DTOs del backend.

## 5.5 Separar mocks del dominio real

Mover mocks a `src/mocks/` y desacoplar componentes de `mockData`.

Objetivo: alternar fácilmente entre mock y API real.

---

## 6) Propuesta de estructura objetivo (frontend)

```txt
src/
  api/
    http.ts
    authApi.ts
    tracksApi.ts
    albumsApi.ts
    usersApi.ts
  components/
    icons/
    layout/
    ui/
  context/
    AuthContext.tsx
  hooks/
    useAuth.ts
    usePlayer.ts
  pages/
    auth/
    listener/
    artist/
    admin/
  routes/
    AppRouter.tsx
    ProtectedRoute.tsx
    RoleRoute.tsx
  services/
    playerService.ts
  types/
    auth.ts
    music.ts
    admin.ts
  mocks/
    mockData.ts
  StreamButed.tsx
```

---

## 7) Plan de migración sugerido (sin romper lo actual)

1. **Fase 1:** crear `api/http.ts` + `AuthContext`.
2. **Fase 2:** montar `react-router-dom` y rutas mínimas.
3. **Fase 3:** mover llamadas de datos desde páginas a `api/*`.
4. **Fase 4:** tipar contratos (`types/*`) y limpiar `any`.
5. **Fase 5:** reemplazar gradualmente `mockData` por backend real.

---

## 8) Conclusión

La prioridad es desacoplar:

- **navegación** (router),
- **sesión** (context/store),
- **datos** (capa API).

Con esos ajustes, la división frontend/backend funcionará correctamente y escalará mejor.
Aunque aquí se plantea de una forma, los requisitos planteados y la versión actual está apegada a los primeros prototipos y el versionado inicial de una primera elicitación de los requisitos, pero estuvieron sujetos a cambios y actualmente estamos diviendo y considerando más aspectos que en este momento no contemplábamos, por lo que esta versión es un servicio de Frontend basado en primeras ideas. Una vez empezado a integrar Backend, se trabajará sobre la versión más reciente, revisada y con observaciones a tomar en cuenta por el profesor de Desarrollo de Sistemas en Red.