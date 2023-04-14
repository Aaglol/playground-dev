'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('playground_families', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      playground_user: {
        type: Sequelize.INTEGER
      },
      family_name: {
        type: Sequelize.STRING
      },
      family_description: {
        type: Sequelize.STRING
      },
      family_status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('playground_families');
  }
};