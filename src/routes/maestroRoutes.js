// src/routes/maestroRoutes.js
const express = require('express');
const router = express.Router();
const maestroController = require('../controllers/maestroController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

// Todas las rutas requieren autenticación y rol MAESTRO
router.use(authMiddleware);
router.use(roleMiddleware(['MAESTRO']));

// GET /api/maestro/asignaciones - Obtener mis asignaciones (materias y grupos)
router.get('/asignaciones', maestroController.obtenerMisAsignaciones);

// GET /api/maestro/asignaciones/:asignacion_id/alumnos - Obtener alumnos de una asignación
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
    validationMiddleware
  ],
  maestroController.registrarCalificacion
);

// PUT /api/maestro/calificaciones/:id - Actualizar calificación
router.put('/calificaciones/:id',
  [
    body('nota').isFloat({ min: 0, max: 100 }).withMessage('Nota debe estar entre 0 y 100'),
    validationMiddleware
  ],
  maestroController.actualizarCalificacion
);

module.exports = router;
