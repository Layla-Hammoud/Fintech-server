import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class User extends Model {
  static associate(models) {
    User.hasOne(models.Wallet, {
      foreignKey: 'user_id',
      as: 'wallet',
    });
  }
}

User.init(
  {
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
