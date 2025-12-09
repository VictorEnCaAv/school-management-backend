// src/models/associations.js
module.exports = (models) => {
  // Usuario ↔ Maestro
  models.Usuario.hasMany(models.Maestro, {
    foreignKey: 'usuario_id',
    as: 'maestros'
  });
  models.Maestro.belongsTo(models.Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
  });

  // Alumno ↔ Calificacion
  models.Alumno.hasMany(models.Calificacion, {
    foreignKey: 'alumno_id',
    as: 'calificaciones_alumno'  // ALIAS ÚNICO
  });
  models.Calificacion.belongsTo(models.Alumno, {
    foreignKey: 'alumno_id',
    as: 'alumno'
  });

  // Asignacion ↔ Calificacion
  models.Asignacion.hasMany(models.Calificacion, {
    foreignKey: 'asignacion_id',
    as: 'calificaciones_asignacion'  // ALIAS ÚNICO
  });
  models.Calificacion.belongsTo(models.Asignacion, {
    foreignKey: 'asignacion_id',
    as: 'asignacion'
  });

  // Usuario ↔ Calificacion (como modificador)
  models.Usuario.hasMany(models.Calificacion, {
    foreignKey: 'modificada_por',
    as: 'calificaciones_modificadas'  // ALIAS ÚNICO (ya lo tienes)
  });
  models.Calificacion.belongsTo(models.Usuario, {
    foreignKey: 'modificada_por',
    as: 'modificador'
  });

  // Grupo ↔ Alumno
  models.Grupo.hasMany(models.Alumno, {
    foreignKey: 'grupo_id',
    as: 'alumnos'
  });
  // NOTA: Alumno.js necesita un campo 'grupo_id' para esto
  models.Alumno.belongsTo(models.Grupo, {
    foreignKey: 'grupo_id',
    as: 'grupo'
  });

  // Asignacion ↔ Grupo, Materia, Usuario
  models.Asignacion.belongsTo(models.Grupo, {
    foreignKey: 'grupo_id',
    as: 'grupo'
  });
  models.Asignacion.belongsTo(models.Materia, {
    foreignKey: 'materia_id',
    as: 'materia'
  });
  models.Asignacion.belongsTo(models.Usuario, {
    foreignKey: 'maestro_id',
    as: 'maestro'
  });
  
  models.Grupo.hasMany(models.Asignacion, {
    foreignKey: 'grupo_id',
    as: 'asignaciones'
  });
  
  models.Materia.hasMany(models.Asignacion, {
    foreignKey: 'materia_id',
    as: 'asignaciones_materia'  // ALIAS ÚNICO
  });
  
  models.Usuario.hasMany(models.Asignacion, {
    foreignKey: 'maestro_id',
    as: 'asignaciones_maestro'  // ALIAS ÚNICO
  });
};