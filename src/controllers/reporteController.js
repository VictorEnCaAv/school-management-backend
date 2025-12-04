const { Calificacion, Alumno, Materia, Maestro } = require('../models');
const { asyncHandler } = require('../middlewares/errorHandler');
const { sequelize } = require('../models');

/**
 * Reporte general de calificaciones por grado
 */
const reportePorGrado = asyncHandler(async (req, res) => {
  const { grado, ciclo_escolar = '2024-2025' } = req.query;

  if (!grado) {
    return res.status(400).json({
      success: false,
      message: 'El grado es requerido'
    });
  }

  const calificaciones = await Calificacion.findAll({
    where: { ciclo_escolar },
    include: [
      {
        model: Alumno,
        as: 'alumno',
        where: { grado: parseInt(grado) },
        attributes: ['id', 'matricula', 'nombre', 'apellido_paterno', 'apellido_materno', 'grupo']
      },
      {
        model: Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'clave'],
        include: [{
          model: Maestro,
          as: 'maestro',
          attributes: ['id', 'nombre', 'apellido_paterno']
        }]
      }
    ],
    order: [
      [{ model: Alumno, as: 'alumno' }, 'apellido_paterno', 'ASC'],
      ['periodo', 'ASC']
    ]
  });

  // Agrupar por alumno
  const alumnosMap = {};
  
  calificaciones.forEach(cal => {
    const alumnoId = cal.alumno.id;
    
    if (!alumnosMap[alumnoId]) {
      alumnosMap[alumnoId] = {
        alumno: cal.alumno,
        calificaciones: []
      };
    }
    
    alumnosMap[alumnoId].calificaciones.push({
      id: cal.id,
      materia: cal.materia,
      periodo: cal.periodo,
      calificacion: parseFloat(cal.calificacion),
      observaciones: cal.observaciones
    });
  });

  const resultado = Object.values(alumnosMap);

  res.json({
    success: true,
    data: {
      grado: parseInt(grado),
      ciclo_escolar,
      total_alumnos: resultado.length,
      alumnos: resultado
    }
  });
});

/**
 * Reporte de promedio por materia
 */
const reportePromedioMateria = asyncHandler(async (req, res) => {
  const { materia_id, periodo, ciclo_escolar = '2024-2025' } = req.query;

  if (!materia_id) {
    return res.status(400).json({
      success: false,
      message: 'El ID de materia es requerido'
    });
  }

  const where = {
    materia_id: parseInt(materia_id),
    ciclo_escolar
  };

  if (periodo) {
    where.periodo = periodo;
  }

  const estadisticas = await Calificacion.findAll({
    where,
    attributes: [
      [sequelize.fn('AVG', sequelize.col('calificacion')), 'promedio'],
      [sequelize.fn('MAX', sequelize.col('calificacion')), 'maxima'],
      [sequelize.fn('MIN', sequelize.col('calificacion')), 'minima'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'total_calificaciones']
    ],
    include: [{
      model: Materia,
      as: 'materia',
      attributes: ['id', 'nombre', 'clave'],
      include: [{
        model: Maestro,
        as: 'maestro',
        attributes: ['id', 'nombre', 'apellido_paterno', 'apellido_materno']
      }]
    }],
    raw: false
  });

  // Obtener todas las calificaciones con detalles
  const calificaciones = await Calificacion.findAll({
    where,
    include: [
      {
        model: Alumno,
        as: 'alumno',
        attributes: ['id', 'matricula', 'nombre', 'apellido_paterno', 'apellido_materno']
      }
    ],
    order: [['calificacion', 'DESC']]
  });

  // Calcular aprobados y reprobados
  const aprobados = calificaciones.filter(c => parseFloat(c.calificacion) >= 60).length;
  const reprobados = calificaciones.length - aprobados;

  res.json({
    success: true,
    data: {
      materia: estadisticas[0]?.materia || null,
      estadisticas: {
        promedio: parseFloat(estadisticas[0]?.get('promedio') || 0).toFixed(2),
        maxima: parseFloat(estadisticas[0]?.get('maxima') || 0).toFixed(2),
        minima: parseFloat(estadisticas[0]?.get('minima') || 0).toFixed(2),
        total: parseInt(estadisticas[0]?.get('total_calificaciones') || 0),
        aprobados,
        reprobados,
        porcentaje_aprobacion: calificaciones.length > 0 
          ? ((aprobados / calificaciones.length) * 100).toFixed(2) 
          : 0
      },
      calificaciones
    }
  });
});

