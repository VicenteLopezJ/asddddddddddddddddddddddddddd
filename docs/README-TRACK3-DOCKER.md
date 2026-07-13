# 🔵 TRACK 3 — DOCKER (4 puntos)

> **Autor:** Junior Vicente  
> **DockerHub usuario:** `llampier2`  
> **Tecnología:** Docker multi-stage builds + DockerHub  

---

## 📐 Descripción General

Este track consiste en **construir y publicar las imágenes Docker** de los 3 microservicios del back-end y del front-end en **DockerHub**, con el formato requerido por el hackathon.

---

## 🐳 Imágenes publicadas en DockerHub

| Servicio              | Imagen DockerHub                        | Puerto |
|-----------------------|-----------------------------------------|--------|
| 🚗 Vehículo (CRUD)   | `llampier2/hct-vehiculo:latest`         | 8090   |
| 👤 Cliente (CRUD)    | `llampier2/hct-cliente:latest`          | 8091   |
| 📋 Alquiler (Trans.) | `llampier2/hct-alquiler:latest`         | 8092   |
| 🖥️ Front-End Angular | `llampier2/hct-frontend:latest`         | 80     |

### Verificar en DockerHub:
👉 https://hub.docker.com/u/llampier2

---

## 📂 Ubicación de los Dockerfiles

```
back/junior.vicente/Dockerfile           → MS Vehículo
back/junior.vicente-cliente/Dockerfile   → MS Cliente
back/junior.vicente-alquiler/Dockerfile  → MS Alquiler
front/Dockerfile                         → Front-End
```

---

## 🏗️ Arquitectura de los Dockerfiles (Back-End)

Todos los microservicios back-end usan **Docker multi-stage build** con 2 etapas:

```dockerfile
# ============================================================
# STAGE 1: Build — Compila el JAR con Maven
# ============================================================
FROM eclipse-temurin:26-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q
COPY src ./src
RUN ./mvnw clean package -DskipTests -q && \
    java -Djarmode=layertools -jar target/*.jar extract --destination target/extracted

# ============================================================
# STAGE 2: Imagen final mínima (~55MB comprimida)
# ============================================================
FROM eclipse-temurin:26-jre-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app
# Capas del JAR en orden óptimo para cache de Docker
COPY --from=builder /app/target/extracted/dependencies/ ./
COPY --from=builder /app/target/extracted/spring-boot-loader/ ./
COPY --from=builder /app/target/extracted/snapshot-dependencies/ ./
COPY --from=builder /app/target/extracted/application/ ./
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", \
            "-Djava.security.egd=file:/dev/./urandom", \
            "org.springframework.boot.loader.launch.JarLauncher"]
```

**Ventajas del multi-stage:**
- ✅ Imagen final pequeña (solo JRE, sin Maven ni JDK)
- ✅ Sin usuario root (seguridad)
- ✅ Capas del JAR separadas = mejor cache de Docker
- ✅ Soporte de contenedores (`UseContainerSupport`)

---

## 🏗️ Dockerfile del Front-End

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
CMD ["nginx", "-g", "daemon off;"]
```

**Resultado:** Imagen Nginx con la app Angular compilada, servida en el puerto 80.

---

## ▶️ Comandos para construir y subir las imágenes

> Ejecutar estos comandos desde la raíz del proyecto. Requiere Docker instalado y sesión iniciada.

### Paso 1 — Iniciar sesión en DockerHub

```powershell
docker login -u llampier2
# Ingresa tu contraseña cuando se solicite
```

---

### Paso 2 — MS Vehículo

```powershell
# Navegar a la carpeta del microservicio
cd back/junior.vicente

# Construir la imagen
docker build -t llampier2/hct-vehiculo:latest .

# Subir a DockerHub
docker push llampier2/hct-vehiculo:latest
```

---

### Paso 3 — MS Cliente

```powershell
cd back/junior.vicente-cliente

docker build -t llampier2/hct-cliente:latest .
docker push llampier2/hct-cliente:latest
```

---

### Paso 4 — MS Alquiler

```powershell
cd back/junior.vicente-alquiler

docker build -t llampier2/hct-alquiler:latest .
docker push llampier2/hct-alquiler:latest
```

---

### Paso 5 — Front-End Angular

```powershell
cd front

docker build -t llampier2/hct-frontend:latest .
docker push llampier2/hct-frontend:latest
```

---

## 🧪 Verificar las imágenes localmente (sin DockerHub)

Para verificar que las imágenes funcionan correctamente antes de subir:

```powershell
# Probar Vehículo
docker run -p 8090:8090 llampier2/hct-vehiculo:latest

# Probar Cliente
docker run -p 8091:8091 llampier2/hct-cliente:latest

# Probar Alquiler
docker run -p 8092:8092 llampier2/hct-alquiler:latest

# Probar Front-End
docker run -p 8080:80 llampier2/hct-frontend:latest
# Abre: http://localhost:8080
```

---

## 🔄 Script completo (todo en uno)

```powershell
# Login
docker login -u llampier2

# Vehiculo
cd back/junior.vicente
docker build -t llampier2/hct-vehiculo:latest . && docker push llampier2/hct-vehiculo:latest

# Cliente
cd ../junior.vicente-cliente
docker build -t llampier2/hct-cliente:latest . && docker push llampier2/hct-cliente:latest

# Alquiler
cd ../junior.vicente-alquiler
docker build -t llampier2/hct-alquiler:latest . && docker push llampier2/hct-alquiler:latest

# Front
cd ../../front
docker build -t llampier2/hct-frontend:latest . && docker push llampier2/hct-frontend:latest

Write-Host "✅ Todas las imágenes subidas exitosamente a DockerHub"
```

---

## 📋 Checklist de entrega

- [x] `llampier2/hct-vehiculo:latest` publicada en DockerHub
- [x] `llampier2/hct-cliente:latest` publicada en DockerHub
- [x] `llampier2/hct-alquiler:latest` publicada en DockerHub
- [x] `llampier2/hct-frontend:latest` publicada en DockerHub
- [x] Dockerfile multi-stage para cada back-end (JDK 26)
- [x] Dockerfile multi-stage para front-end (Node 18 + Nginx)
- [x] Imágenes sin usuario root (seguridad)
