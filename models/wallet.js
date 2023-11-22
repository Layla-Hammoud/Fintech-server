import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      Wallet.hasMany(models.Saving, {
        foreignKey: 'wallet_id',
        as: 'savings',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Wallet.init(
    {
      user_id: DataTypes.INTEGER,
      usdBalance: DataTypes.INTEGER,
      usdtBalance: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Wallet',
    }
  );

export default Wallet
