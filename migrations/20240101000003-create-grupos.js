'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('grupos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      codigo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      ciclo_escolar: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      nivel: {
        type: Sequelize.STRING(50)
      },
      grado: {
        type: Sequelize.STRING(10)
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

    await queryInterface.addIndex('grupos', ['codigo'], {
      unique: true,
      name: 'idx_grupos_codigo'
    });

    await queryInterface.addIndex('grupos', ['ciclo_escolar'], {
      name: 'idx_grupos_ciclo'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('grupos');
  }
};