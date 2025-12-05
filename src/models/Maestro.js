const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Maestro = sequelize.define('Maestro', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido_paterno: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido_materno: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cedula_profesional: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'maestros',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Método para obtener nombre completo
  Maestro.prototype.nombreCompleto = function() {
    return `${this.nombre} ${this.apellido_paterno} ${this.apellido_materno || ''}`.trim();
  };

  return Maestro;
};