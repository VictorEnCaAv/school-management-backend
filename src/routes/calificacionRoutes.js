const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  obtenerCalificaciones,
  obtenerCalificacionPorId,
  crearCalificacion,
  actualizarCalificacion,
  eliminarCalificacion
} = require('../controllers/calificacionController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { esAdminOMaestro } = require('../middlewares/roleMiddleware');
const { validarCampos } = require('../middlewares/validationMiddleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);
router.use(esAdminOMaestro);

/**
 * @route   GET /api/calificaciones
 * @desc    Obtener todas las calificaciones (con filtros)
 * @access  Private (Admin, Maestro)
 */
router.get('/', obtenerCalificaciones);

/**
 * @route   GET /api/calificaciones/:id
 * @desc    Obtener una calificación por ID
 * @access  Private (Admin, Maestro)
 */
router.get('/:id', obtenerCalificacionPorId);

/**
 * @route   POST /api/calificaciones
 * @desc    Crear nueva calificación
 * @access  Private (Admin, Maestro)
 */
router.post('/', [
  body('alumno_id')
    .isInt({ min: 1 })
    .withMessage('El ID del alumno debe ser un número válido'),
  body('materia_id')
    .isInt({ min: 1 })
    .withMessage('El ID de la materia debe ser un número válido'),
  body('periodo')
    .isIn(['1', '2', '3', 'extraordinario', 'final'])
    .withMessage('El periodo debe ser: 1, 2, 3, extraordinario o final'),
  body('calificacion')
    .isFloat({ min: 0, max: 100 })
    .withMessage('La calificación debe estar entre 0 y 100'),
  body('ciclo_escolar')
    .optional()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage('El ciclo escolar debe tener el formato YYYY-YYYY'),
  validarCampos
], crearCalificacion);

/**
 * @route   PUT /api/calificaciones/:id
 * @desc    Actualizar calificación
 * @access  Private (Admin, Maestro)
 */
router.put('/:id', [
  body('calificacion')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('La calificación debe estar entre 0 y 100'),
  body('periodo')
    .optional()
    .isIn(['1', '2', '3', 'extraordinario', 'final'])
    .withMessage('El periodo debe ser: 1, 2, 3, extraordinario o final'),
  validarCampos
], actualizarCalificacion);

/**
 * @route   DELETE /api/calificaciones/:id
 * @desc    Eliminar calificación
 * @access  Private (Admin, Maestro)
 */
router.delete('/:id', eliminarCalificacion);

module.exports = router;