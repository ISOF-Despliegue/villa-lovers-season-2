
# Frontend - Unificacion con backend

Fecha: 2026-05-06

Actualizacion: 2026-05-07

## Resumen

El frontend de `front-streambuted` quedo conectado por primera vez a los servicios reales disponibles a traves de Gateway:

- Identity Service
- Catalog Service
- Media Service
- Gateway en `http://localhost`

No se conectaron Analytics, Live ni Streaming/Playback porque no tienen API HTTP operativa ni rutas de gateway suficientes.

## Configuracion

El frontend usa:

```env
VITE_API_BASE_URL=http://localhost
```

Todas las llamadas HTTP productivas se construyen sobre:

```txt
http://localhost/api/v1
```

## Servicios conectados

### Identity Service

Endpoints usados:

```txt
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/users/me
PUT  /api/v1/users/me
PATCH /api/v1/users/promote
```

Pantallas conectadas:

- Login
- Registro
- Refresh inicial de sesion
- Logout
- Settings / perfil
- Promocion a artista

Decision de registro:

`register` crea el usuario y devuelve token, pero no adjunta cookie HttpOnly igual que `login`. Para mantener refresh consistente, el frontend registra y luego ejecuta login automatico con las mismas credenciales.

### Catalog Service

Endpoints usados:

```txt
GET   /api/v1/catalog/search?q=&limit=&offset=
GET   /api/v1/catalog/artists/{artistId}
GET   /api/v1/catalog/artists/{artistId}/albums
GET   /api/v1/catalog/artists/{artistId}/tracks
GET   /api/v1/catalog/albums/{albumId}
GET   /api/v1/catalog/tracks/{trackId}
POST  /api/v1/catalog/albums
PATCH /api/v1/catalog/albums/{albumId}
PATCH /api/v1/catalog/albums/{albumId}/retire
POST  /api/v1/catalog/tracks
PATCH /api/v1/catalog/tracks/{trackId}
PATCH /api/v1/catalog/tracks/{trackId}/retire
```

Pantallas conectadas:

- Search
- Detalle de artista
- Detalle de album
- Dashboard de artista
- Mis pistas
- Mis albums
- Crear album
- Crear track
- Editar/retirar track

Brecha documentada:

El detalle de album consume `GET /catalog/albums/{albumId}`. Catalog todavia no expone un endpoint publico para listar pistas por album, por lo que no se inventa tracklist.

### Media Service

Endpoints usados:

```txt
POST /api/v1/media/profile-image
POST /api/v1/media/audio
POST /api/v1/media/images
GET  /api/v1/media/assets/{assetId}
```

Usos:

- Imagen de perfil
- Portadas de album
- Portadas de track
- Audio para creacion de track
- Carga de assets por URL publica

Estado validado el 2026-05-07:

- `OPTIONS /api/v1/media/profile-image` y `OPTIONS /api/v1/media/audio` responden con CORS correcto para `http://localhost:5173`.
- Los uploads usan `multipart/form-data` con `Authorization: Bearer <accessToken>` y `credentials: "include"`.
- Media acepta audio MP3, WAV, FLAC, OGG y WEBM hasta 200 MB.
- Gateway permite cuerpos hasta 256 MB para no cortar uploads validos antes de llegar a Media.
- La subida a MinIO guarda `Content-Type` como header del objeto, no como metadata custom `content-type`, para evitar `SignatureDoesNotMatch`.

El frontend no consume:

```txt
GET /api/v1/media/assets/{assetId}/metadata
```

Ese endpoint esta bloqueado por Gateway y la validacion corresponde a Catalog por gRPC interno.

Flujos de upload probados:

```txt
POST /api/v1/media/profile-image
PUT  /api/v1/users/me { profileImageAssetId }

POST /api/v1/media/images usage=ALBUM_COVER
POST /api/v1/catalog/albums

POST /api/v1/media/audio
POST /api/v1/media/images usage=TRACK_COVER
POST /api/v1/catalog/tracks
```

Estos flujos validan que el problema de `Failed to fetch` era del backend/gateway, no de la construccion de `FormData` en frontend.

