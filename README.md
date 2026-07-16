# Frontend de Gestión de Despachos

Aplicación React/Vite para consultar ventas, generar órdenes de despacho y registrar su cierre.

## Mejoras incluidas

- Se normalizó el campo `despachado` entre frontend y backend.
- La venta se actualiza mediante `PATCH /ventas/{id}/despacho`.
- El cierre utiliza `PATCH /despachos/{id}/estado` y ya no borra datos.
- Se agregó compensación: si falla la actualización de venta, se elimina el despacho recién creado.
- ESLint funcional, pruebas con Node Test Runner y build Vite.
- Dependencias actualizadas y auditoría de producción sin vulnerabilidades reportadas al generar esta entrega.
- Docker multietapa con Nginx no privilegiado.
- Pipeline con lint, tests, build, audit, Trivy, ECR, EKS y smoke test.

## Desarrollo local sin contenedores

```bash
cd front_despacho
npm ci
npm run check
npm run dev
```

## Ejecución con Docker

El Compose individual levanta solo el frontend. Para levantar toda la solución se recomienda utilizar el paquete integrado entregado junto con estos repositorios.

```bash
cd front_despacho
docker compose up --build -d
```

Aplicación: `http://localhost`

## Reverse proxy

Nginx expone la aplicación y enruta:

```text
/api/v1/ventas    -> ventas-service:8080
/api/v1/despachos -> despachos-service:8080
/health           -> health check del frontend
```

## Pipeline CI/CD

### GitHub Secrets requeridos

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
AWS_REGION
EKS_CLUSTER_NAME
```

El frontend se publica en `innovatech-frontend`, se despliega como `frontend` y se expone mediante un Service `LoadBalancer`.
