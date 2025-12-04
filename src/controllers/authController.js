const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { Usuario, Maestro } = require('../models');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * Login de usuario
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  const usuario = await Usuario.findOne({
    where: { email },
    include: [{
      model: Maestro,
      as: 'maestro',
      attributes: ['id', 'nombre', 'apellido_paterno', 'apellido_materno']
    }]
  });

  if (!usuario) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  // Verificar contraseña
  const passwordValido = await usuario.compararPassword(password);
  
  if (!passwordValido) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  // Verificar si está activo
  if (!usuario.activo) {
    return res.status(403).json({
      success: false,
      message: 'Usuario inactivo'
    });
  }

  // Generar token
  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    }
  );

  // Preparar respuesta
  const usuarioData = usuario.toJSON();
  
  res.json({
    success: true,
    message: 'Login exitoso',
    data: {
      token,
      usuario: usuarioData
    }
  });
});

/**
 * Obtener perfil del usuario autenticado
 */
const perfil = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findByPk(req.usuario.id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: Maestro,
      as: 'maestro',
      attributes: ['id', 'nombre', 'apellido_paterno', 'apellido_materno', 'especialidad']
    }]
  });

  res.json({
    success: true,
    data: usuario
  });
});

/**
 * Refrescar token
 */
const refrescarToken = asyncHandler(async (req, res) => {
  const usuario = req.usuario;

  const nuevoToken = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    }
  );

  res.json({
    success: true,
    message: 'Token refrescado',
    data: {
      token: nuevoToken
    }
  });
});

module.exports = {
  login,
  perfil,
  refrescarToken
};