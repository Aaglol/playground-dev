'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('playground_family_members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fmember_firstname: {
        type: Sequelize.STRING
      },
      fmember_lastname: {
        type: Sequelize.STRING
      },
      fmember_dateOfBirth: {
        type: Sequelize.DATEONLY
      },
      family_permission: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      connected_family: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('playground_family_members');
  }
};