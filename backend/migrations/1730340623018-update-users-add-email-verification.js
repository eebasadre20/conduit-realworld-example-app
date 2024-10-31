'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'email_verified_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'email_verification_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'email_verified_at');
    await queryInterface.removeColumn('Users', 'email_verification_token');
  },
};