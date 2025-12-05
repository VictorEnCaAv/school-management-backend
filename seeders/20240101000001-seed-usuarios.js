'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Administrador del Sistema',
        email: 'admin@school.com',
        password_hash: await bcrypt.hash('admin123', salt),
        rol: 'CONTROL_ESCOLAR',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Juan Carlos Ramírez',
        email: 'maestro1@school.com',
        password_hash: await bcrypt.hash('maestro123', salt),
        rol: 'MAESTRO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'María Teresa González',
        email: 'maestro2@school.com',
        password_hash: await bcrypt.hash('maestro123', salt),
        rol: 'MAESTRO',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Pedro López Martínez',
        email: 'maestro3@school.com',
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