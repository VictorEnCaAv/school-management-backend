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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    deleteReason: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {  paranoid: true,
    deletedAt: 'deletedAt', 
    hooks: {
      beforeDestroy: (calificacion, options) => {
        // Registrar quién elimina
        if (options.usuarioId) {
          calificacion.deletedBy = options.usuarioId;
        }
      }
    }
  }, {
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

  };

  return Calificacion;
};