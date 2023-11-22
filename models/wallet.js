
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Wallet extends Model {
  static associate(models) {
    Wallet.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      allowNull: false,
    });
  }
}

Wallet.init(
  {
    usdBalance: DataTypes.INTEGER,
    usdtBalance: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    saving_id: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'Wallet',
  }
);

export default Wallet;