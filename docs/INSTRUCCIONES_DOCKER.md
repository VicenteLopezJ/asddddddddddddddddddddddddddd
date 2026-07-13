# Guía de comandos para DockerHub (Usuario: llampier2)

Para subir tus imágenes a DockerHub, sigue los siguientes pasos. Abre una terminal y navega a cada carpeta para construir y subir su respectiva imagen.

## 1. Iniciar sesión en DockerHub
Primero, asegúrate de estar logueado en tu cuenta:
```bash
docker login -u llampier2
```
*Te pedirá ingresar tu contraseña.*

## 2. Microservicio Vehículo
Abre tu terminal en la carpeta `back/junior.vicente`:
```bash
# Construir la imagen
docker build -t llampier2/hct-vehiculo:latest .

# Subir la imagen
docker push llampier2/hct-vehiculo:latest
```

## 3. Microservicio Cliente
Abre tu terminal en la carpeta `back/junior.vicente-cliente`:
```bash
# Construir la imagen
docker build -t llampier2/hct-cliente:latest .

# Subir la imagen
docker push llampier2/hct-cliente:latest
```

## 4. Microservicio Alquiler
Abre tu terminal en la carpeta `back/junior.vicente-alquiler`:
```bash
# Construir la imagen
docker build -t llampier2/hct-alquiler:latest .

# Subir la imagen
docker push llampier2/hct-alquiler:latest
```

## 5. Front-End (Angular)
Abre tu terminal en la carpeta `front`:
```bash
# Construir la imagen
docker build -t llampier2/hct-frontend:latest .

# Subir la imagen
docker push llampier2/hct-frontend:latest
```

¡Con esto tendrás todas tus imágenes arriba en tu repositorio de DockerHub cumpliendo con el TRACK 3!
