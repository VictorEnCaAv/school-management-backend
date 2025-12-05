const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const calificacionRoutes = require('./calificacionRoutes');

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/calificaciones', calificacionRoutes);

// Ruta raíz
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Sistema de Gestión Escolar',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      calificaciones: '/api/calificaciones'
    }
  });
});

module.exports = router;