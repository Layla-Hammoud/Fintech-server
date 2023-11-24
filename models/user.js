import { Model } from 'sequelize';

export default (sequelize,DataTypes)=>{
  class User extends Model {
    static associate(models) {
      User.hasMany(models.TransactionModel, {
        foreignKey: 'senderId',
        as: 'sentTransactions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      User.hasMany(models.TransactionModel, {
        foreignKey: 'receiverId',
        as: 'receivedTransactions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      User.hasOne(models.WalletModel);

      User.hasMany(models.PromotionModel, {
        foreignKey: 'MerchantId',
        as: 'promotions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  User.init(
    {
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.ENUM('merchant', 'user', 'admin'),
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    }
  );
  return User;
}
