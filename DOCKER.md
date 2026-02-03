# 🐳 Docker - Guía de Despliegue

Esta guía te ayudará a desplegar la API uMB usando Docker y Docker Compose.

## 📋 Prerequisitos

- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (ya existe `.env.example` como referencia):

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura tus valores:

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/umb_database
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRE=7d
NODE_ENV=production
```

### 2. Construir y Levantar los Contenedores

```bash
docker-compose up -d
```

Este comando:
- Construye la imagen de la API
- Descarga la imagen de MongoDB
- Levanta todos los servicios en segundo plano

### 3. Verificar que los Contenedores están Corriendo

```bash
docker-compose ps
```

Deberías ver 3 servicios corriendo:
- `umb-api` (API Node.js) - Puerto 3000
- `umb-mongo` (MongoDB) - Puerto 27017
- `umb-mongo-express` (UI de MongoDB) - Puerto 8081

### 4. Acceder a los Servicios

- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api-docs
- **Mongo Express:** http://localhost:8081 (usuario: `admin`, password: `admin123`)

## 📦 Comandos Útiles

### Ver Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo de la API
docker-compose logs -f api

# Ver logs solo de MongoDB
docker-compose logs -f mongo
```

### Detener los Servicios

```bash
# Detener sin eliminar contenedores
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar contenedores + volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v
```

### Reiniciar un Servicio

```bash
# Reiniciar la API
docker-compose restart api

# Reiniciar MongoDB
docker-compose restart mongo
```

### Reconstruir la Imagen

```bash
# Reconstruir sin caché
docker-compose build --no-cache

# Reconstruir y levantar
docker-compose up -d --build
```

### Ejecutar Comandos dentro del Contenedor

```bash
# Acceder al shell de la API
docker-compose exec api sh

# Acceder al shell de MongoDB
docker-compose exec mongo mongosh
```

## 🔧 Dockerfile Explicado

El `Dockerfile` utiliza un **multi-stage build**:

### Etapa 1: Builder
- Instala solo las dependencias de producción
- Optimiza el tamaño de la imagen

### Etapa 2: Producción
- Crea un usuario no-root para seguridad
- Copia las dependencias desde la etapa builder
- Configura healthcheck
- Expone el puerto 3000

## 🗄️ Volúmenes de Datos

Los datos de MongoDB se persisten en volúmenes de Docker:

- `mongo-data`: Datos de la base de datos
- `mongo-config`: Configuración de MongoDB

Estos volúmenes persisten incluso si eliminas los contenedores (a menos que uses `docker-compose down -v`).

## 🔒 Seguridad

### En Producción:

1. **Cambiar JWT_SECRET:**
   ```bash
   # Generar una clave segura
   openssl rand -base64 32
   ```

2. **Cambiar credenciales de Mongo Express:**
   Edita `docker-compose.yml`:
   ```yaml
   - ME_CONFIG_BASICAUTH_USERNAME=tu_usuario
   - ME_CONFIG_BASICAUTH_PASSWORD=tu_password_seguro
   ```

3. **Usar MongoDB con autenticación:**
   ```yaml
   mongo:
     environment:
       - MONGO_INITDB_ROOT_USERNAME=admin
       - MONGO_INITDB_ROOT_PASSWORD=tu_password_seguro
   ```

4. **Remover Mongo Express:**
   Comenta o elimina la sección `mongo-express` en producción.

## 🌐 Desplegar en Producción

### Usando Docker

```bash
# 1. Clonar el repositorio en el servidor
git clone <tu-repo>
cd uMBApi

# 2. Configurar variables de entorno
cp .env.example .env
nano .env

# 3. Levantar servicios
docker-compose up -d

# 4. Verificar
docker-compose logs -f
```

### Usando Docker Swarm

```bash
# 1. Inicializar Swarm
docker swarm init

# 2. Desplegar stack
docker stack deploy -c docker-compose.yml umb

# 3. Ver servicios
docker stack services umb
```

### Usando Kubernetes

Para Kubernetes, necesitarás crear manifiestos YAML para:
- Deployment
- Service
- PersistentVolumeClaim
- ConfigMap
- Secret

## 📊 Monitoreo

### Healthcheck

La API incluye un healthcheck que verifica cada 30 segundos:

```bash
# Ver estado de salud
docker inspect --format='{{json .State.Health}}' umb-api
```

### Métricas

Puedes agregar herramientas de monitoreo:
- **Prometheus + Grafana** para métricas
- **ELK Stack** para logs centralizados

## 🔄 Actualizar la Aplicación

```bash
# 1. Hacer pull de cambios
git pull

# 2. Reconstruir y reiniciar
docker-compose up -d --build

# 3. Verificar
docker-compose logs -f api
```

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs completos
docker-compose logs api

# Verificar configuración
docker-compose config
```

### No se conecta a MongoDB

```bash
# Verificar que MongoDB está corriendo
docker-compose ps mongo

# Verificar conexión desde la API
docker-compose exec api ping mongo
```

### Puerto ya en uso

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Puerto del host:Puerto del contenedor
```

## 📝 Notas Adicionales

- Los logs se guardan en `./logs` (montado como volumen)
- La base de datos se reinicia con los datos intactos al reiniciar el contenedor
- Para desarrollo, considera usar `docker-compose.dev.yml` con hot-reload

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Revisa la documentación de Docker: https://docs.docker.com/

---

**¡Tu API está lista para producción! 🚀**
