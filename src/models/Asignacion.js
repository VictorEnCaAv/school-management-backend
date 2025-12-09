// src/models/Asignacion.js
module.exports = (sequelize, DataTypes) => {
  const Asignacion = sequelize.define('Asignacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
maestro_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'usuarios',  // ← Minúscula
    key: 'id'
  }
},
materia_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'materias',  // ← Minúscula
    key: 'id'
  }
},
    grupo_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'grupos',  // ← Minúscula
    key: 'id'
  }
},
    ciclo_escolar: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'asignaciones',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Asignacion.associate = (models) => {
    
  };

  return Asignacion;
};