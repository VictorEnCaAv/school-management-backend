# 🖥️ School Management API - Backend

API REST para el Sistema de Gestión Escolar construida con Node.js, Express y PostgreSQL.

## 🚀 Tecnologías

- **Node.js** 18+
- **Express.js** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm >= 9.0.0

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd school-management-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Crear base de datos**
```sql
CREATE DATABASE school_management;
```

5. **Ejecutar migraciones**
```bash
npm run db:migrate
```

6. **Ejecutar seeders (datos de prueba)**
```bash
npm run db:seed
```

## 🏃 Ejecutar en desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 🐳 Ejecutar con Docker

```bash
docker-compose up -d
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login
- `GET /api/auth/perfil` - Obtener perfil
- `POST /api/auth/refresh` - Refrescar token

### Calificaciones
- `GET /api/calificaciones` - Listar
- `POST /api/calificaciones` - Crear
- `PUT /api/calificaciones/:id` - Actualizar
- `DELETE /api/calificaciones/:id` - Eliminar

### Reportes
- `GET /api/reportes/grado` - Por grado
- `GET /api/reportes/materia` - Por materia
- `GET /api/reportes/alumno` - Por alumno
- `GET /api/reportes/general` - General

## 🔐 Credenciales de Prueba

**Admin:**
- Email: admin@school.com
- Password: admin123

**Maestro:**
- Email: maestro1@school.com
- Password: maestro123