/**
 * Reporte de calificaciones por alumno
 */
const reportePorAlumno = asyncHandler(async (req, res) => {
  const { alumno_id, ciclo_escolar = '2024-2025' } = req.query;

  if (!alumno_id) {
    return res.status(400).json({
      success: false,
      message: 'El ID del alumno es requerido'
    });
  }

  const alumno = await Alumno.findByPk(alumno_id);
  
  if (!alumno) {
    return res.status(404).json({
      success: false,
      message: 'Alumno no encontrado'
    });
  }

  const calificaciones = await Calificacion.findAll({
    where: {
      alumno_id: parseInt(alumno_id),
      ciclo_escolar
    },
    include: [{
      model: Materia,
      as: 'materia',
      attributes: ['id', 'nombre', 'clave', 'creditos'],
      include: [{
        model: Maestro,
        as: 'maestro',
        attributes: ['id', 'nombre', 'apellido_paterno', 'apellido_materno']
      }]
    }],
    order: [
      [{ model: Materia, as: 'materia' }, 'nombre', 'ASC'],
      ['periodo', 'ASC']
    ]
  });

  // Calcular promedio general
  const totalCalificaciones = calificaciones.length;
  const sumaCalificaciones = calificaciones.reduce((sum, cal) => sum + parseFloat(cal.calificacion), 0);
  const promedioGeneral = totalCalificaciones > 0 ? (sumaCalificaciones / totalCalificaciones).toFixed(2) : 0;

  // Materias aprobadas y reprobadas
  const materiasAprobadas = calificaciones.filter(c => parseFloat(c.calificacion) >= 60).length;
  const materiasReprobadas = totalCalificaciones - materiasAprobadas;

  res.json({
    success: true,
    data: {
      alumno,
      estadisticas: {
        promedio_general: promedioGeneral,
        total_calificaciones: totalCalificaciones,
        materias_aprobadas: materiasAprobadas,
        materias_reprobadas: materiasReprobadas
      },
      calificaciones
    }
  });
});

/**
 * Reporte general del sistema (solo admin)
 */
const reporteGeneral = asyncHandler(async (req, res) => {
  const { ciclo_escolar = '2024-2025' } = req.query;

  // Total de alumnos
  const totalAlumnos = await Alumno.count({ where: { activo: true } });

  // Total de maestros
  const totalMaestros = await Maestro.count();

  // Total de materias
  const totalMaterias = await Materia.count({ where: { activo: true } });

  // Total de calificaciones en el ciclo
  const totalCalificaciones = await Calificacion.count({ where: { ciclo_escolar } });

  // Promedio general del sistema
  const promedioGeneral = await Calificacion.findAll({
    where: { ciclo_escolar },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('calificacion')), 'promedio']
    ],
    raw: true
  });

  // Distribución por grado
  const distribucionPorGrado = await Alumno.findAll({
    attributes: [
      'grado',
      [sequelize.fn('COUNT', sequelize.col('id')), 'total']
    ],
    where: { activo: true },
    group: ['grado'],
    order: [['grado', 'ASC']],
    raw: true
  });

  res.json({
    success: true,
    data: {
      ciclo_escolar,
      resumen: {
        total_alumnos: totalAlumnos,
        total_maestros: totalMaestros,
        total_materias: totalMaterias,
        total_calificaciones: totalCalificaciones,
        promedio_general: parseFloat(promedioGeneral[0]?.promedio || 0).toFixed(2)
      },
      distribucion_por_grado: distribucionPorGrado
    }
  });
});

module.exports = {
  reportePorGrado,
  reportePromedioMateria,
  reportePorAlumno,
  reporteGeneral
};