// src/models/Alumno.js
module.exports = (sequelize, DataTypes) => {
  const Alumno = sequelize.define('Alumno', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    matricula: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    grupo_id: {  // AÑADE ESTE CAMPO
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'grupos',
        key: 'id'
      }
    }
  }, {
    tableName: 'alumnos',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // No necesitamos associate aquí si usamos associations.js
  return Alumno;
};