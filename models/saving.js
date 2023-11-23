import { Model, DataTypes } from 'sequelize';
  class Saving extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Saving.belongsTo(models.Wallet, {
        foreignKey: 'wallet_id', // The foreign key in Saving referencing Wallet
        as: 'wallet', // Alias for the association
      });
    }
  }
  Saving.init({
    title: DataTypes.STRING,
    goalAmount: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: DataTypes.ENUM('completed', 'incompleted'),
    wallet_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Saving',
  });


  export default Saving;