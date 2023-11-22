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
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amountReceived: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 
      },
      type: {
        type: Sequelize.ENUM('transfer', 'transaction', 'withdraw'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed'),
      },
      sender_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Referencing the Users table
          key: 'id',      // Referencing the id column in the Users table
        },
      },
      receiver_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Referencing the Users table
          key: 'id',      // Referencing the id column in the Users table
        },
      },
      notification_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Depending on your requirement
        references: {
          model: 'Notifications', // Referencing the Notifications table
          key: 'id',              // Referencing the id column in Notifications
        }
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