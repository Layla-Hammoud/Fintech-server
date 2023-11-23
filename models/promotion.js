import { Model, DataTypes } from 'sequelize';
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promotion.belongsTo(models.User, {
        foreignKey: 'merchant_id', // The foreign key in Promotion referencing User (merchant)
        as: 'merchant', // Alias for the association
      });
    }
  }
  Promotion.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    promotionDetail: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    merchant_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Promotion',
  });

export default Promotion;