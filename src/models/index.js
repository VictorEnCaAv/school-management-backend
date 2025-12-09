const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

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
const Usuario = require('./Usuario')(sequelize, DataTypes);
const Alumno = require('./Alumno')(sequelize, DataTypes);
const Materia = require('./Materia')(sequelize, DataTypes);
const Calificacion = require('./Calificacion')(sequelize, DataTypes);
const Maestro = require('./Maestro')(sequelize, DataTypes);
const Asignacion = require('./Asignacion')(sequelize, DataTypes);
const Grupo = require('./Grupo')(sequelize, DataTypes);

// Asociación en Calificacion
Calificacion.belongsTo(Usuario, {
  foreignKey: 'deletedBy',
  as: 'eliminadoPor'
});

// Asociación en Usuario
Usuario.hasMany(Calificacion, {
  foreignKey: 'deletedBy',
  as: 'calificacionesEliminadas'
});

// Guardar en objeto
const models = {
  Usuario,
  Alumno,
  Materia,
  Calificacion,
  Maestro,
  Asignacion,
  Grupo
};

// Cargar asociaciones
const setupAssociations = require('./associations');
setupAssociations(models);

// Exportar modelos
module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  ...models
};