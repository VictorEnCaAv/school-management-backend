// src/controllers/controlEscolarController.js
const { Calificacion, Asignacion, Alumno, Materia, Grupo, Usuario, sequelize } = require('../models');

/**
 * Listar todas las calificaciones (incluyendo eliminadas)
 */
exports.listarCalificaciones = async (req, res) => {
  try {
    const {
      pagina = 1,
      limite = 20,
      asignacion_id,
      alumno_id,
      periodo,
      incluirEliminadas = false
    } = req.query;

    const offset = (pagina - 1) * limite;

    const whereClause = {};
    
    if (asignacion_id) {
      whereClause.asignacion_id = asignacion_id;
    }
    
    if (alumno_id) {
      whereClause.alumno_id = alumno_id;
    }
    
    if (periodo) {
      whereClause.periodo = periodo;
    }

    const options = {
      where: whereClause,
      include: [
        {
          model: Asignacion,
          as: 'asignacion',
          include: [
            { model: Materia, as: 'materia' },
            { model: Grupo, as: 'grupo' },
            { 
              model: Usuario, 
              as: 'maestro',
              attributes: ['id', 'nombre', 'apellidos', 'email']
            }
          ]
        },
        {
          model: Alumno,
          as: 'alumno',
          attributes: ['id', 'matricula', 'nombre', 'apellidos']
        },
        {
          model: Usuario,
          as: 'eliminadoPor',
          attributes: ['id', 'nombre', 'apellidos', 'email'],
          required: false
        }
      ],
      order: [
        ['deletedAt', 'ASC'], // Primero las no eliminadas
        ['periodo', 'DESC'],
        ['fecha_evaluacion', 'DESC']
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      paranoid: !incluirEliminadas // Si no incluye eliminadas, usa paranoid
    };

    const { count, rows: calificaciones } = await Calificacion.findAndCountAll(options);

    res.json({
      success: true,
      data: calificaciones,
      paginacion: {
        total: count,
        pagina: parseInt(pagina),
        totalPaginas: Math.ceil(count / limite),
        limite: parseInt(limite)
      }
    });
  } catch (error) {
    console.error('Error al listar calificaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al listar calificaciones'
    });
  }
};

/**
 * Obtener detalle de una calificación
 */
exports.obtenerCalificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const calificacion = await Calificacion.findByPk(id, {
      include: [
        {
          model: Asignacion,
          as: 'asignacion',
          include: [
            { model: Materia, as: 'materia' },
            { model: Grupo, as: 'grupo' },
            { 
              model: Usuario, 
              as: 'maestro',
              attributes: ['id', 'nombre', 'apellidos', 'email']
            }
          ]
        },
        {
          model: Alumno,
          as: 'alumno',
          attributes: ['id', 'matricula', 'nombre', 'apellidos', 'grupo_id']
        },
        {
          model: Usuario,
          as: 'eliminadoPor',
          attributes: ['id', 'nombre', 'apellidos', 'email'],
          required: false
        }
      ],
      paranoid: false // Incluir incluso si está eliminada
    });

    if (!calificacion) {
      return res.status(404).json({
        success: false,
        error: 'Calificación no encontrada'
      });
    }

    res.json({
      success: true,
      data: calificacion
    });
  } catch (error) {
    console.error('Error al obtener calificación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener calificación'
    });
  }
};

/**
 * Eliminar (soft delete) una calificación
 */
exports.eliminarCalificacion = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const adminId = req.usuario.id;

    // Buscar la calificación
    const calificacion = await Calificacion.findByPk(id, {
      include: [
        {
          model: Asignacion,
          as: 'asignacion',
          include: [
            { model: Materia, as: 'materia' },
            { 
              model: Usuario, 
              as: 'maestro',
              attributes: ['id', 'nombre', 'apellidos', 'email']
            }
          ]
        },
        {
          model: Alumno,
          as: 'alumno',
          attributes: ['id', 'matricula', 'nombre', 'apellidos']
        }
      ],
      transaction: t
    });

    if (!calificacion) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Calificación no encontrada'
      });
    }

    // Verificar que no esté ya eliminada
    if (calificacion.deletedAt) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'La calificación ya está eliminada'
      });
    }

    // Realizar soft delete con auditoría
    await calificacion.update({
      deleteReason: motivo || 'Eliminado por control escolar',
      deletedBy: adminId
    }, { transaction: t });

    await calificacion.destroy({ transaction: t });

    await t.commit();

    // Registrar en logs del sistema
    console.log(`Calificación ${id} eliminada por control escolar ${adminId}. Motivo: ${motivo || 'Sin motivo especificado'}`);

    res.json({
      success: true,
      message: 'Calificación eliminada exitosamente',
      data: {
        id: calificacion.id,
        alumno: calificacion.alumno.nombre + ' ' + calificacion.alumno.apellidos,
        materia: calificacion.asignacion.materia.nombre,
        nota: calificacion.nota,
        periodo: calificacion.periodo,
        eliminadoPor: req.usuario.nombre + ' ' + req.usuario.apellidos,
        fechaEliminacion: new Date(),
        motivo: motivo
      }
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

/**
 * Restaurar una calificación eliminada
 */
exports.restaurarCalificacion = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const adminId = req.usuario.id;

    // Buscar la calificación eliminada (paranoid: false para incluir eliminadas)
    const calificacion = await Calificacion.findOne({
      where: { id },
      paranoid: false,
      transaction: t
    });

    if (!calificacion) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Calificación no encontrada'
      });
    }

    // Verificar que esté eliminada
    if (!calificacion.deletedAt) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'La calificación no está eliminada'
      });
    }

    // Restaurar la calificación
    await calificacion.update({
      deletedAt: null,
      deletedBy: null,
      deleteReason: null
    }, { transaction: t });

    await calificacion.restore({ transaction: t });

    await t.commit();

    // Registrar en logs del sistema
    console.log(`Calificación ${id} restaurada por control escolar ${adminId}`);

    res.json({
      success: true,
      message: 'Calificación restaurada exitosamente',
      data: {
        id: calificacion.id,
        restauradoPor: req.usuario.nombre + ' ' + req.usuario.apellidos,
        fechaRestauracion: new Date()
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al restaurar calificación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al restaurar calificación'
    });
  }
};

// Exportar funciones existentes que ya tengas en controlEscolarController.js
// Mantén las funciones existentes y agrega estas nuevas