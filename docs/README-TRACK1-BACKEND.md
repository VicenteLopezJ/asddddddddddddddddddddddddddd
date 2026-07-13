# 🔵 TRACK 1 — BACK-END (4 puntos)

> **Autor:** Junior Vicente  
> **Tecnología:** Spring Boot 4.1 + Spring WebFlux + R2DBC + PostgreSQL (NeonDB) + JDK 26  
> **Tipo:** Microservicios reactivos (no bloqueantes)

---

## 📐 Arquitectura General

El back-end está dividido en **3 microservicios independientes**, cada uno con su propia base de datos PostgreSQL en la nube (NeonDB):

```
back/
├── junior.vicente/           → MS Maestro CRUD  (Vehículo)  → Puerto 8090
├── junior.vicente-cliente/   → MS Maestro CRUD  (Cliente)   → Puerto 8091
└── junior.vicente-alquiler/  → MS Transaccional (Alquiler)  → Puerto 8092
```

### Estructura interna de cada microservicio

```
src/main/java/hct/junior/vicente/
├── model/        → Entidad (tabla de base de datos)
├── repository/   → Interfaz R2DBC (acceso a datos reactivo)
├── service/      → Lógica de negocio
└── rest/         → Controlador REST (@RestController)
```

---

## 🚗 Microservicio 1 — Vehículo (CRUD Maestro)

**Carpeta:** `back/junior.vicente`  
**Puerto:** `8090`  
**Base de datos:** PostgreSQL NeonDB (instancia exclusiva para vehículo)

### Modelo de datos

| Campo         | Tipo    | Descripción            |
|---------------|---------|------------------------|
| id            | Long    | Identificador único    |
| placa         | String  | Placa del vehículo     |
| marca         | String  | Marca (Toyota, etc.)   |
| modelo        | String  | Modelo (Corolla, etc.) |
| anio          | Integer | Año de fabricación     |
| color         | String  | Color del vehículo     |
| precioPorDia  | Double  | Precio de alquiler/día |
| estado        | String  | DISPONIBLE / ELIMINADO |

### Ejemplo de JSON

```json
{
  "id": 1,
  "placa": "ABC-123",
  "marca": "Toyota",
  "modelo": "Corolla",
  "anio": 2026,
  "color": "Blanco",
  "precioPorDia": 150,
  "estado": "DISPONIBLE"
}
```

### Endpoints REST disponibles

| Método | Endpoint                        | Descripción                          |
|--------|---------------------------------|--------------------------------------|
| GET    | `/vehiculos`                    | Lista todos los vehículos            |
| GET    | `/vehiculos/activos`            | Lista solo los vehículos activos     |
| GET    | `/vehiculos/eliminados`         | Lista los vehículos eliminados       |
| GET    | `/vehiculos/{id}`               | Busca un vehículo por ID             |
| POST   | `/vehiculos`                    | Crea un nuevo vehículo               |
| PUT    | `/vehiculos/{id}`               | Actualiza un vehículo completo       |
| PATCH  | `/vehiculos/{id}/deactivate`    | Desactiva (elimina lógicamente)      |
| PATCH  | `/vehiculos/{id}/activate`      | Reactiva un vehículo                 |

---

## 👤 Microservicio 2 — Cliente (CRUD Maestro)

**Carpeta:** `back/junior.vicente-cliente`  
**Puerto:** `8091`  
**Base de datos:** PostgreSQL NeonDB (instancia exclusiva para cliente)

### Modelo de datos

| Campo     | Tipo   | Descripción                    |
|-----------|--------|--------------------------------|
| id        | Long   | Identificador único            |
| dni       | String | DNI del cliente (8 dígitos)    |
| nombres   | String | Nombres del cliente            |
| apellidos | String | Apellidos del cliente          |
| celular   | String | Número de celular              |
| correo    | String | Correo electrónico             |
| licencia  | String | Número de licencia de conducir |
| estado    | String | ACTIVO / ELIMINADO             |

### Ejemplo de JSON

```json
{
  "id": 1,
  "dni": "72654321",
  "nombres": "Miguel Luis",
  "apellidos": "Lopez Sanchez",
  "celular": "987654321",
  "correo": "miguel@gmail.com",
  "licencia": "012345678",
  "estado": "ACTIVO"
}
```

### Endpoints REST disponibles

| Método | Endpoint                       | Descripción                         |
|--------|--------------------------------|-------------------------------------|
| GET    | `/clientes`                    | Lista todos los clientes            |
| GET    | `/clientes/activos`            | Lista solo clientes activos         |
| GET    | `/clientes/eliminados`         | Lista clientes eliminados           |
| GET    | `/clientes/{id}`               | Busca cliente por ID                |
| GET    | `/clientes/dni/{dni}`          | Busca cliente por número de DNI     |
| POST   | `/clientes`                    | Crea un nuevo cliente               |
| PUT    | `/clientes/{id}`               | Actualiza un cliente completo       |
| PATCH  | `/clientes/{id}/deactivate`    | Desactiva (elimina lógicamente)     |
| PATCH  | `/clientes/{id}/activate`      | Reactiva un cliente                 |

