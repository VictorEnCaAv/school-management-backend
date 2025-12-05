const { Calificacion, Alumno, Materia, Usuario } = require('../models');
const { asyncHandler } = require('../middlewares/errorHandler');
const { sequelize } = require('../models');

/**
 * Obtener reporte global de promedios
 * Puede filtrar por alumno_id, materia_id o grupo
 */
const obtenerReportePromedios = asyncHandler(async (req, res) => {
  const { alumno_id, materia_id, grupo } = req.query;

  // Si se especifica alumno_id, retornar reporte por alumno
  if (alumno_id) {
    return await reportePorAlumno(req, res, alumno_id);
  }

  // Si se especifica materia_id, retornar reporte por materia
  if (materia_id) {
    return await reportePorMateria(req, res, materia_id);
  }

  // Reporte general
  return await reporteGeneral(req, res, grupo);
});

/**
 * Reporte por alumno específico
 */
const reportePorAlumno = async (req, res, alumno_id) => {
  const alumno = await Alumno.findByPk(alumno_id);
  
  if (!alumno) {
    return res.status(404).json({
      success: false,
      message: 'Alumno no encontrado'
    });
  }

  const calificaciones = await Calificacion.findAll({
    where: {
      alumno_id,
      deleted_at: null
    },
    include: [
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
    ],
    order: [['fecha_registro', 'DESC']]
  });

  // Calcular promedio
  const promedio = calificaciones.length > 0
    ? (calificaciones.reduce((sum, cal) => sum + parseFloat(cal.nota), 0) / calificaciones.length).toFixed(2)
    : 0;

  res.json({
    success: true,
    data: {
      alumno,
      promedio_general: promedio,
      total_calificaciones: calificaciones.length,
      calificaciones
    }
  });
};

/**
 * Reporte por materia específica
 */
const reportePorMateria = async (req, res, materia_id) => {
  const materia = await Materia.findByPk(materia_id);
  
  if (!materia) {
    return res.status(404).json({
      success: false,
      message: 'Materia no encontrada'
    });
  }

  const calificaciones = await Calificacion.findAll({
    where: {
      materia_id,
      deleted_at: null
    },
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'nombre', 'matricula', 'grupo']
      },
      {
        model: Usuario,
        as: 'maestro',
        attributes: ['id', 'nombre']
      }
    ]
  });

  // Calcular estadísticas
  const notas = calificaciones.map(c => parseFloat(c.nota));
  const promedio = notas.length > 0
    ? (notas.reduce((sum, nota) => sum + nota, 0) / notas.length).toFixed(2)
    : 0;
  const notaMaxima = notas.length > 0 ? Math.max(...notas).toFixed(2) : 0;
  const notaMinima = notas.length > 0 ? Math.min(...notas).toFixed(2) : 0;
  const aprobados = notas.filter(nota => nota >= 60).length;
  const reprobados = notas.length - aprobados;

  res.json({
    success: true,
    data: {
      materia,
      estadisticas: {
        promedio,
        nota_maxima: notaMaxima,
        nota_minima: notaMinima,
        total_alumnos: calificaciones.length,
        aprobados,
        reprobados,
        porcentaje_aprobacion: calificaciones.length > 0 
          ? ((aprobados / calificaciones.length) * 100).toFixed(2) 
          : 0
      },
      calificaciones
    }
  });
};

/**
 * Reporte general del sistema
 */
const reporteGeneral = async (req, res, grupo = null) => {
  // Filtro de grupo si se proporciona
  const whereAlumno = grupo ? { grupo } : {};

  // Obtener todas las calificaciones no eliminadas
  const calificaciones = await Calificacion.findAll({
    where: { deleted_at: null },
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
    ]
  });

  // Calcular promedio general
  const promedioGeneral = calificaciones.length > 0
    ? (calificaciones.reduce((sum, cal) => sum + parseFloat(cal.nota), 0) / calificaciones.length).toFixed(2)
    : 0;

  // Promedios por alumno
  const promediosPorAlumno = {};
  calificaciones.forEach(cal => {
    const alumnoId = cal.alumno.id;
    if (!promediosPorAlumno[alumnoId]) {
      promediosPorAlumno[alumnoId] = {
        alumno: cal.alumno,
        notas: [],
        total: 0
      };
    }
    promediosPorAlumno[alumnoId].notas.push(parseFloat(cal.nota));
  });

  const promediosAlumnos = Object.values(promediosPorAlumno).map(data => ({
    alumno: data.alumno,
    promedio: (data.notas.reduce((sum, nota) => sum + nota, 0) / data.notas.length).toFixed(2),
    total_materias: data.notas.length
  }));

  // Promedios por materia
  const promediosPorMateria = {};
  calificaciones.forEach(cal => {
    const materiaId = cal.materia.id;
    if (!promediosPorMateria[materiaId]) {
      promediosPorMateria[materiaId] = {
        materia: cal.materia,
        notas: [],
        alumnos: new Set()
      };
    }
    promediosPorMateria[materiaId].notas.push(parseFloat(cal.nota));
    promediosPorMateria[materiaId].alumnos.add(cal.alumno.id);
  });

  const promediosMaterias = Object.values(promediosPorMateria).map(data => ({
    materia: data.materia,
    promedio: (data.notas.reduce((sum, nota) => sum + nota, 0) / data.notas.length).toFixed(2),
    total_alumnos: data.alumnos.size
  }));

  res.json({
    success: true,
    data: {
      promedio_general: promedioGeneral,
      total_calificaciones: calificaciones.length,
      promedios_por_alumno: promediosAlumnos,
      promedios_por_materia: promediosMaterias,
      filtros: grupo ? { grupo } : null
    }
  });
};

/**
 * Eliminar calificación (soft delete)
 * Solo Control Escolar puede eliminar cualquier calificación
 */
const eliminarCalificacion = asyncHandler(async (req, res) => {
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
        attributes: ['nombre']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['nombre']
      }
    ]
  });

  if (!calificacion) {
    return res.status(404).json({
      success: false,
      message: 'Calificación no encontrada o ya ha sido eliminada'
    });
  }

  // Soft delete
  await calificacion.update({
    deleted_at: new Date()
  });

  res.json({
    success: true,
    message: 'Calificación eliminada exitosamente',
    data: {
      id: calificacion.id,
      alumno: calificacion.alumno.nombre,
      materia: calificacion.materia.nombre,
      nota: calificacion.nota
    }
  });
});

module.exports = {
  obtenerReportePromedios,
  eliminarCalificacion
};