const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
    grupo: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'alumnos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Alumno;
};