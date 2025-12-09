'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asignaciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      maestro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      materia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'materias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      grupo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'grupos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ciclo_escolar: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    // Constraint UNIQUE
    await queryInterface.addConstraint('asignaciones', {
      fields: ['maestro_id', 'materia_id', 'grupo_id', 'ciclo_escolar'],
      type: 'unique',
      name: 'asignaciones_unique_constraint'
    });

    await queryInterface.addIndex('asignaciones', ['maestro_id'], {
      name: 'idx_asignaciones_maestro'
    });

    await queryInterface.addIndex('asignaciones', ['materia_id'], {
      name: 'idx_asignaciones_materia'
    });

    await queryInterface.addIndex('asignaciones', ['grupo_id'], {
      name: 'idx_asignaciones_grupo'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asignaciones');
  }
};