const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, perfil, refrescarToken } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { validarCampos } = require('../middlewares/validationMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', 
  authLimiter, // Rate limiting para prevenir fuerza bruta
  [
    body('email')
      .isEmail()
      .withMessage('Debe proporcionar un email válido')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    validarCampos
  ], 
  login
);

/**
 * @route   GET /api/auth/perfil
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/perfil', verificarToken, perfil);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refrescar token JWT
 * @access  Private
 */
router.post('/refresh', verificarToken, refrescarToken);

module.exports = router;