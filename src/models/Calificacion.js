// src/models/Calificacion.js (ACTUALIZADO)
module.exports = (sequelize, DataTypes) => {
  const Calificacion = sequelize.define('Calificacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    asignacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Asignaciones',
        key: 'id'
      }
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Alumnos',
        key: 'id'
      }
    },
    nota: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    periodo: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    fecha_evaluacion: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    observaciones: {
      type: DataTypes.TEXT
    },
    modificada_por: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    fecha_modificacion: {
      type: DataTypes.DATE
    },
    deleted_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'calificaciones',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  Calificacion.associate = (models) => {
    Calificacion.belongsTo(models.Asignacion, { 
      foreignKey: 'asignacion_id', 
      as: 'asignacion' 
    });
    Calificacion.belongsTo(models.Alumno, { 
      foreignKey: 'alumno_id', 
      as: 'alumno' 
    });
    Calificacion.belongsTo(models.Usuario, { 
      foreignKey: 'modificada_por', 
      as: 'modificador' 
    });
  };

  return Calificacion;
};