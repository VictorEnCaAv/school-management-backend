const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Calificacion = sequelize.define('Calificacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alumnos',
        key: 'id'
      }
    },
    materia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'materias',
        key: 'id'
      }
    },
    maestro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
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
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'calificaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false // No usar paranoid porque tenemos deleted_at manual
  });

  // Método para verificar si el alumno aprobó
  Calificacion.prototype.aprobo = function() {
    return parseFloat(this.nota) >= 60;
  };

  // Método para soft delete
  Calificacion.prototype.softDelete = async function() {
    this.deleted_at = new Date();
    await this.save();
  };

  return Calificacion;
};