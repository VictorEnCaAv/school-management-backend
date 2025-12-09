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
      asignacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'asignaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      alumno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'alumnos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nota: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 100
        }
      },
      periodo: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      fecha_evaluacion: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      modificada_por: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fecha_modificacion: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
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

    await queryInterface.addIndex('calificaciones', ['asignacion_id'], {
      name: 'idx_calificaciones_asignacion'
    });

    await queryInterface.addIndex('calificaciones', ['alumno_id'], {
      name: 'idx_calificaciones_alumno'
    });

    await queryInterface.addIndex('calificaciones', ['periodo'], {
      name: 'idx_calificaciones_periodo'
    });

    // Constraint CHECK para nota entre 0 y 100
    await queryInterface.sequelize.query(`
      ALTER TABLE calificaciones 
      ADD CONSTRAINT chk_nota_rango 
      CHECK (nota >= 0 AND nota <= 100)
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('calificaciones');
  }
};