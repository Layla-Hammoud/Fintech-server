'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amountSent: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0 

      },
      amountReceived: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0 
      },
      type: {
        type: Sequelize.ENUM('transfer', 'transaction', 'withdraw','deposit'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed','canceled'),
        defaultValue:'pending'
      },
      senderId: { 
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Referencing the Users table
          key: 'id',      // Referencing the id column in the Users table
        },
      },
      receiverId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Referencing the Users table
          key: 'id',      // Referencing the id column in the Users table
        },
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
    await queryInterface.dropTable('Transactions');
  }
};