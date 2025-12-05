const { Calificacion, Alumno, Materia, Usuario } = require('../models');
const { asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

/**
 * Obtener todas las calificaciones (con filtros)
 */
const obtenerCalificaciones = asyncHandler(async (req, res) => {
  const {
    materia_id,
    alumno_id,
    page = 1,
    limit = 50
  } = req.query;

  const usuario = req.usuario;
  const offset = (page - 1) * limit;

  // Construir filtros
  const where = {
    deleted_at: null // Solo calificaciones no eliminadas
  };
  
  if (materia_id) where.materia_id = materia_id;
  if (alumno_id) where.alumno_id = alumno_id;

  // Si es maestro, filtrar solo sus calificaciones
  if (usuario.rol === 'MAESTRO') {
    where.maestro_id = usuario.id;
  }

  const { count, rows: calificaciones } = await Calificacion.findAndCountAll({
    where,
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre', 'grupo']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'codigo']
      },
      {
        model: Usuario,
        as: 'maestro',
        attributes: ['id', 'nombre', 'email']
      }
    ],
    limit: parseInt(limit),
    offset,
    order: [['created_at', 'DESC']]
  });

  res.json({
    success: true,
    data: calificaciones,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  });
});

/**
 * Obtener una calificación por ID
 */
const obtenerCalificacionPorId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const calificacion = await Calificacion.findOne({
    where: {
      id,
      deleted_at: null
    },
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'codigo']
      },
      {
        model: Usuario,
        as: 'maestro',
        attributes: ['id', 'nombre']
      }
    ]
  });

  if (!calificacion) {
    return res.status(404).json({
      success: false,
      message: 'Calificación no encontrada'
    });
  }

  res.json({
    success: true,
    data: calificacion
  });
});

/**
 * Crear nueva calificación
 */
const crearCalificacion = asyncHandler(async (req, res) => {
  const { alumno_id, materia_id, nota, observaciones } = req.body;
  const usuario = req.usuario;

  // Verificar que la materia exista
  const materia = await Materia.findByPk(materia_id);
  if (!materia) {
    return res.status(404).json({
      success: false,
      message: 'Materia no encontrada'
    });
  }

  // Verificar que el alumno exista
  const alumno = await Alumno.findByPk(alumno_id);
  if (!alumno) {
    return res.status(404).json({
      success: false,
      message: 'Alumno no encontrado'
    });
  }

  // Crear calificación (el maestro_id es el usuario autenticado)
  const nuevaCalificacion = await Calificacion.create({
    alumno_id,
    materia_id,
    maestro_id: usuario.id,
    nota,
    observaciones,
    fecha_registro: new Date()
  });

  // Obtener calificación con relaciones
  const calificacionCompleta = await Calificacion.findByPk(nuevaCalificacion.id, {
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'codigo']
      }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Calificación creada exitosamente',
    data: calificacionCompleta
  });
});

/**
 * Actualizar calificación
 */
const actualizarCalificacion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nota, observaciones } = req.body;
  const usuario = req.usuario;

  // Buscar calificación
  const calificacionExistente = await Calificacion.findOne({
    where: {
      id,
      deleted_at: null
    },
    include: [{
      model: Materia,
      as: 'materia'
    }]
  });

  if (!calificacionExistente) {
    return res.status(404).json({
      success: false,
      message: 'Calificación no encontrada'
    });
  }

  // Si es maestro, verificar que sea su calificación
  if (usuario.rol === 'MAESTRO' && calificacionExistente.maestro_id !== usuario.id) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permiso para modificar esta calificación'
    });
  }

  // Actualizar
  await calificacionExistente.update({
    nota: nota !== undefined ? nota : calificacionExistente.nota,
    observaciones: observaciones !== undefined ? observaciones : calificacionExistente.observaciones
  });

  // Obtener calificación actualizada con relaciones
  const calificacionActualizada = await Calificacion.findByPk(id, {
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'codigo']
      }
    ]
  });

  res.json({
    success: true,
    message: 'Calificación actualizada exitosamente',
    data: calificacionActualizada
  });
});

/**
 * Eliminar calificación (soft delete)
 */
const eliminarCalificacion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usuario = req.usuario;

  const calificacion = await Calificacion.findOne({
    where: {
      id,
      deleted_at: null
    }
  });

  if (!calificacion) {
    return res.status(404).json({
      success: false,
      message: 'Calificación no encontrada'
    });
  }

  // Si es maestro, verificar que sea su calificación
  if (usuario.rol === 'MAESTRO' && calificacion.maestro_id !== usuario.id) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permiso para eliminar esta calificación'
    });
  }

  // Soft delete
  await calificacion.update({
    deleted_at: new Date()
  });

  res.json({
    success: true,
    message: 'Calificación eliminada exitosamente'
  });
});

module.exports = {
  obtenerCalificaciones,
  obtenerCalificacionPorId,
  crearCalificacion,
  actualizarCalificacion,
  eliminarCalificacion
};