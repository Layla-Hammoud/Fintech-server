import { Model, DataTypes } from 'sequelize';

export default (sequelize,DataTypes)=>{
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.UserModel, {
        foreignKey: 'UserId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Wallet.hasMany(models.Saving, {
      //   foreignKey: 'wallet_id',
      //   as: 'savings',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
    }
  }

  Wallet.init(
    {
      UserId: DataTypes.INTEGER,
      usdBalance: DataTypes.INTEGER,
      usdtBalance: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Wallet',
    }
    
  );
 return Wallet;
  }

