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
        message: `No tienes permisos para acceder a este recurso. Se requiere rol: ${roles.join(' o ')}`
      });
    }

    next();
  };
};

/**
 * Middleware específico para Control Escolar (Admin)
 */
const esAdmin = verificarRol('CONTROL_ESCOLAR');

/**
 * Middleware específico para maestro
 */
const esMaestro = verificarRol('MAESTRO');

/**
 * Middleware para admin o maestro
 */
const esAdminOMaestro = verificarRol('CONTROL_ESCOLAR', 'MAESTRO');

module.exports = {
  verificarRol,
  esAdmin,
  esMaestro,
  esAdminOMaestro
};