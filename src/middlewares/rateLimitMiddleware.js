const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para rutas de autenticación
 * Previene ataques de fuerza bruta
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor, intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter general para la API
 * Previene abuso de la API
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP. Por favor, intente nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para creación de recursos
 * Previene spam de creación
 */
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // Máximo 50 creaciones
  message: {
    success: false,
    message: 'Demasiadas operaciones de creación. Por favor, intente nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  apiLimiter,
  createLimiter
};