const express = require('express');
const router = express.Router();
const {
  obtenerReportePromedios,
  eliminarCalificacion
} = require('../controllers/controlescolarController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { esAdmin } = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación y rol de CONTROL_ESCOLAR
router.use(verificarToken);
router.use(esAdmin);

/**
 * @route   GET /api/controlescolar/reporte
 * @desc    Obtener reporte global de promedios
 * @access  Private (Control Escolar)
 * @query   alumno_id - Filtrar por alumno específico
 * @query   materia_id - Filtrar por materia específica
 * @query   grupo - Filtrar por grupo
 */
router.get('/reporte', obtenerReportePromedios);

/**
 * @route   DELETE /api/controlescolar/calificaciones/:id
 * @desc    Eliminar calificación (soft delete)
 * @access  Private (Control Escolar)
 */
router.delete('/calificaciones/:id', eliminarCalificacion);

module.exports = router;