# Live WebRTC en Produccion

Este despliegue usa la opcion A: mediasoup recibe trafico WebRTC directo por UDP
10000-10100. HTTPS, REST y Socket.IO siguen entrando por `api.migueleelg0106.me`
en 443; el rango UDP solo transporta RTP/RTCP de WebRTC.

## Diagnostico

Una ventana negra con `live-service` healthy y Socket.IO conectado normalmente
significa que el signaling funciona, pero ICE/DTLS no logra transportar media.
En este proyecto la causa esperada era:

- `MEDIASOUP_ANNOUNCED_IP` debe ser la IP publica del Droplet:
  `107.170.62.77`.
- `RTC_MIN_PORT=10000` y `RTC_MAX_PORT=10100`.
- `docker-compose.prod.yml` no puede usar solo `expose` para esos puertos,
  porque `expose` los deja disponibles solo dentro de la red Docker.
- DigitalOcean Cloud Firewall y UFW tambien deben permitir `10000-10100/udp`.

## Variables requeridas

En `.env.production`:

```env
MEDIASOUP_LISTEN_IP=0.0.0.0
MEDIASOUP_ANNOUNCED_IP=107.170.62.77
RTC_MIN_PORT=10000
RTC_MAX_PORT=10100
```

No uses `127.0.0.1`, `localhost` ni `0.0.0.0` como announced IP en
produccion. El cliente remoto debe recibir candidates con la IP publica.

## Firewall

DigitalOcean Cloud Firewall inbound:

```text
22/tcp      solo desde tu IP administrativa
80/tcp      publico
443/tcp     publico
10000-10100/udp publico
```

UFW en el Droplet:

```bash
sudo ufw allow 10000:10100/udp
sudo ufw status verbose
```

Mantener cerrados PostgreSQL, MongoDB, RabbitMQ, MinIO, gRPC y puertos HTTP
internos.

## Despliegue

Desde el Droplet, en el directorio del repositorio:

```bash
git pull
cp .env.production.example .env.production
nano .env.production
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build live-service gateway
docker compose --env-file .env.production -f docker-compose.prod.yml ps live-service gateway
```

Si ya existe `.env.production`, no lo reemplaces; solo confirma las variables de
mediasoup.

## Validacion

Validar puertos publicados por Docker:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps live-service
```

Debe aparecer un mapeo similar a:

```text
0.0.0.0:10000-10100->10000-10100/udp
```

Validar sockets en el host:

```bash
sudo ss -lunp | grep -E ':(10000|10001|10002|10003|10004|10005|10006|10007|10008|10009|10010)'
```

Validar desde fuera del Droplet:

```bash
nmap -sU -Pn -p 10000-10100 api.migueleelg0106.me
```

UDP puede verse como `open|filtered`; lo importante es que no este bloqueado por
reglas del firewall. La prueba funcional final es iniciar un Live desde el
frontend y mirar en logs:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f live-service
```

Estados esperados en logs:

```text
Transport ICE state ... connected
Transport DTLS state ... connected
Producer created ...
Consumer created ...
Consumer resumed ...
```

## Alternativa TURN/TURNS

Si necesitas que Live funcione en redes que bloquean UDP saliente, agrega TURN
o TURNS en 443 con coturn y configura `iceServers` en el cliente. Ese cambio no
esta incluido aqui para no modificar la infraestructura WebRTC/mediasoup actual.
