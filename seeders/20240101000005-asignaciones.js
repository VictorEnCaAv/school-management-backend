// seeders/20240101000005-asignaciones.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('asignaciones', [
      // María López (maestro_id: 2) - Matemáticas y Español en 1A y 1B
      { maestro_id: 2, materia_id: 1, grupo_id: 1, ciclo_escolar: '2024-2025', created_at: new Date(), updated_at: new Date() },
      { maestro_id: 2, materia_id: 2, grupo_id: 1, ciclo_escolar: '2024-2025', created_at: new Date(), updated_at: new Date() },
      { maestro_id: 2, materia_id: 1, grupo_id: 2, ciclo_escolar: '2024-2025', created_at: new Date(), updated_at: new Date() },
      
      // Carlos Rodríguez (maestro_id: 3) - Ciencias e Historia en 1A y 2A
      { maestro_id: 3, materia_id: 3, grupo_id: 1, ciclo_escolar: '2024-2025', created_at: new Date(), updated_at: new Date() },
      { maestro_id: 3, materia_id: 4, grupo_id: 1, ciclo_escolar: '2024-2025', created_at: new Date(), updated_at: new Date() },
      { maestro_id: 3, materia_id: 3, grupo_id: 3, ciclo_escolar: '2024-2025', created_at: new Date(), updated_at: new Date() },
      
      // Ana Martínez (maestro_id: 4) - Inglés y Geografía
      { maestro_id: 4, materia_id: 6, grupo_id: 1, ciclo_escolar: '2024-2025', created_at: new Date(), updated_at: new Date() },
      { maestro_id: 4, materia_id: 5, grupo_id: 2, ciclo_escolar: '2024-2025', created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('asignaciones', null, {});
  }
};