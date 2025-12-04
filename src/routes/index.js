const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const calificacionRoutes = require('./calificacionRoutes');
const alumnoRoutes = require('./alumnoRoutes');
const materiaRoutes = require('./materiaRoutes');
const reporteRoutes = require('./reporteRoutes');

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
router.use('/calificaciones', calificacionRoutes);
router.use('/alumnos', alumnoRoutes);
router.use('/materias', materiaRoutes);
router.use('/reportes', reporteRoutes);

// Ruta de información de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Sistema de Gestión Escolar',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      calificaciones: '/api/calificaciones',
      alumnos: '/api/alumnos',
      materias: '/api/materias',
      reportes: '/api/reportes'
    }
  });
});

module.exports = router;