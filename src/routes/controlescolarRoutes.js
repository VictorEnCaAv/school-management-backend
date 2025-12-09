// src/routes/controlEscolarRoutes.js
const express = require('express');
const router = express.Router();
const controlEscolarController = require('../controllers/controlEscolarController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { esAdmin } = require('../middlewares/roleMiddleware'); // esAdmin verifica CONTROL_ESCOLAR
const { body, param, query } = require('express-validator');
const { validarCampos } = require('../middlewares/validationMiddleware');

// Todas las rutas requieren autenticación y rol CONTROL_ESCOLAR
router.use(verificarToken);
router.use(esAdmin);

// Rutas para gestión de calificaciones

// GET /api/control-escolar/calificaciones - Listar todas las calificaciones (incluye eliminadas)
router.get('/calificaciones', 
  [
    query('pagina').optional().isInt({ min: 1 }).toInt(),
    query('limite').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('asignacion_id').optional().isInt(),
    query('alumno_id').optional().isInt(),
    query('periodo').optional().isString(),
    query('incluirEliminadas').optional().isBoolean(),
    validarCampos
  ],
  controlEscolarController.listarCalificaciones
);

// GET /api/control-escolar/calificaciones/:id - Obtener detalle de calificación
router.get('/calificaciones/:id',
  [
    param('id').isInt().withMessage('ID inválido'),
    validarCampos
  ],
  controlEscolarController.obtenerCalificacion
);

// DELETE /api/control-escolar/calificaciones/:id - Soft delete de calificación
router.delete('/calificaciones/:id',
  [
    param('id').isInt().withMessage('ID inválido'),
    body('motivo').optional().isString().withMessage('Motivo debe ser texto'),
    validarCampos
  ],
  controlEscolarController.eliminarCalificacion
);

// POST /api/control-escolar/calificaciones/:id/restaurar - Restaurar calificación eliminada
router.post('/calificaciones/:id/restaurar',
  [
    param('id').isInt().withMessage('ID inválido'),
    validarCampos
  ],
  controlEscolarController.restaurarCalificacion
);

// Exporta las rutas existentes que ya tengas
module.exports = router;