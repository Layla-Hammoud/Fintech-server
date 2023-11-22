import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


  class User extends Model {
    static associate(models) {
      User.hasMany(models.Transaction, {
        foreignKey: 'sender_id',
        as: 'sentTransactions',
      });

      User.hasMany(models.Transaction, {
        foreignKey: 'receiver_id',
        as: 'receivedTransactions',
      });

      User.hasOne(models.Wallet, {
        foreignKey: 'user_id',
        as: 'wallet',
      });

      User.hasMany(models.Promotion, {
        foreignKey: 'merchant_id',
        as: 'promotions',
      });
    }
  }

  User.init(
    {
      user_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      user_role: DataTypes.ENUM('merchant', 'user', 'admin'),
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  export default User