# 🔵 TRACK 2 — FRONT-END (4 puntos)

> **Autor:** Junior Vicente  
> **Tecnología:** Angular 19 + TypeScript + CSS  
> **Tipo:** Single Page Application (SPA) conectada a los 3 microservicios

---

## 📐 Descripción General

El front-end es una **aplicación Angular** que consume los 3 microservicios del back-end y presenta una interfaz completa para gestionar Vehículos, Clientes y Alquileres.

```
front/
├── src/
│   ├── app/
│   │   ├── feature/           → Módulos por entidad
│   │   │   ├── vehiculo/      → Pantalla de Vehículos
│   │   │   ├── cliente/       → Pantalla de Clientes
│   │   │   └── alquiler/      → Pantalla de Alquileres
│   │   ├── services/          → Servicios HTTP (conexión con el back)
│   │   │   ├── vehiculo.service.ts
│   │   │   ├── cliente.service.ts
│   │   │   └── alquiler.service.ts
│   │   ├── models/            → Interfaces TypeScript
│   │   ├── layout/            → Navbar y estructura principal
│   │   └── shared/            → Componentes reutilizables
│   ├── index.html
│   ├── main.ts
│   └── styles.css             → Estilos globales
├── Dockerfile
└── package.json
```

---

## 🔗 Conexión con el Back-End

Los servicios Angular están configurados para conectarse a cada microservicio en su puerto correspondiente:

| Servicio Angular         | Microservicio Back-End    | URL                              |
|--------------------------|---------------------------|----------------------------------|
| `vehiculo.service.ts`    | MS Vehículo               | `http://localhost:8090/vehiculos`|
| `cliente.service.ts`     | MS Cliente                | `http://localhost:8091/clientes` |
| `alquiler.service.ts`    | MS Alquiler               | `http://localhost:8092/alquileres`|

> ℹ️ Los servicios tienen **fallback automático**: primero intentan `/vehiculos` (proxy), y si falla, usan `localhost` directamente.

---

## 🖥️ Pantallas implementadas

### 1. 🚗 Módulo Vehículo

- **Listar** todos los vehículos con filtro por estado (Activos / Eliminados)
- **Crear** nuevo vehículo con formulario validado
- **Editar** vehículo existente
- **Activar / Desactivar** vehículo (eliminación lógica)

**Campos del formulario:** Placa, Marca, Modelo, Año, Color, Precio por día

---

### 2. 👤 Módulo Cliente

- **Listar** todos los clientes con filtro por estado
- **Crear** nuevo cliente con formulario validado
- **Editar** cliente existente
- **Buscar** cliente por DNI
- **Activar / Desactivar** cliente (eliminación lógica)

**Campos del formulario:** DNI, Nombres, Apellidos, Celular, Correo, Licencia

---

### 3. 📋 Módulo Alquiler

- **Listar** todos los alquileres con filtro por estado (Activos / Cancelados)
- **Crear** nuevo alquiler seleccionando cliente y vehículo
- **Editar** alquiler existente
- **Cancelar / Restaurar** alquiler
- **Filtrar** por cliente o vehículo

**Campos del formulario:** Cliente ID, Vehículo ID, Días, Fecha inicio, Fecha fin, Total

---

## ▶️ Cómo ejecutar (desarrollo local)

> **Requisito previo:** Los 3 microservicios del back-end deben estar corriendo antes de iniciar el front.

### Paso 1 — Instalar dependencias (solo la primera vez)

```powershell
cd front
npm install
```

### Paso 2 — Iniciar el servidor de desarrollo

```powershell
npm run start
```

o equivalentemente:

```powershell
npm run dev
```

✅ Abre el navegador en: **http://localhost:4200**

---

## 🧪 Verificación de funcionamiento

Una vez que esté corriendo, verifica lo siguiente:

| Sección            | URL de prueba                     | Debe mostrar           |
|--------------------|-----------------------------------|------------------------|
| Inicio/Dashboard   | `http://localhost:4200`           | Página principal       |
| Vehículos          | `http://localhost:4200/vehiculos` | Lista de vehículos     |
| Clientes           | `http://localhost:4200/clientes`  | Lista de clientes      |
| Alquileres         | `http://localhost:4200/alquileres`| Lista de alquileres    |

---

## ⚠️ Requisitos para que funcione correctamente

Los 3 backs deben estar levantados **al mismo tiempo**:

```
✅ http://localhost:8090  → MS Vehículo (DEBE estar corriendo)
✅ http://localhost:8091  → MS Cliente  (DEBE estar corriendo)
✅ http://localhost:8092  → MS Alquiler (DEBE estar corriendo)
✅ http://localhost:4200  → Front-End Angular
```

> ⚠️ Si algún back no está corriendo, la sección correspondiente mostrará error o datos vacíos.

---

## 🛠️ Stack Tecnológico

| Tecnología   | Versión / Descripción                                |
|--------------|------------------------------------------------------|
| Angular      | 19 (Standalone Components)                           |
| TypeScript   | Tipado fuerte para modelos e interfaces              |
| RxJS         | Manejo de observables y llamadas HTTP reactivas      |
| HttpClient   | Módulo Angular para consumo de APIs REST             |
| CSS          | Estilos globales en `styles.css`                     |
| Node.js      | Runtime para desarrollo (v18+)                       |
| npm          | Gestor de paquetes                                   |

---

## 🐳 Build para producción (Docker)

El front-end incluye un Dockerfile multi-stage:

```dockerfile
# Stage 1: Build Angular
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/diseno3/browser /usr/share/nginx/html
EXPOSE 80
```

### Comandos para construir la imagen localmente:

```powershell
cd front
docker build -t llampier2/hct-frontend:latest .
```

El contenedor sirve la app en el **puerto 80** usando **Nginx**.
