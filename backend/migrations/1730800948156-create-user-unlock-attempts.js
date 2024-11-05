'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_unlock_attempts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      attempted_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      successful: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      unlock_strategy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'unlock_strategies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_unlock_attempts');
  }
};