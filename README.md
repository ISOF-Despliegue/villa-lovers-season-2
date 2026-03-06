# API Calculadora

Se hizo una API REST de ejemplo para demostrar un desarrollo y dockerización, con Node.js y Express que permite realizar distintas operaciones.

## Integrantes del Equipo
* Miguel Eduardo Escobar Ladrón de Guevara
* Alan Raziel Filobello Aguilar
* Uriel Cendón Díaz

## Tecnologías Usadas
* **Runtime**: Node.js
* **Framework**: Express
* **Contenerización**: Docker

## Docker

El proyecto utiliza una estrategia de construcción optimizada para producción.

### Requisitos
* Docker Desktop instalado y en ejecución.

### Estrategia de Construcción
Se utiliza una construcción multi-etapa definida en el Dockerfile. 
Esta técnica permite separar el entorno de instalación del entorno de ejecución final.

### Comandos de Despliegue (En la terminal)
1. Construir la imagen:
docker build -t calculadora-uv-prod .

2. Ejecutar el contenedor, realiza el mapeo del puerto 3000 e inyectar las variables de entorno para producción
docker run -d -p 3000:3000 --name mi-api-contenerizada -e NODE_ENV=production -e PORT=3000 calculadora-uv-prod

3. Verificar ejecución:
docker ps

## Seguridad
Basándonos en el archivo de prueba en el proyecto de GitHub del profesor, se agarró parte de su archivo Docker, explicando los siguientes puntos que ahí se encuentran:
#### Imagen Base Alpine: 
Uso de node:22-alpine para minimizar la superficie de ataque y el peso de la imagen.

#### Manejo de Variables de Envorno: 
Configuración mediante variables de entorno.

#### Usuario No-Root: 
La API se ejecuta bajo el usuario predefinido node para evitar privilegios de superusuario.

#### Limpieza de Binarios: 
Se eliminaron npm y npx del contenedor final para reducir vulnerabilidades heredadas (CVEs).

### Pruebas con Endpoints 
1. Suma (GET)
URL: http://localhost:3000/suma?num1=15&num2=10

Resultado Esperado: {"resultado": 25}

2. Promedio de Lista (POST)
URL: http://localhost:3000/promedio
Header: Content-Type: application/json
Body: {"numeros": [10, 20, 30, 40]}

Resultado Esperado: {"promedio": 25, "total": 100, "cantidad": 4}

3. Actualización de Memoria (PATCH)
URL: http://localhost:3000/memoria
Body: {"incremento": 50}
Resultado Esperado: El valor se debe actualizar, sumándole 50 al valorActual. Demuestra la actualización parcial de un recurso en el servidor.