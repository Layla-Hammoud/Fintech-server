import { Model, DataTypes } from 'sequelize';

  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.Transaction, {
        foreignKey: 'notification_id',
        as: 'transaction',
      });
    }
  }

  Notification.init({
    transaction_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notification',
  });

export default Notification;

