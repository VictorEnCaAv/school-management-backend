const { Calificacion, Alumno, Materia, Usuario } = require('../models');
const { asyncHandler } = require('../middlewares/errorHandler');
const { sequelize } = require('../models');

/**
 * Obtener alumnos asignados al maestro autenticado
 * Retorna los alumnos que tienen calificaciones registradas por este maestro
 */
const obtenerAlumnosAsignados = asyncHandler(async (req, res) => {
  const maestroId = req.usuario.id;
  const { grupo } = req.query;

  // Construir filtro
  const whereAlumno = {};
  if (grupo) {
    whereAlumno.grupo = grupo;
  }

  // Obtener IDs únicos de alumnos que tienen calificaciones de este maestro
  const calificaciones = await Calificacion.findAll({
    where: {
      maestro_id: maestroId,
      deleted_at: null
    },
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('alumno_id')), 'alumno_id']],
    raw: true
  });

  const alumnoIds = calificaciones.map(c => c.alumno_id);

  // Obtener información completa de los alumnos
  const alumnos = await Alumno.findAll({
    where: {
      id: alumnoIds,
      ...whereAlumno
    },
    order: [['nombre', 'ASC']]
  });

  res.json({
    success: true,
    data: alumnos,
    message: `${alumnos.length} alumno(s) encontrado(s)`
  });
});

/**
 * Obtener calificaciones del maestro autenticado
 */
const obtenerMisCalificaciones = asyncHandler(async (req, res) => {
  const maestroId = req.usuario.id;
  const { materia_id, alumno_id, grupo } = req.query;

  // Construir filtros
  const whereCalificacion = {
    maestro_id: maestroId,
    deleted_at: null
  };

  if (materia_id) {
    whereCalificacion.materia_id = materia_id;
  }

  if (alumno_id) {
    whereCalificacion.alumno_id = alumno_id;
  }

  const whereAlumno = {};
  if (grupo) {
    whereAlumno.grupo = grupo;
  }

  const calificaciones = await Calificacion.findAll({
    where: whereCalificacion,
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'nombre', 'matricula', 'grupo'],
        where: whereAlumno
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'codigo']
      }
    ],
    order: [['fecha_registro', 'DESC']]
  });

  res.json({
    success: true,
    data: calificaciones,
    message: `${calificaciones.length} calificación(es) encontrada(s)`
  });
});

/**
 * Crear o actualizar calificación
 * Si ya existe una calificación del mismo maestro para el mismo alumno y materia, la actualiza
 * Si no existe, crea una nueva
 */
const crearOActualizarCalificacion = asyncHandler(async (req, res) => {
  const { alumno_id, materia_id, nota, observaciones } = req.body;
  const maestroId = req.usuario.id;

  // Verificar que el alumno existe
  const alumno = await Alumno.findByPk(alumno_id);
  if (!alumno) {
    return res.status(404).json({
      success: false,
      message: 'Alumno no encontrado'
    });
  }

  // Verificar que la materia existe
  const materia = await Materia.findByPk(materia_id);
  if (!materia) {
    return res.status(404).json({
      success: false,
      message: 'Materia no encontrada'
    });
  }

  // Buscar si ya existe una calificación de este maestro para este alumno y materia
  const calificacionExistente = await Calificacion.findOne({
    where: {
      alumno_id,
      materia_id,
      maestro_id: maestroId,
      deleted_at: null
    }
  });

  let calificacion;
  let mensaje;

  if (calificacionExistente) {
    // Actualizar calificación existente
    await calificacionExistente.update({
      nota,
      observaciones: observaciones || calificacionExistente.observaciones,
      fecha_registro: new Date()
    });
    calificacion = calificacionExistente;
    mensaje = 'Calificación actualizada exitosamente';
  } else {
    // Crear nueva calificación
    calificacion = await Calificacion.create({
      alumno_id,
      materia_id,
      maestro_id: maestroId,
      nota,
      observaciones,
      fecha_registro: new Date()
    });
    mensaje = 'Calificación creada exitosamente';
  }

  // Obtener calificación completa con relaciones
  const calificacionCompleta = await Calificacion.findByPk(calificacion.id, {
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'nombre', 'matricula', 'grupo']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'codigo']
      }
    ]
  });

  res.status(calificacionExistente ? 200 : 201).json({
    success: true,
    message: mensaje,
    data: calificacionCompleta
  });
});

module.exports = {
  obtenerAlumnosAsignados,
  obtenerMisCalificaciones,
  crearOActualizarCalificacion
};