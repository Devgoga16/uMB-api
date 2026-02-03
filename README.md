# uMB API - Sistema de Autenticación con JWT

API RESTful desarrollada con Node.js, Express y MongoDB que incluye sistema de autenticación JWT y CRUD completo de usuarios.

## 🚀 Características

- ✅ Autenticación con JWT (JSON Web Tokens)
- ✅ CRUD completo de usuarios
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Roles de usuario (usuario, admin)
- ✅ Middleware de autorización
- ✅ Validación de datos
- ✅ Manejo de errores centralizado
- ✅ MongoDB con Mongoose

## 📁 Estructura del Proyecto

```
uMBApi/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticación
│   │   └── userController.js    # Controlador de usuarios
│   ├── middleware/
│   │   └── authMiddleware.js    # Middleware de autenticación
│   ├── models/
│   │   └── User.js              # Modelo de usuario
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   └── userRoutes.js        # Rutas de usuarios
│   ├── utils/
│   │   └── errorHandler.js      # Manejador de errores
│   └── app.js                   # Configuración de Express
├── .env.example                 # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── server.js                    # Punto de entrada
└── README.md
```

## 🔧 Instalación

1. **Clonar el repositorio e instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**

Crear archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/umb_database
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRE=7d
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,*
```

**Nota sobre CORS:**
- En desarrollo (`NODE_ENV=development`): Permite todos los orígenes
- En producción: Solo permite los orígenes especificados en `ALLOWED_ORIGINS`
- Usa `*` en `ALLOWED_ORIGINS` para permitir todos los orígenes (no recomendado en producción)

3. **Asegurarse de tener MongoDB corriendo**

4. **Iniciar el servidor:**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 📚 Endpoints de la API

### Autenticación

#### Registrar Usuario
```http
POST /api/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "rol": "usuario"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

#### Obtener Usuario Actual
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Usuarios (Requiere autenticación y rol admin)

#### Obtener Todos los Usuarios
```http
GET /api/users
Authorization: Bearer {token}
```

#### Obtener Usuario por ID
```http
GET /api/users/:id
Authorization: Bearer {token}
```

#### Crear Usuario
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "María García",
  "email": "maria@example.com",
  "password": "123456",
  "rol": "usuario"
}
```

#### Actualizar Usuario
```http
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "María García Actualizado",
  "email": "maria.nueva@example.com",
  "rol": "admin",
  "activo": true
}
```

#### Eliminar Usuario
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

## 🔐 Roles y Permisos

- **usuario**: Rol predeterminado, acceso limitado
- **admin**: Acceso completo a todos los endpoints de gestión de usuarios

## 🛡️ Seguridad

- Contraseñas encriptadas con bcryptjs
- Tokens JWT con expiración configurable
- Middleware de autenticación y autorización
- Validación de datos de entrada
- Protección contra usuarios inactivos

## 📦 Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **jsonwebtoken**: Generación y verificación de JWT
- **bcryptjs**: Encriptación de contraseñas
- **dotenv**: Gestión de variables de entorno
- **cors**: Configuración de CORS
- **express-validator**: Validación de datos

## 🚀 Próximos Pasos

Para extender esta API, considera agregar:
- Recuperación de contraseña
- Refresh tokens
- Rate limiting
- Logging con Winston o Morgan
- Tests unitarios y de integración
- Documentación con Swagger
- Validación más robusta con express-validator

## 📝 Notas

- Cambiar `JWT_SECRET` en producción por una clave segura
- Configurar CORS según tus necesidades
- Revisar las variables de entorno antes de desplegar

---

¡Listo para desarrollar! 🎉
