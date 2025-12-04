const { Calificacion, Alumno, Materia, Maestro } = require('../models');
const { asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

/**
 * Obtener todas las calificaciones (con filtros)
 */
const obtenerCalificaciones = asyncHandler(async (req, res) => {
  const {
    materia_id,
    alumno_id,
    periodo,
    ciclo_escolar,
    page = 1,
    limit = 50
  } = req.query;

  const usuario = req.usuario;
  const offset = (page - 1) * limit;

  // Construir filtros
  const where = {};
  
  if (materia_id) where.materia_id = materia_id;
  if (alumno_id) where.alumno_id = alumno_id;
  if (periodo) where.periodo = periodo;
  if (ciclo_escolar) where.ciclo_escolar = ciclo_escolar;

  // Si es maestro, filtrar solo sus materias
  let materiaWhere = {};
  if (usuario.rol === 'maestro') {
    const maestro = await Maestro.findOne({ where: { usuario_id: usuario.id } });
    if (maestro) {
      materiaWhere.maestro_id = maestro.id;
    }
  }

  const { count, rows: calificaciones } = await Calificacion.findAndCountAll({
    where,
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre', 'apellido_paterno', 'apellido_materno', 'grado', 'grupo']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'clave', 'grado', 'creditos'],
        where: materiaWhere
      }
    ],
    limit: parseInt(limit),
    offset,
    order: [['created_at', 'DESC']]
  });

  res.json({
    success: true,
    data: {
      calificaciones,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    }
  });
});

/**
 * Obtener una calificación por ID
 */
const obtenerCalificacionPorId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const calificacion = await Calificacion.findByPk(id, {
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre', 'apellido_paterno', 'apellido_materno']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'clave']
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
  const { alumno_id, materia_id, periodo, calificacion, observaciones, ciclo_escolar } = req.body;
  const usuario = req.usuario;

  // Verificar que la materia exista
  const materia = await Materia.findByPk(materia_id);
  if (!materia) {
    return res.status(404).json({
      success: false,
      message: 'Materia no encontrada'
    });
  }

  // Si es maestro, verificar que sea su materia
  if (usuario.rol === 'maestro') {
    const maestro = await Maestro.findOne({ where: { usuario_id: usuario.id } });
    if (maestro && materia.maestro_id !== maestro.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para calificar esta materia'
      });
    }
  }

  // Verificar que el alumno exista
  const alumno = await Alumno.findByPk(alumno_id);
  if (!alumno) {
    return res.status(404).json({
      success: false,
      message: 'Alumno no encontrado'
    });
  }

  // Crear calificación
  const nuevaCalificacion = await Calificacion.create({
    alumno_id,
    materia_id,
    periodo,
    calificacion,
    observaciones,
    ciclo_escolar: ciclo_escolar || '2024-2025'
  });

  // Obtener calificación con relaciones
  const calificacionCompleta = await Calificacion.findByPk(nuevaCalificacion.id, {
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre', 'apellido_paterno', 'apellido_materno']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'clave']
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
  const { calificacion, observaciones, periodo } = req.body;
  const usuario = req.usuario;

  // Buscar calificación
  const calificacionExistente = await Calificacion.findByPk(id, {
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

  // Si es maestro, verificar que sea su materia
  if (usuario.rol === 'maestro') {
    const maestro = await Maestro.findOne({ where: { usuario_id: usuario.id } });
    if (maestro && calificacionExistente.materia.maestro_id !== maestro.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar esta calificación'
      });
    }
  }

  // Actualizar
  await calificacionExistente.update({
    calificacion: calificacion || calificacionExistente.calificacion,
    observaciones: observaciones !== undefined ? observaciones : calificacionExistente.observaciones,
    periodo: periodo || calificacionExistente.periodo
  });

  // Obtener calificación actualizada con relaciones
  const calificacionActualizada = await Calificacion.findByPk(id, {
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre', 'apellido_paterno', 'apellido_materno']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'clave']
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
 * Eliminar calificación
 */
const eliminarCalificacion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usuario = req.usuario;

  const calificacion = await Calificacion.findByPk(id, {
    include: [{
      model: Materia,
      as: 'materia'
    }]
  });

  if (!calificacion) {
    return res.status(404).json({
      success: false,
      message: 'Calificación no encontrada'
    });
  }

  // Si es maestro, verificar que sea su materia
  if (usuario.rol === 'maestro') {
    const maestro = await Maestro.findOne({ where: { usuario_id: usuario.id } });
    if (maestro && calificacion.materia.maestro_id !== maestro.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta calificación'
      });
    }
  }

  await calificacion.destroy();

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