const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  obtenerAlumnosAsignados,
  crearOActualizarCalificacion,
  obtenerMisCalificaciones
} = require('../controllers/maestroController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { esMaestro } = require('../middlewares/roleMiddleware');
const { validarCampos } = require('../middlewares/validationMiddleware');

// Todas las rutas requieren autenticación y rol de MAESTRO
router.use(verificarToken);
router.use(esMaestro);

/**
 * @route   GET /api/maestro/alumnos
 * @desc    Obtener alumnos asignados al maestro autenticado
 * @access  Private (Maestro)
 */
router.get('/alumnos', obtenerAlumnosAsignados);

/**
 * @route   GET /api/maestro/calificaciones
 * @desc    Obtener calificaciones del maestro autenticado
 * @access  Private (Maestro)
 */
router.get('/calificaciones', obtenerMisCalificaciones);

/**
 * @route   POST /api/maestro/calificaciones
 * @desc    Crear o actualizar calificación
 * @access  Private (Maestro)
 */
router.post('/calificaciones', [
  body('alumno_id')
    .isInt({ min: 1 })
    .withMessage('El ID del alumno debe ser un número válido'),
  body('materia_id')
    .isInt({ min: 1 })
    .withMessage('El ID de la materia debe ser un número válido'),
  body('nota')
    .isFloat({ min: 0, max: 100 })
    .withMessage('La nota debe estar entre 0 y 100'),
  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser texto'),
  validarCampos
], crearOActualizarCalificacion);

module.exports = router;