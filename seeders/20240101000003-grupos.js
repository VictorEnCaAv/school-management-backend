// seeders/20240101000003-grupos.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('grupos', [
      { codigo: '1A-2024', nombre: 'Primero A', ciclo_escolar: '2024-2025', nivel: 'Primaria', grado: '1°', created_at: new Date(), updated_at: new Date() },
      { codigo: '1B-2024', nombre: 'Primero B', ciclo_escolar: '2024-2025', nivel: 'Primaria', grado: '1°', created_at: new Date(), updated_at: new Date() },
      { codigo: '2A-2024', nombre: 'Segundo A', ciclo_escolar: '2024-2025', nivel: 'Primaria', grado: '2°', created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grupos', null, {});
  }
};