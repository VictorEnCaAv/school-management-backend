// src/controllers/maestroController.js
const { Asignacion, Calificacion, Alumno, Materia, Grupo, sequelize } = require('../models');

exports.obtenerMisAsignaciones = async (req, res) => {
  try {
    const maestroId = req.usuario.id;

    const asignaciones = await Asignacion.findAll({
      where: { 
        maestro_id: maestroId,
        activo: true 
      },
      include: [
        {
          model: Materia,
          as: 'materia',
          attributes: ['id', 'codigo', 'nombre']
        },
        {
          model: Grupo,
          as: 'grupo',
          attributes: ['id', 'codigo', 'nombre', 'ciclo_escolar']
        }
      ],
      order: [['materia', 'nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: asignaciones
    });
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener asignaciones'
    });
  }
};

exports.obtenerAlumnosPorAsignacion = async (req, res) => {
  try {
    const { asignacion_id } = req.params;
    const maestroId = req.usuario.id;

    // Verificar que la asignación pertenece al maestro
    const asignacion = await Asignacion.findOne({
      where: {
        id: asignacion_id,
        maestro_id: maestroId
      },
      include: [
        { model: Materia, as: 'materia' },
        { model: Grupo, as: 'grupo' }
      ]
    });

    if (!asignacion) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a esta asignación'
      });
    }

    // Obtener alumnos del grupo
    const alumnos = await Alumno.findAll({
      where: {
        grupo_id: asignacion.grupo_id,
        activo: true
      },
      attributes: ['id', 'matricula', 'nombre', 'apellidos'],
      order: [['apellidos', 'ASC'], ['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        asignacion,
        alumnos
      }
    });
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener alumnos'
    });
  }
};

exports.registrarCalificacion = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { asignacion_id, alumno_id, nota, periodo, observaciones } = req.body;
    const maestroId = req.usuario.id;

    // Verificar que la asignación pertenece al maestro
    const asignacion = await Asignacion.findOne({
      where: {
        id: asignacion_id,
        maestro_id: maestroId,
        activo: true
      }
    });

    if (!asignacion) {
      await t.rollback();
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para calificar en esta asignación'
      });
    }

    // Verificar que el alumno pertenece al grupo
    const alumno = await Alumno.findOne({
      where: {
        id: alumno_id,
        grupo_id: asignacion.grupo_id,
        activo: true
      }
    });

    if (!alumno) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Alumno no encontrado en este grupo'
      });
    }

    // Verificar si ya existe calificación para este periodo
    const calificacionExistente = await Calificacion.findOne({
      where: {
        asignacion_id,
        alumno_id,
        periodo
      }
    });

    if (calificacionExistente) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Ya existe una calificación para este alumno en este periodo. Usa la opción de editar.'
      });
    }

    // Crear calificación
    const calificacion = await Calificacion.create({
      asignacion_id,
      alumno_id,
      nota,
      periodo,
      fecha_evaluacion: new Date(),
      observaciones
    }, { transaction: t });

    await t.commit();

    // Cargar datos relacionados
    const calificacionCompleta = await Calificacion.findByPk(calificacion.id, {
      include: [
        {
          model: Asignacion,
          as: 'asignacion',
          include: [
            { model: Materia, as: 'materia' },
            { model: Grupo, as: 'grupo' }
          ]
        },
        {
          model: Alumno,
          as: 'alumno',
          attributes: ['id', 'matricula', 'nombre', 'apellidos']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Calificación registrada exitosamente',
      data: calificacionCompleta
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al registrar calificación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al registrar calificación'
    });
  }
};

exports.obtenerMisCalificaciones = async (req, res) => {
  try {
    const maestroId = req.usuario.id;
    const { asignacion_id, periodo } = req.query;

    const whereClause = {};
    
    if (asignacion_id) {
      whereClause.asignacion_id = asignacion_id;
    }
    
    if (periodo) {
      whereClause.periodo = periodo;
    }

    const calificaciones = await Calificacion.findAll({
      where: whereClause,
      include: [
        {
          model: Asignacion,
          as: 'asignacion',
          where: { maestro_id: maestroId },
          include: [
            { model: Materia, as: 'materia' },
            { model: Grupo, as: 'grupo' }
          ]
        },
        {
          model: Alumno,
          as: 'alumno',
          attributes: ['id', 'matricula', 'nombre', 'apellidos']
        }
      ],
      order: [
        ['periodo', 'DESC'],
        ['fecha_evaluacion', 'DESC']
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

exports.actualizarCalificacion = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { nota, observaciones } = req.body;
    const maestroId = req.usuario.id;

    // Buscar calificación y verificar permisos
    const calificacion = await Calificacion.findOne({
      where: { id },
      include: [{
        model: Asignacion,
        as: 'asignacion',
        where: { maestro_id: maestroId }
      }]
    });

    if (!calificacion) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Calificación no encontrada o no tienes permiso para editarla'
      });
    }

    // Actualizar
    await calificacion.update({
      nota,
      observaciones
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
            { model: Grupo, as: 'grupo' }
          ]
        },
        { model: Alumno, as: 'alumno' }
      ]
    });

    res.json({
      success: true,
      message: 'Calificación actualizada exitosamente',
      data: calificacionActualizada
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al actualizar calificación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar calificación'
    });
  }
};