# ============================================================
# STAGE 1: Build - Compilar el JAR con Maven
# ============================================================
FROM eclipse-temurin:26-jdk-alpine AS builder

WORKDIR /app

# Cache de dependencias
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Compilar el JAR (Spring Boot 4.x - layertools ya no está incluido)
COPY src ./src
RUN ./mvnw clean package -DskipTests -q

# ============================================================
# STAGE 2: Imagen final mínima (Alpine JRE ~55MB comprimido)
# ============================================================
FROM eclipse-temurin:26-jre-alpine

# Sin usuario root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copiar el JAR directamente
COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8092
EXPOSE 8092

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
