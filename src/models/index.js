const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Crear instancia de Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);

// Importar modelos
const Usuario = require('./Usuario')(sequelize);
const Alumno = require('./Alumno')(sequelize);
const Materia = require('./Materia')(sequelize);
const Calificacion = require('./Calificacion')(sequelize);
const Maestro = require('./Maestro')(sequelize);

// Relaciones Usuario ↔ Maestro
Usuario.hasMany(Maestro, {
  foreignKey: 'usuario_id',
  as: 'maestro'
});

Maestro.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Calificaciones
Calificacion.belongsTo(Alumno, {
  foreignKey: 'alumno_id',
  as: 'alumno',
  onDelete: 'CASCADE'
});
Alumno.hasMany(Calificacion, {
  foreignKey: 'alumno_id',
  as: 'calificaciones'
});

Calificacion.belongsTo(Materia, {
  foreignKey: 'materia_id',
  as: 'materia',
  onDelete: 'RESTRICT'
});
Materia.hasMany(Calificacion, {
  foreignKey: 'materia_id',
  as: 'calificaciones'
});

Calificacion.belongsTo(Usuario, {
  foreignKey: 'maestro_id',
  as: 'maestro',
  onDelete: 'RESTRICT'
});
Usuario.hasMany(Calificacion, {
  foreignKey: 'maestro_id',
  as: 'calificaciones'
});

// Exportar modelos
module.exports = {
  sequelize,
  Sequelize,
  Usuario,
  Alumno,
  Materia,
  Calificacion,
  Maestro
};