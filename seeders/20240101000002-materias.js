// seeders/20240101000002-materias.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('materias', [
      { codigo: 'MAT-101', nombre: 'Matemáticas', descripcion: 'Matemáticas básicas', creditos: 5, created_at: new Date(), updated_at: new Date() },
      { codigo: 'ESP-101', nombre: 'Español', descripcion: 'Lengua y literatura', creditos: 5, created_at: new Date(), updated_at: new Date() },
      { codigo: 'CNA-101', nombre: 'Ciencias Naturales', descripcion: 'Introducción a las ciencias', creditos: 4, created_at: new Date(), updated_at: new Date() },
      { codigo: 'HIS-101', nombre: 'Historia', descripcion: 'Historia de México', creditos: 3, created_at: new Date(), updated_at: new Date() },
      { codigo: 'GEO-101', nombre: 'Geografía', descripcion: 'Geografía física', creditos: 3, created_at: new Date(), updated_at: new Date() },
      { codigo: 'ING-101', nombre: 'Inglés', descripcion: 'Inglés básico', creditos: 4, created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('materias', null, {});
  }
};