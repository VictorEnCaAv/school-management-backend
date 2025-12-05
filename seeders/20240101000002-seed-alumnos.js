'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('alumnos', [
      {
        nombre: 'Juan Pérez García',
        matricula: '2024001',
        fecha_nacimiento: '2010-05-15',
        grupo: '1° A',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'María López Hernández',
        matricula: '2024002',
        fecha_nacimiento: '2010-08-22',
        grupo: '1° A',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Carlos Ramírez Sánchez',
        matricula: '2024003',
        fecha_nacimiento: '2010-03-10',
        grupo: '1° A',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Ana Martínez Torres',
        matricula: '2024004',
        fecha_nacimiento: '2010-11-30',
        grupo: '1° B',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Luis González Ruiz',
        matricula: '2024005',
        fecha_nacimiento: '2010-07-18',
        grupo: '1° B',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Elena Díaz Moreno',
        matricula: '2024006',
        fecha_nacimiento: '2010-02-25',
        grupo: '1° B',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Roberto Flores Castro',
        matricula: '2024007',
        fecha_nacimiento: '2009-09-12',
        grupo: '2° A',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Patricia Medina Ramos',
        matricula: '2024008',
        fecha_nacimiento: '2009-06-05',
        grupo: '2° A',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Fernando Ortiz Vega',
        matricula: '2024009',
        fecha_nacimiento: '2009-12-20',
        grupo: '2° A',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Gabriela Cruz Silva',
        matricula: '2024010',
        fecha_nacimiento: '2009-04-08',
        grupo: '2° B',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alumnos', null, {});
  }
};