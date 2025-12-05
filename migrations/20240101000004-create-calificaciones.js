'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calificaciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      alumno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'alumnos',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      materia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'materias',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      maestro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      nota: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Agregar constraint de CHECK para nota (0-100)
    await queryInterface.sequelize.query(`
      ALTER TABLE calificaciones
      ADD CONSTRAINT calificaciones_nota_check
      CHECK (nota >= 0 AND nota <= 100)
    `);

    // Crear índices para mejorar el rendimiento
    await queryInterface.addIndex('calificaciones', ['alumno_id']);
    await queryInterface.addIndex('calificaciones', ['materia_id']);
    await queryInterface.addIndex('calificaciones', ['maestro_id']);
    await queryInterface.addIndex('calificaciones', ['deleted_at']); // Para filtrar soft deletes
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('calificaciones');
  }
};