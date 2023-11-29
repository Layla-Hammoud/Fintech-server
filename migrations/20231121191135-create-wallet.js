'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Ensure each user has only one wallet
        references: {
          model: 'Users', // Referencing the Users table
          key: 'id',  
        },
        onDelete:"CASCADE",    // Referencing the id column in the Users table
      },
      usdBalance: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0 
      },
      usdtBalance: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wallets');
  }
};