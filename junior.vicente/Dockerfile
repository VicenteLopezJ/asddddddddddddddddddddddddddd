# ============================================================
# STAGE 1: Build - Compilar el JAR con Maven
# ============================================================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Cache de dependencias
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Compilar y extraer capas del JAR (Spring Boot Layered JAR)
COPY src ./src
RUN ./mvnw clean package -DskipTests -q && \
    java -Djarmode=layertools -jar target/*.jar extract --destination target/extracted

# ============================================================
# STAGE 2: Imagen final mínima (Alpine JRE ~55MB comprimido)
# ============================================================
FROM eclipse-temurin:26-jre-alpine

# Sin usuario root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copiar capas del JAR en orden (mejor cache de Docker)
COPY --from=builder /app/target/extracted/dependencies/ ./
COPY --from=builder /app/target/extracted/spring-boot-loader/ ./
COPY --from=builder /app/target/extracted/snapshot-dependencies/ ./
COPY --from=builder /app/target/extracted/application/ ./

ENV PORT=8091
EXPOSE 8091

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "org.springframework.boot.loader.launch.JarLauncher"]