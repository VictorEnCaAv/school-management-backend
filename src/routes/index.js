const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const maestroRoutes = require('./maestroRoutes');
const controlescolarRoutes = require('./controlescolarRoutes');

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas por rol
router.use('/maestro', maestroRoutes);
router.use('/controlescolar', controlescolarRoutes);

// Ruta de información de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Sistema de Gestión Escolar',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      maestro: '/api/maestro',
      controlescolar: '/api/controlescolar'
    },
    documentation: 'Ver README.md para más detalles'
  });
});

module.exports = router;