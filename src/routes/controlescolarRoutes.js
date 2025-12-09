// src/routes/controlEscolarRoutes.js
const express = require('express');
const router = express.Router();
const controlEscolarController = require('../controllers/controlEscolarController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

// Todas las rutas requieren CONTROL_ESCOLAR
router.use(authMiddleware);
router.use(roleMiddleware(['CONTROL_ESCOLAR']));

// GET /api/controlescolar/calificaciones - Ver todas las calificaciones
router.get('/calificaciones', controlEscolarController.obtenerTodasLasCalificaciones);

// PUT /api/controlescolar/calificaciones/:id - Modificar calificación
router.put('/calificaciones/:id',
  [
    body('nota').isFloat({ min: 0, max: 100 }).withMessage('Nota debe estar entre 0 y 100'),
    validationMiddleware
  ],
  controlEscolarController.modificarCalificacion
);

// DELETE /api/controlescolar/calificaciones/:id - Eliminar calificación
router.delete('/calificaciones/:id', controlEscolarController.eliminarCalificacion);

// GET /api/controlescolar/reportes - Reporte general
router.get('/reportes', controlEscolarController.obtenerReporteGeneral);

module.exports = router;