'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('materias', [
      {
        codigo: 'MAT101',
        nombre: 'Matemáticas',
        descripcion: 'Fundamentos de matemáticas: aritmética, álgebra y geometría básica',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'ESP101',
        nombre: 'Español',
        descripcion: 'Gramática, ortografía, lectura y redacción',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'CIE101',
        nombre: 'Ciencias Naturales',
        descripcion: 'Biología, física y química básica',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'HIS101',
        nombre: 'Historia',
        descripcion: 'Historia de México y universal',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'GEO101',
        nombre: 'Geografía',
        descripcion: 'Geografía física y humana',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'ING101',
        nombre: 'Inglés',
        descripcion: 'Introducción al idioma inglés',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'EDF101',
        nombre: 'Educación Física',
        descripcion: 'Actividad física y deportes',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'ART101',
        nombre: 'Artes',
        descripcion: 'Expresión artística y creatividad',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('materias', null, {});
  }
};