// src/routes/maestroRoutes.js (CORREGIDO)
const express = require('express');
const router = express.Router();
const maestroController = require('../controllers/maestroController');
const { verificarToken } = require('../middlewares/authMiddleware'); // DESESTRUCTURAR
const { verificarRol } = require('../middlewares/roleMiddleware'); // DESESTRUCTURAR
const { body } = require('express-validator');
const { validarCampos } = require('../middlewares/validationMiddleware'); // DESESTRUCTURAR

// Todas las rutas requieren autenticación y rol MAESTRO
router.use(verificarToken); // USAR LA FUNCIÓN DIRECTAMENTE
router.use(verificarRol('MAESTRO')); // USAR LA FUNCIÓN CON PARÁMETROS

// GET /api/maestro/asignaciones - Obtener mis asignaciones
router.get('/asignaciones', maestroController.obtenerMisAsignaciones);

// GET /api/maestro/asignaciones/:asignacion_id/alumnos
router.get('/asignaciones/:asignacion_id/alumnos', maestroController.obtenerAlumnosPorAsignacion);

// GET /api/maestro/calificaciones - Obtener mis calificaciones
router.get('/calificaciones', maestroController.obtenerMisCalificaciones);

// POST /api/maestro/calificaciones - Registrar calificación
router.post('/calificaciones',
  [
    body('asignacion_id').isInt().withMessage('ID de asignación inválido'),
    body('alumno_id').isInt().withMessage('ID de alumno inválido'),
    body('nota').isFloat({ min: 0, max: 100 }).withMessage('Nota debe estar entre 0 y 100'),
    body('periodo').notEmpty().withMessage('Periodo es requerido'),
    validarCampos // USAR LA FUNCIÓN DIRECTAMENTE
  ],
  maestroController.registrarCalificacion
);

// PUT /api/maestro/calificaciones/:id - Actualizar calificación
router.put('/calificaciones/:id',
  [
    body('nota').isFloat({ min: 0, max: 100 }).withMessage('Nota debe estar entre 0 y 100'),
    validarCampos // USAR LA FUNCIÓN DIRECTAMENTE
  ],
  maestroController.actualizarCalificacion
);

module.exports = router;