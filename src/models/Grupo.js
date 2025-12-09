// src/models/Grupo.js
module.exports = (sequelize, DataTypes) => {
  const Grupo = sequelize.define('Grupo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ciclo_escolar: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nivel: {
      type: DataTypes.STRING(50)
    },
    grado: {
      type: DataTypes.STRING(10)
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'grupos',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Grupo.associate = (models) => {
    Grupo.hasMany(models.Alumno, { 
      foreignKey: 'grupo_id', 
      as: 'alumnos' 
    });
    Grupo.hasMany(models.Asignacion, { 
      foreignKey: 'grupo_id', 
      as: 'asignaciones' 
    });
  };

  return Grupo;
};