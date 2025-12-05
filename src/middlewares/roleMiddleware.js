/**
 * Middleware para verificar roles de usuario
 * @param {...string} roles - Roles permitidos
 */
const verificarRol = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Middleware específico para admin
 */
const esAdmin = verificarRol('admin');

/**
 * Middleware específico para maestro
 */
const esMaestro = verificarRol('maestro');

/**
 * Middleware para admin o maestro
 */
const esAdminOMaestro = verificarRol('admin', 'maestro');

module.exports = {
  verificarRol,
  esAdmin,
  esMaestro,
  esAdminOMaestro
};