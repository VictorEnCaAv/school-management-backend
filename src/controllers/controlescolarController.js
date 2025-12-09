// src/controllers/controlEscolarController.js
const { Calificacion, Asignacion, Alumno, Materia, Grupo, Usuario, sequelize } = require('../models');

exports.obtenerTodasLasCalificaciones = async (req, res) => {
  try {
    const { maestro_id, materia_id, grupo_id, periodo } = req.query;

    const whereClause = {};
    const asignacionWhere = {};

    if (maestro_id) asignacionWhere.maestro_id = maestro_id;
    if (materia_id) asignacionWhere.materia_id = materia_id;
    if (grupo_id) asignacionWhere.grupo_id = grupo_id;
    if (periodo) whereClause.periodo = periodo;

    const calificaciones = await Calificacion.findAll({
      where: whereClause,
      include: [
        {
          model: Asignacion,
          as: 'asignacion',
          where: Object.keys(asignacionWhere).length > 0 ? asignacionWhere : undefined,
          include: [
            { 
              model: Materia, 
              as: 'materia',
              attributes: ['id', 'codigo', 'nombre']
            },
            { 
              model: Grupo, 
              as: 'grupo',
              attributes: ['id', 'codigo', 'nombre']
            },
            {
              model: Usuario,
              as: 'maestro',
              attributes: ['id', 'nombre', 'apellidos']
            }
          ]
        },
        {
          model: Alumno,
          as: 'alumno',
          attributes: ['id', 'matricula', 'nombre', 'apellidos']
        }
      ],
      order: [
        ['created_at', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: calificaciones
    });
  } catch (error) {
    console.error('Error al obtener calificaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener calificaciones'
    });
  }
};

exports.modificarCalificacion = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { nota, observaciones } = req.body;
    const adminId = req.usuario.id;

    const calificacion = await Calificacion.findByPk(id);

    if (!calificacion) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Calificación no encontrada'
      });
    }

    // Actualizar con registro de quién modificó
    await calificacion.update({
      nota,
      observaciones,
      modificada_por: adminId,
      fecha_modificacion: new Date()
    }, { transaction: t });

    await t.commit();

    // Recargar con datos completos
    const calificacionActualizada = await Calificacion.findByPk(id, {
      include: [
        {
          model: Asignacion,
          as: 'asignacion',
          include: [
            { model: Materia, as: 'materia' },
            { model: Grupo, as: 'grupo' },
            { model: Usuario, as: 'maestro' }
          ]
        },
        { model: Alumno, as: 'alumno' },
        { 
          model: Usuario, 
          as: 'modificador',
          attributes: ['id', 'nombre', 'apellidos']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Calificación modificada por Control Escolar',
      data: calificacionActualizada
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al modificar calificación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al modificar calificación'
    });
  }
};

exports.eliminarCalificacion = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const calificacion = await Calificacion.findByPk(id);

    if (!calificacion) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Calificación no encontrada'
      });
    }

    // Soft delete
    await calificacion.destroy({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: 'Calificación eliminada correctamente'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al eliminar calificación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar calificación'
    });
  }
};

exports.obtenerReporteGeneral = async (req, res) => {
  try {
    const [reporteGeneral] = await sequelize.query(`
      SELECT 
        COUNT(DISTINCT c.alumno_id) as total_alumnos,
        COUNT(c.id) as total_calificaciones,
        ROUND(AVG(c.nota), 2) as promedio_general,
        ROUND(MIN(c.nota), 2) as nota_minima,
        ROUND(MAX(c.nota), 2) as nota_maxima
      FROM calificaciones c
      WHERE c.deleted_at IS NULL
    `);

    const [promediosPorMateria] = await sequelize.query(`
      SELECT 
        m.nombre as materia,
        ROUND(AVG(c.nota), 2) as promedio,
        COUNT(c.id) as total_calificaciones
      FROM calificaciones c
      INNER JOIN asignaciones a ON c.asignacion_id = a.id
      INNER JOIN materias m ON a.materia_id = m.id
      WHERE c.deleted_at IS NULL
      GROUP BY m.id, m.nombre
      ORDER BY promedio DESC
    `);

    res.json({
      success: true,
      data: {
        resumen: reporteGeneral[0],
        por_materia: promediosPorMateria
      }
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      error: 'Error al generar reporte'
    });
  }
};