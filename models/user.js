import { Model } from 'sequelize';
import bcrypt from "bcryptjs"
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
      image: DataTypes.STRING,
      role: DataTypes.ENUM('merchant', 'user', 'admin'),
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const saltRounds = 10; // Number of salt rounds for hashing
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            user.password = hashedPassword;
          }
        }
    }
   } );
  return User;
}
