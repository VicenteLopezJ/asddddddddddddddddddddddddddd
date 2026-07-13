# 🔵 TRACK 4 — KUBERNETES (4 puntos)

> **Autor:** Junior Vicente  
> **Tecnología:** Kubernetes (kubectl) + manifiestos YAML  
> **Imágenes:** Publicadas en DockerHub (`llampier2`)

---

## 📐 Descripción General

Este track define la infraestructura de despliegue en **Kubernetes** para los 3 microservicios y el front-end, usando manifiestos YAML organizados por carpeta.

> ⚠️ **Prerequisito:** Las imágenes Docker deben estar publicadas en DockerHub (Track 3) para que los Pods puedan descargarse.

---

## 📁 Estructura de manifiestos

```
manifest/
├── manifest-vehiculo/                          → MS Vehículo (CRUD)
│   ├── hct-vehiculo-junior.vicente-namespace.yaml
│   ├── hct-vehiculo-junior.vicente-secret.yaml
│   ├── hct-vehiculo-junior.vicente-service.yaml
│   └── hct-vehiculo-junior.vicente-deployment.yaml
│
├── manifest-cliente/                           → MS Cliente (CRUD)
│   ├── hct-cliente-junior.vicente-namespace.yaml
│   ├── hct-cliente-junior.vicente-secret.yaml
│   ├── hct-cliente-junior.vicente-service.yaml
│   └── hct-cliente-junior.vicente-deployment.yaml
│
├── manifest-alquiler/                          → MS Alquiler (Transaccional)
│   ├── hct-alquiler-junior.vicente-namespace.yaml
│   ├── hct-alquiler-junior.vicente-secret.yaml
│   ├── hct-alquiler-junior.vicente-service.yaml
│   └── hct-alquiler-junior.vicente-deployment.yaml
│
└── manifest-frontend/                          → Front-End Angular
    ├── hct-frontend-junior.vicente-namespace.yaml
    ├── hct-frontend-junior.vicente-secret.yaml
    ├── hct-frontend-junior.vicente-service.yaml
    └── hct-frontend-junior.vicente-deployment.yaml
```

**Total: 4 carpetas × 4 archivos = 16 manifiestos YAML**

---

## 📋 Descripción de cada tipo de manifiesto

### 1. `namespace.yaml` — Espacio de nombres
Aísla los recursos del microservicio en su propio namespace de Kubernetes.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: junior-vicente-43-namespace
  labels:
    environment: clase
    managed-by: kubectl
    curso: kubernetes-basico
```

---

### 2. `secret.yaml` — Credenciales de base de datos
Almacena de forma segura las variables de entorno sensibles (URL de BD, usuario, contraseña).

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ms-cliente-secret
  namespace: hct-cliente-junior-vicente
type: Opaque
stringData:
  DB_URL: "r2dbc:postgresql://..."
  DB_USERNAME: "neondb_owner"
  DB_PASSWORD: "***"
```

---

### 3. `service.yaml` — Exposición del microservicio
Define cómo se expone el Pod dentro del cluster (y hacia afuera con NodePort).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: junior-vicente-43-service
  namespace: junior-vicente-43-namespace
spec:
  selector:
    app: vehiculo-app
  type: NodePort
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9090
```

---

### 4. `deployment.yaml` — Despliegue del contenedor
Define la imagen Docker a usar, réplicas, puertos y variables de entorno desde el Secret.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: junior-vicente-43-deployment
  namespace: junior-vicente-43-namespace
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: vehiculo-app
          image: llampier2/hct-vehiculo:latest
          ports:
            - containerPort: 8090
          env:
            - name: PORT
              value: "8090"
            - name: SECRET_USERNAME
              valueFrom:
                secretKeyRef:
                  name: junior-vicente-43-secret
                  key: username
```

---

## 🗂️ Resumen de configuración por microservicio

| Microservicio | Namespace                     | Imagen Docker                   | Réplicas | Puerto |
|---------------|-------------------------------|---------------------------------|----------|--------|
| Vehículo      | `junior-vicente-43-namespace` | `llampier2/hct-vehiculo:latest` | 3        | 8090   |
| Cliente       | `hct-cliente-junior-vicente`  | `llampier2/hct-cliente:latest`  | 3        | 8091   |
| Alquiler      | `hct-alquiler-junior-vicente` | `llampier2/hct-alquiler:latest` | 3        | 8092   |
| Front-End     | `junior-vicente-43-namespace` | `llampier2/hct-frontend:latest` | 1        | 80     |

---

## ▶️ Cómo aplicar los manifiestos

> Requiere: `kubectl` instalado y configurado con acceso a un cluster (Docker Desktop, Minikube, etc.)

### Opción A — Aplicar carpeta por carpeta (recomendado)

**Siempre aplicar en este orden:** namespace → secret → service → deployment

