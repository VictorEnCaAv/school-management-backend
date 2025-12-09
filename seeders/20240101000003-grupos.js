'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Calificaciones de ejemplo
    // maestro_id: 2 = Juan Carlos Ramírez (Matemáticas)
    // maestro_id: 3 = María Teresa González (Español)
    // maestro_id: 4 = Pedro López Martínez (Ciencias)
    
    await queryInterface.bulkInsert('calificaciones', [
      // Matemáticas - Grupo 1° A
      {
        alumno_id: 1, // Juan Pérez García
        materia_id: 1, // Matemáticas
        maestro_id: 2,
        nota: 85.50,
        fecha_registro: new Date('2024-11-15'),
        observaciones: 'Buen desempeño en álgebra',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 2, // María López Hernández
        materia_id: 1, // Matemáticas
        maestro_id: 2,
        nota: 55.00,
        fecha_registro: new Date('2024-11-15'),
        observaciones: 'Necesita refuerzo en fracciones',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 3, // Carlos Ramírez Sánchez
        materia_id: 1, // Matemáticas
        maestro_id: 2,
        nota: 92.00,
        fecha_registro: new Date('2024-11-15'),
        observaciones: 'Excelente participación',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Español - Grupo 1° A
      {
        alumno_id: 1, // Juan Pérez García
        materia_id: 2, // Español
        maestro_id: 3,
        nota: 78.50,
        fecha_registro: new Date('2024-11-16'),
        observaciones: null,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 2, // María López Hernández
        materia_id: 2, // Español
        maestro_id: 3,
        nota: 88.00,
        fecha_registro: new Date('2024-11-16'),
        observaciones: 'Buena ortografía',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 3, // Carlos Ramírez Sánchez
        materia_id: 2, // Español
        maestro_id: 3,
        nota: 75.00,
        fecha_registro: new Date('2024-11-16'),
        observaciones: null,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Ciencias - Grupo 1° B
      {
        alumno_id: 4, // Ana Martínez Torres
        materia_id: 3, // Ciencias
        maestro_id: 4,
        nota: 90.00,
        fecha_registro: new Date('2024-11-17'),
        observaciones: 'Excelente en laboratorio',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 5, // Luis González Ruiz
        materia_id: 3, // Ciencias
        maestro_id: 4,
        nota: 72.50,
        fecha_registro: new Date('2024-11-17'),
        observaciones: null,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 6, // Elena Díaz Moreno
        materia_id: 3, // Ciencias
        maestro_id: 4,
        nota: 65.00,
        fecha_registro: new Date('2024-11-17'),
        observaciones: 'Mejorar estudio',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Más calificaciones variadas
      {
        alumno_id: 7, // Roberto Flores Castro
        materia_id: 1, // Matemáticas
        maestro_id: 2,
        nota: 82.00,
        fecha_registro: new Date('2024-11-18'),
        observaciones: null,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 8, // Patricia Medina Ramos
        materia_id: 2, // Español
        maestro_id: 3,
        nota: 95.00,
        fecha_registro: new Date('2024-11-18'),
        observaciones: 'Excelente redacción',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 9, // Fernando Ortiz Vega
        materia_id: 3, // Ciencias
        maestro_id: 4,
        nota: 58.50,
        fecha_registro: new Date('2024-11-19'),
        observaciones: 'Requiere tutoría',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        alumno_id: 10, // Gabriela Cruz Silva
        materia_id: 1, // Matemáticas
        maestro_id: 2,
        nota: 87.50,
        fecha_registro: new Date('2024-11-19'),
        observaciones: 'Buen progreso',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('calificaciones', null, {});
  }
};