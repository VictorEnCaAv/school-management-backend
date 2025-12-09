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
        model: 'Usuarios',
        key: 'id'
      }
    },
    materia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Materias',
        key: 'id'
      }
    },
    grupo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Grupos',
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
    Asignacion.belongsTo(models.Usuario, { 
      foreignKey: 'maestro_id', 
      as: 'maestro' 
    });
    Asignacion.belongsTo(models.Materia, { 
      foreignKey: 'materia_id', 
      as: 'materia' 
    });
    Asignacion.belongsTo(models.Grupo, { 
      foreignKey: 'grupo_id', 
      as: 'grupo' 
    });
    Asignacion.hasMany(models.Calificacion, { 
      foreignKey: 'asignacion_id', 
      as: 'calificaciones' 
    });
  };

  return Asignacion;
};