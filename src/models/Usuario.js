// src/models/Usuario.js (ACTUALIZADO)
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    apellidos: {  // ← AÑADIR ESTE CAMPO
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido'
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    rol: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isIn: {
          args: [['MAESTRO', 'CONTROL_ESCOLAR']],
          msg: 'El rol debe ser MAESTRO o CONTROL_ESCOLAR'
        }
      }
    },

  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password_hash) {
          const salt = await bcrypt.genSalt(10);
          usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password_hash')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
        }
      }
    }
  });

  // Método de instancia para comparar contraseñas
  Usuario.prototype.compararPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  // Método para serializar usuario (sin password)
  Usuario.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  };

  return Usuario;
};