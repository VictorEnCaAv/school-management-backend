# 🎓 Sistema de Gestión Escolar - Backend API

API REST para el sistema de gestión y reporte de calificaciones escolares. Permite a maestros registrar calificaciones y al área de Control Escolar supervisar y generar reportes completos.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37-orange)](https://sequelize.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ **Arquitectura MVC** bien estructurada
- ✅ **Autenticación JWT** con roles (MAESTRO/CONTROL_ESCOLAR)
- ✅ **Rate Limiting** para prevenir abuso
- ✅ **Validación robusta** con express-validator
- ✅ **Soft Delete** en calificaciones
- ✅ **Migraciones y Seeders** automatizados
- ✅ **Manejo centralizado de errores**
- ✅ **Documentación completa** de endpoints
- ✅ **Docker** ready

---

## 🚀 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime |
| Express.js | 4.18 | Framework web |
| PostgreSQL | 15 | Base de datos |
| Sequelize | 6.37 | ORM |
| JWT | 9.0 | Autenticación |
| Bcryptjs | 2.4 | Encriptación |
| Helmet | 7.0 | Seguridad HTTP |
| Express Rate Limit | 7.1 | Rate limiting |
| Morgan | 1.10 | Logging |

---

## 📦 Requisitos Previos

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **PostgreSQL** >= 13 ([Descargar](https://www.postgresql.org/download/))
- **npm** >= 9.0.0 (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))

---

## 🔧 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/school_management_backend.git
cd school_management_backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Entorno
NODE_ENV=development

# Servidor
PORT=3000
API_PREFIX=/api

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_management
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_DIALECT=postgres

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### 4. Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE school_management;

# Salir
\q
```

### 5. Ejecutar Migraciones

```bash
npm run db:migrate
```

**Salida esperada:**
```
== 20240101000001-create-usuarios: migrating =======
== 20240101000001-create-usuarios: migrated (0.045s)
== 20240101000002-create-alumnos: migrating =======
== 20240101000002-create-alumnos: migrated (0.032s)
== 20240101000003-create-materias: migrating =======
== 20240101000003-create-materias: migrated (0.028s)
== 20240101000004-create-calificaciones: migrating =======
== 20240101000004-create-calificaciones: migrated (0.051s)
```

### 6. Ejecutar Seeders (Datos de Prueba)

```bash
npm run db:seed
```

**Datos creados:**
- 1 usuario Control Escolar (admin)
- 3 usuarios Maestros
- 10 Alumnos
- 8 Materias
- 13 Calificaciones de ejemplo

### 7. Iniciar Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

**Servidor corriendo en:** `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Ejemplo | Requerida |
|----------|-------------|---------|-----------|
| `NODE_ENV` | Entorno de ejecución | `development` | ❌ |
| `PORT` | Puerto del servidor | `3000` | ❌ |
| `DB_HOST` | Host de PostgreSQL | `localhost` | ✅ |
| `DB_PORT` | Puerto de PostgreSQL | `5432` | ❌ |
| `DB_NAME` | Nombre de la base de datos | `school_management` | ✅ |
| `DB_USER` | Usuario de PostgreSQL | `postgres` | ✅ |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `password123` | ✅ |
| `JWT_SECRET` | Secreto para JWT | `secret_key` | ✅ |
| `JWT_EXPIRES_IN` | Expiración del token | `24h` | ❌ |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:5173` | ❌ |

### Comandos Útiles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Migraciones
npm run db:migrate              # Ejecutar todas las migraciones
npm run db:migrate:undo         # Revertir última migración
npm run db:migrate:undo:all     # Revertir todas las migraciones

# Seeders
npm run db:seed                 # Ejecutar todos los seeders
npm run db:seed:undo:all        # Revertir todos los seeders

# Reset completo
npm run db:reset                # Revertir todo, migrar y seed

# Linting
npm run lint                    # Verificar código
npm run lint:fix                # Corregir automáticamente

# Formateo
npm run format                  # Formatear código con Prettier

# Testing
npm test                        # Ejecutar tests
```

---

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Autenticación

#### `POST /api/auth/login`
Iniciar sesión

**Body:**
```json
{
  "email": "admin@school.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "usuario": {
      "id": 1,
      "nombre": "Administrador del Sistema",
      "email": "admin@school.com",
      "rol": "CONTROL_ESCOLAR"
    }
  }
}
```

#### `GET /api/auth/perfil`
Obtener perfil del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

#### `POST /api/auth/refresh`
Refrescar token JWT

---

### Maestro

#### `GET /api/maestro/alumnos`
Obtener alumnos asignados

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `grupo` (opcional): Filtrar por grupo

#### `GET /api/maestro/calificaciones`
Obtener calificaciones del maestro

**Query Params:**
- `materia_id` (opcional)
- `alumno_id` (opcional)
- `grupo` (opcional)

#### `POST /api/maestro/calificaciones`
Crear o actualizar calificación

**Body:**
```json
{
  "alumno_id": 1,
  "materia_id": 1,
  "nota": 85.5,
  "observaciones": "Buen desempeño"
}
```

---

### Control Escolar

#### `GET /api/controlescolar/reporte`
Obtener reportes de promedios

**Query Params:**
- `alumno_id`: Reporte por alumno
- `materia_id`: Reporte por materia
- `grupo`: Reporte por grupo
- Sin parámetros: Reporte general

#### `DELETE /api/controlescolar/calificaciones/:id`
Eliminar calificación (soft delete)

---

### Otros

#### `GET /health`
Health check del servidor

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-04T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

---

## 🐳 Docker

### Ejecutar con Docker Compose

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Limpiar todo (incluyendo volúmenes)
docker-compose down -v
```

### Dockerfile

El proyecto incluye un `Dockerfile` optimizado:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm start"]
```

---

## 🔐 Credenciales de Prueba

Después de ejecutar los seeders:

### Control Escolar (Admin)
- **Email:** `admin@school.com`
- **Password:** `admin123`

### Maestros
- **Maestro 1:** `maestro1@school.com` / `maestro123`
- **Maestro 2:** `maestro2@school.com` / `maestro123`
- **Maestro 3:** `maestro3@school.com` / `maestro123`

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Con cobertura
npm run test:coverage
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Causa:** PostgreSQL no está corriendo o credenciales incorrectas

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
# Windows
services.msc
# Linux/Mac
sudo systemctl status postgresql

# Verificar conexión
psql -U postgres -d school_management
```

### Error: "Relation does not exist"

**Causa:** Las migraciones no se ejecutaron

**Solución:**
```bash
npm run db:reset
```

### Error: "Port 3000 already in use"

**Causa:** Otro proceso está usando el puerto

**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "JWT malformed"

**Causa:** Token inválido o no proporcionado

**Solución:**
- Verificar que el token esté en el header `Authorization: Bearer {token}`
- Hacer login nuevamente para obtener un token válido

---

## 📁 Estructura del Proyecto

```
src/
├── config/              # Configuraciones
│   ├── database.js     # Config de Sequelize
│   └── jwt.js          # Config de JWT
├── models/             # Modelos de Sequelize
│   ├── index.js
│   ├── Usuario.js
│   ├── Alumno.js
│   ├── Materia.js
│   └── Calificacion.js
├── controllers/        # Lógica de negocio
│   ├── authController.js
│   ├── maestroController.js
│   └── controlescolarController.js
├── routes/            # Definición de endpoints
│   ├── index.js
│   ├── authRoutes.js
│   ├── maestroRoutes.js
│   └── controlescolarRoutes.js
├── middlewares/       # Middlewares
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorHandler.js
│   ├── validationMiddleware.js
│   └── rateLimitMiddleware.js
└── app.js            # Punto de entrada
```

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 🔗 Enlaces

- [Frontend Repository](https://github.com/tu-usuario/school_management_frontend)
- [Documentación de API](docs/API.md)
- [Postman Collection](postman/collection.json)

---

## 👥 Autor

Desarrollado como prueba técnica para NexGen

---

**¿Necesitas ayuda?** Abre un [issue](https://github.com/tu-usuario/school_management_backend/issues) en GitHub.