---

## 📋 Microservicio 3 — Alquiler (Transaccional)

**Carpeta:** `back/junior.vicente-alquiler`  
**Puerto:** `8092`  
**Base de datos:** PostgreSQL NeonDB (instancia exclusiva para alquiler)

> ⚠️ Este es el microservicio **transaccional**: registra las operaciones de alquiler referenciando `clienteId` y `vehiculoId`.

### Modelo de datos

| Campo        | Tipo         | Descripción                        |
|--------------|--------------|------------------------------------|
| id           | Long         | Identificador único                |
| clienteId    | Long         | ID del cliente (FK lógica)         |
| vehiculoId   | Long         | ID del vehículo (FK lógica)        |
| dias         | Integer      | Duración del alquiler en días      |
| fechaInicio  | LocalDate    | Fecha de inicio del alquiler       |
| fechaFin     | LocalDate    | Fecha de fin del alquiler          |
| total        | Double       | Total calculado (días × precio/día)|
| estado       | String       | ACTIVO / CANCELADO                 |

### Ejemplo de JSON

```json
{
  "id": 1,
  "clienteId": 1,
  "vehiculoId": 1,
  "dias": 3,
  "fechaInicio": "2026-07-03",
  "fechaFin": "2026-07-06",
  "total": 720.00,
  "estado": "ACTIVO"
}
```

### Endpoints REST disponibles

| Método | Endpoint                             | Descripción                          |
|--------|--------------------------------------|--------------------------------------|
| GET    | `/alquileres`                        | Lista todos los alquileres           |
| GET    | `/alquileres/activos`                | Lista alquileres activos             |
| GET    | `/alquileres/cancelados`             | Lista alquileres cancelados          |
| GET    | `/alquileres/{id}`                   | Busca alquiler por ID                |
| GET    | `/alquileres/cliente/{clienteId}`    | Alquileres de un cliente específico  |
| GET    | `/alquileres/vehiculo/{vehiculoId}`  | Alquileres de un vehículo específico |
| GET    | `/alquileres/estado/{estado}`        | Filtra por estado                    |
| POST   | `/alquileres`                        | Crea un nuevo alquiler               |
| PUT    | `/alquileres/{id}`                   | Actualiza un alquiler completo       |
| PATCH  | `/alquileres/{id}/cancel`            | Cancela un alquiler                  |
| PATCH  | `/alquileres/{id}/restore`           | Restaura un alquiler cancelado       |

---

## ▶️ Cómo ejecutar (desarrollo local)

> Requiere: **JDK 26** y conexión a internet (base de datos en la nube).

Abre **3 terminales separadas** y ejecuta cada una:

### Terminal 1 — Vehículo (puerto 8090)
```powershell
cd back/junior.vicente
.\mvnw spring-boot:run
```
✅ Listo cuando aparezca: `Started HackathonApplication`

### Terminal 2 — Cliente (puerto 8091)
```powershell
cd back/junior.vicente-cliente
.\mvnw spring-boot:run
```
✅ Listo cuando aparezca: `Started` en los logs

### Terminal 3 — Alquiler (puerto 8092)
```powershell
cd back/junior.vicente-alquiler
.\mvnw spring-boot:run
```
✅ Listo cuando aparezca: `Started` en los logs

---

## 🧪 Verificación rápida (con curl o Postman)

```bash
# Vehículo
curl http://localhost:8090/vehiculos

# Cliente
curl http://localhost:8091/clientes

# Alquiler
curl http://localhost:8092/alquileres
```

---

## 🛠️ Stack Tecnológico

| Tecnología                    | Versión / Descripción                             |
|-------------------------------|---------------------------------------------------|
| Java                          | JDK 26                                            |
| Spring Boot                   | 4.1.0                                             |
| Spring WebFlux                | Programación reactiva (no bloqueante)             |
| Spring Data R2DBC             | Acceso reactivo a base de datos                   |
| PostgreSQL (R2DBC driver)     | Driver reactivo para PostgreSQL                   |
| PostgreSQL (NeonDB)           | Base de datos en la nube (3 instancias separadas) |
| Lombok                        | Reducción de boilerplate                          |
| Maven Wrapper                 | Build sin instalar Maven globalmente              |

---

## 📁 Configuración de variables de entorno

Cada microservicio acepta estas variables de entorno (con valores por defecto para desarrollo local):

| Variable      | Descripción           | Default (vehículo)                |
|---------------|-----------------------|-----------------------------------|
| `PORT`        | Puerto del servidor   | `8090` / `8091` / `8092`          |
| `DB_URL`      | URL de conexión R2DBC | Conexión NeonDB preconfigurada    |
| `DB_USERNAME` | Usuario de BD         | `neondb_owner`                    |
| `DB_PASSWORD` | Contraseña de BD      | Configurada en `application.yaml` |
