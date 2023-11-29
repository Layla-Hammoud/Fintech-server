'use strict';
import { Model, DataTypes } from 'sequelize';
export default (sequelize,DataTypes)=>{

  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.TransactionModel, {
        foreignKey: 'NotificationId',
        as: 'transaction',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Notification.init({
    TransactionId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notification',
  });

return Notification;

}

