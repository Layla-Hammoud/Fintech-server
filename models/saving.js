import { Model, DataTypes } from 'sequelize';
export default (sequelize,DataTypes)=>{

  class Saving extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Saving.belongsTo(models.WalletModel, {
        foreignKey:'WalletId', // The foreign key in Saving referencing Wallet
        as: 'wallet', // Alias for the association
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Saving.init({
    title: DataTypes.STRING,
    goalAmount: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: DataTypes.ENUM('completed', 'incompleted'),
    WalletId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Saving',
  });


  return Saving;
}