#### 🚗 Microservicio Vehículo
```powershell
kubectl apply -f manifest/manifest-vehiculo/hct-vehiculo-junior.vicente-namespace.yaml
kubectl apply -f manifest/manifest-vehiculo/hct-vehiculo-junior.vicente-secret.yaml
kubectl apply -f manifest/manifest-vehiculo/hct-vehiculo-junior.vicente-service.yaml
kubectl apply -f manifest/manifest-vehiculo/hct-vehiculo-junior.vicente-deployment.yaml
```

#### 👤 Microservicio Cliente
```powershell
kubectl apply -f manifest/manifest-cliente/hct-cliente-junior.vicente-namespace.yaml
kubectl apply -f manifest/manifest-cliente/hct-cliente-junior.vicente-secret.yaml
kubectl apply -f manifest/manifest-cliente/hct-cliente-junior.vicente-service.yaml
kubectl apply -f manifest/manifest-cliente/hct-cliente-junior.vicente-deployment.yaml
```

#### 📋 Microservicio Alquiler
```powershell
kubectl apply -f manifest/manifest-alquiler/hct-alquiler-junior.vicente-namespace.yaml
kubectl apply -f manifest/manifest-alquiler/hct-alquiler-junior.vicente-secret.yaml
kubectl apply -f manifest/manifest-alquiler/hct-alquiler-junior.vicente-service.yaml
kubectl apply -f manifest/manifest-alquiler/hct-alquiler-junior.vicente-deployment.yaml
```

#### 🖥️ Front-End
```powershell
kubectl apply -f manifest/manifest-frontend/hct-frontend-junior.vicente-namespace.yaml
kubectl apply -f manifest/manifest-frontend/hct-frontend-junior.vicente-secret.yaml
kubectl apply -f manifest/manifest-frontend/hct-frontend-junior.vicente-service.yaml
kubectl apply -f manifest/manifest-frontend/hct-frontend-junior.vicente-deployment.yaml
```


#### 🖥️ EXPONER PUERTO

-VEHICULO

kubectl port-forward svc/junior-vicente-43-service 8090:80 -n junior-vicente-43-namespace


-CLIENTE

kubectl port-forward svc/ms-cliente-service 8091:8091 -n hct-cliente-junior-vicente


-ALQUILER

kubectl port-forward svc/ms-alquiler-service 8092:8092 -n hct-alquiler-junior-vicente


-FRONT
kubectl port-forward svc/junior-vicente-frontend-service 8080:80 -n junior-vicente-43-namespace
http://localhost:8080
---

### Opción B — Aplicar toda la carpeta de golpe

```powershell
kubectl apply -f manifest/manifest-vehiculo/
kubectl apply -f manifest/manifest-cliente/
kubectl apply -f manifest/manifest-alquiler/
kubectl apply -f manifest/manifest-frontend/
```

---

## 🧪 Verificar el estado del despliegue

```powershell
# Ver todos los namespaces
kubectl get namespaces

# Ver Pods por namespace
kubectl get pods -n junior-vicente-43-namespace
kubectl get pods -n hct-cliente-junior-vicente
kubectl get pods -n hct-alquiler-junior-vicente

# Ver Deployments
kubectl get deployments -A

# Ver Services
kubectl get services -A

# Ver Secrets
kubectl get secrets -A

# Ver logs de un Pod específico
kubectl logs <nombre-del-pod> -n <namespace>

# Describir un Pod si hay error
kubectl describe pod <nombre-del-pod> -n <namespace>
```

---

## 🗑️ Eliminar todos los recursos (limpieza)

```powershell
kubectl delete -f manifest/manifest-vehiculo/
kubectl delete -f manifest/manifest-cliente/
kubectl delete -f manifest/manifest-alquiler/
kubectl delete -f manifest/manifest-frontend/
```

---

## 📋 Checklist de entrega

- [x] `manifest-vehiculo/` con 4 archivos YAML (namespace, secret, service, deployment)
- [x] `manifest-cliente/` con 4 archivos YAML (namespace, secret, service, deployment)
- [x] `manifest-alquiler/` con 4 archivos YAML (namespace, secret, service, deployment)
- [x] `manifest-frontend/` con 4 archivos YAML (namespace, secret, service, deployment)
- [x] Secrets configurados con credenciales de NeonDB
- [x] Deployments referenciando imágenes de DockerHub (`llampier2/`)
- [x] Services de tipo `NodePort` para exponer los microservicios
- [x] Vehículo y Alquiler con **3 réplicas** (alta disponibilidad)
- [x] Front-End con **1 réplica**

---

## 💡 Conceptos clave implementados

| Concepto        | Descripción                                                    |
|-----------------|----------------------------------------------------------------|
| **Namespace**   | Aislamiento lógico de recursos por microservicio               |
| **Secret**      | Almacenamiento seguro de credenciales (no en texto plano)      |
| **Deployment**  | Gestión declarativa de Pods con réplicas y actualizaciones     |
| **Service**     | Exposición estable de Pods (independiente de IPs de Pods)      |
| **NodePort**    | Tipo de servicio que expone el puerto en cada nodo del cluster |
| **Replicas**    | 3 instancias de cada microservicio para alta disponibilidad    |
| **SecretKeyRef**| Inyección de secretos como variables de entorno en el Pod      |
