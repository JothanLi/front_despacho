# Front Despacho - React + Vite

Frontend desarrollado con React y Vite para la gestión visual de ventas y despachos. La aplicación permite consultar ventas, generar despachos, revisar despachos existentes y cerrar o actualizar el estado de entrega. En producción se sirve mediante Nginx, el cual también actúa como proxy hacia los servicios backend de ventas y despachos.

## Tecnologías utilizadas

- React 18
- Vite 5
- React Router DOM
- Axios
- React Hook Form
- SweetAlert2
- React Icons
- Tailwind CSS
- Nginx
- Docker / Docker Compose
- Kubernetes / EKS

## Estructura principal

```text
front_despacho/
├── public/
├── src/
│   ├── api/
│   │   └── axiosConfig.js       # Configuración base de Axios
│   ├── assets/                  # Imágenes y recursos estáticos
│   ├── componentes/             # Componentes de UI y formularios
│   ├── Routes/                  # Rutas de la aplicación
│   ├── index.css
│   └── main.jsx
├── k8s/                         # Manifiestos Kubernetes
├── Dockerfile
├── docker-compose.yml
├── docker-compose-prod.yml
├── nginx.conf
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Funcionalidades

- Interfaz web para administración de ventas y despachos.
- Listado de ventas disponibles.
- Generación de despacho a partir de una venta.
- Listado de despachos registrados.
- Edición y cierre de despacho.
- Alertas visuales con SweetAlert2.
- Consumo de APIs mediante Axios.
- Proxy Nginx para comunicar el frontend con los microservicios backend.

## Configuración de API

La configuración de Axios se encuentra en:

```text
src/api/axiosConfig.js
```

La aplicación usa como base URL:

```text
/api/v1
```

Por eso, las llamadas desde React quedan así:

```text
/api/v1/ventas
/api/v1/despachos
```

En producción, Nginx redirige estas rutas hacia los servicios internos:

| Ruta frontend | Servicio destino |
|---|---|
| `/api/v1/ventas` | `http://ventas-service:8080/api/v1/ventas` |
| `/api/v1/despachos` | `http://despachos-service:8080/api/v1/despachos` |

## Requisitos previos

Para ejecutar localmente se necesita:

- Node.js 18 o superior recomendado.
- npm.
- Backend de ventas disponible.
- Backend de despachos disponible.
- Docker, si se desea ejecutar contenerizado.

## Instalación local

Desde la carpeta raíz del proyecto:

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

Por defecto Vite levanta la aplicación en:

```text
http://localhost:5173
```

## Build de producción

```bash
npm run build
```

El resultado queda en la carpeta:

```text
dist/
```

## Vista previa del build

```bash
npm run preview
```

## Linter

```bash
npm run lint
```

## Ejecución con Docker Compose

El archivo `docker-compose.yml` construye la imagen del frontend y la publica en el puerto 80.

```bash
docker compose up --build -d
```

Ver contenedor:

```bash
docker ps
```

Ver logs:

```bash
docker logs front-despacho -f
```

Detener:

```bash
docker compose down
```

La aplicación quedará disponible en:

```text
http://localhost
```

## Imagen Docker

Construir imagen local:

```bash
docker build -t front-despacho:latest .
```

Ejecutar imagen manualmente:

```bash
docker run -p 80:8080 front-despacho:latest
```

## Nginx

El archivo `nginx.conf` cumple dos funciones principales:

1. Servir la aplicación React compilada desde `/usr/share/nginx/html`.
2. Redirigir las llamadas del frontend hacia los backends dentro del cluster.

Rutas configuradas:

```text
/                         -> React SPA
/api/v1/ventas            -> ventas-service:8080
/api/v1/despachos         -> despachos-service:8080
/health                   -> frontend ok
```

La ruta `/health` se usa para readiness y liveness probes en Kubernetes.

## Despliegue en Kubernetes / EKS

El proyecto incluye manifiestos en la carpeta `k8s/`:

```text
k8s/
├── frontend-deployment.yaml
├── frontend-hpa.yaml
└── frontend-service.yaml
```

Aplicar manifiestos:

```bash
kubectl apply -f k8s/
```

Ver recursos:

```bash
kubectl get pods -n innovatech
kubectl get svc -n innovatech
kubectl get hpa -n innovatech
```

El servicio se expone como `LoadBalancer`:

```text
frontend-service
```

Para obtener la URL o IP pública:

```bash
kubectl get svc frontend-service -n innovatech
```

## Integración esperada con backends

Para que el frontend funcione correctamente en Kubernetes, deben existir estos servicios dentro del namespace `innovatech`:

```text
ventas-service:8080
despachos-service:8080
```

Si alguno de estos servicios no existe o está caído, las rutas `/api/v1/ventas` o `/api/v1/despachos` devolverán error desde Nginx o desde el navegador.

## Comandos útiles

Reinstalar dependencias:

```bash
rm -rf node_modules package-lock.json
npm install
```

Limpiar build:

```bash
rm -rf dist
npm run build
```

Probar health check del contenedor:

```bash
curl http://localhost/health
```

Probar API a través del frontend/Nginx:

```bash
curl http://localhost/api/v1/ventas
curl http://localhost/api/v1/despachos
```

## Notas importantes

- La aplicación no llama directamente a `localhost:8081` o `localhost:8082`; usa `/api/v1` para que Nginx o el proxy resuelva el backend.
- En Kubernetes, el frontend depende de los servicios `ventas-service` y `despachos-service`.
- En desarrollo local con `npm run dev`, puede ser necesario configurar proxy en Vite o consumir los backends directamente si no se usa Nginx.
- El archivo `docker-compose.yml` publica el frontend en el puerto `80` del equipo local.
