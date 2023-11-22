'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    amountSent: DataTypes.INTEGER,
    amountReceived: DataTypes.INTEGER,
    type: DataTypes.ENUM('transfer', 'transaction', 'withdraw'),
    status: DataTypes.ENUM('pending', 'completed'),
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    notificantion_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'sender_id', // Assuming sender_id in Transaction table references User
      as: 'sender', // Alias for the association
    });

    Transaction.belongsTo(models.User, {
      foreignKey: 'receiver_id', // Assuming receiver_id in Transaction table references User
      as: 'receiver', // Alias for the association
    });
  };

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Notification, {
      foreignKey: 'notification_id', // The foreign key in Transaction referencing Notification
      as: 'notification', // Alias for the association
    });
  };

  return Transaction;
};