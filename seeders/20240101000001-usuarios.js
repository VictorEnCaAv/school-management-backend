// seeders/20240101000001-usuarios.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Administrador',
        apellidos: 'del Sistema',
        email: 'admin@school.com',
        password_hash: await bcrypt.hash('admin123', salt),
        rol: 'CONTROL_ESCOLAR',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'María',
        apellidos: 'López García',
        email: 'maria.lopez@school.com',
        password_hash: await bcrypt.hash('maestro123', salt),
        rol: 'MAESTRO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Carlos',
        apellidos: 'Rodríguez Pérez',
        email: 'carlos.rodriguez@school.com',
        password_hash: await bcrypt.hash('maestro123', salt),
        rol: 'MAESTRO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Ana',
        apellidos: 'Martínez Sánchez',
        email: 'ana.martinez@school.com',
        password_hash: await bcrypt.hash('maestro123', salt),
        rol: 'MAESTRO',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};