## Manejo de sesion

El access token se guarda solo en memoria mediante:

```txt
src/services/authTokenStore.ts
```

Reglas aplicadas:

- No se usa `localStorage`.
- No se usa `sessionStorage`.
- Todas las peticiones usan `credentials: "include"`.
- `Authorization: Bearer <accessToken>` se adjunta desde `apiClient`.
- Al cargar la app se intenta `POST /api/v1/auth/refresh`.
- Si refresh falla, se limpia la sesion y se muestran rutas publicas.
- Logout llama backend y despues limpia memoria local.

## Pantallas con datos reales

- Login
- Registro
- Settings / perfil
- Promocion a artista
- Search
- Detalle de artista
- Detalle de album
- Dashboard de artista
- Mis pistas
- Upload Single
- Create Album
- Edit Track

## Pantallas placeholder

Estas pantallas se mantienen visibles, pero no muestran datos falsos:

- Home: preparada para recomendaciones reales futuras.
- Library: pendiente de API de biblioteca/favoritos.
- Lives: pendiente de Live Service.
- Artist Analytics: pendiente de Analytics Service.
- Admin Users: pendiente de endpoints administrativos.
- Admin Moderation: pendiente de endpoints administrativos de moderacion.
- Admin Reports: pendiente de Analytics Service.
- Player: muestra metadatos de pista seleccionada, pero no reproduce ni simula progreso.

## Player

Se eligio la opcion A del prompt:

```txt
Player preparado, sin reproduccion.
```

El frontend no simula streaming, progreso, reproducciones ni persistencia de playback. Cuando el usuario selecciona una pista real de Catalog, el player muestra metadatos y avisa que Streaming Service sigue pendiente.

## Promocion a artista

Flujo implementado:

1. `PATCH /api/v1/users/promote`
2. `GET /api/v1/users/me`
3. Mensaje de "preparando perfil de artista"
4. Reintentos temporales contra `GET /api/v1/catalog/artists/{userId}`
5. Si Catalog aun no creo el artista por RabbitMQ, se informa al usuario y se permite reintentar desde dashboard.

## Verificacion de mocks

Busqueda ejecutada en `front-streambuted/src`:

```txt
mockData
USERS_MOCK
TRACKS
ALBUMS
ARTISTS
FLAGGED_MOCK
ACTIVITY
trafficData
usersData
pieData
setInterval
localStorage
sessionStorage
```

Resultado:

```txt
Sin referencias productivas.
```

## Verificacion ejecutada

Comandos ejecutados desde `front-streambuted`:

```txt
npm install                 OK
npm run lint                OK
npm run typecheck           OK
npm test -- --runInBand     OK, 8 suites / 15 tests
npm run build:electron      OK
```

Verificacion backend ejecutada el 2026-05-07:

```txt
Media pytest: 19 passed
Media CORS preflight profile-image: 200 OK
Media CORS preflight audio: 200 OK
Perfil con imagen: register -> upload profile-image -> PUT /users/me OK
Album: upload cover -> POST /catalog/albums OK
Track: upload audio -> upload cover -> POST /catalog/tracks OK
Track en album con genero: upload audio -> upload cover -> POST /catalog/albums/{albumId}/tracks OK
Identity build: OK
identity-service container: Healthy
```

`npm run build` no pudo completarse en este entorno:

```txt
Comando: npm run build
Fase: npm run build:renderer / vite build
Error: [plugin externalize-deps] Error: spawn EPERM
Causa probable: restriccion del sandbox al permitir que Vite/Rolldown haga spawn durante la carga de config.
```

Se solicito ejecutar `npm run build` fuera del sandbox, pero la aprobacion automatica fue rechazada por limite de uso del entorno. No se ejecuto `npm run electron` porque requiere lanzar una aplicacion GUI y el build renderer no quedo generado en esta verificacion.

Tambien se intento iniciar `npm run dev` en segundo plano para dejar una URL local de prueba, pero `Start-Process` fallo con `Acceso denegado` dentro del sandbox y el reintento escalado fue rechazado por el mismo limite del entorno.
