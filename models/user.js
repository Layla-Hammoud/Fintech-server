import { Model } from 'sequelize';

export default (sequelize,DataTypes)=>{
  class User extends Model {
    static associate(models) {
      // User.hasMany(models.Transaction, {
      //   foreignKey: 'sender_id',
      //   as: 'sentTransactions',
      // });

      // User.hasMany(models.Transaction, {
      //   foreignKey: 'receiver_id',
      //   as: 'receivedTransactions',
      // });

      User.hasOne(models.WalletModel);

      // User.hasMany(models.Promotion, {
      //   foreignKey: 'merchant_id',
      //   as: 'promotions',
      // });
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
