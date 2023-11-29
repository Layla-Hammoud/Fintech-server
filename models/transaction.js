'use strict';
import { Model, DataTypes } from 'sequelize';
export default (sequelize,DataTypes)=>{

class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.hasOne(models.NotificationModel, {
        foreignKey: 'NotificationId',
        as: 'notification',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Transaction.belongsTo(models.UserModel, {
        foreignKey: 'senderId',
        as: 'sender', 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
  
      Transaction.belongsTo(models.UserModel, {
        foreignKey: 'receiverId', 
        as: 'receiver',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Transaction.init({
    amountSent: DataTypes.FLOAT,
    amountReceived: DataTypes.FLOAT,
    type: DataTypes.ENUM('transfer', 'transaction', 'withdraw'),
    status: DataTypes.ENUM('pending', 'completed','canceled'),
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  return Transaction;
}