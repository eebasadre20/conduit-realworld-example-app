'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment_attachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      },
      filePath: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'file_path'
      },
      fileType: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'file_type'
      },
      fileSize: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'file_size'
      },
      commentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'comment_id',
        references: {
          model: 'Comments',
          key: 'id',
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comment_attachments');
  }
};