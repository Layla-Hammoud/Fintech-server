import { Model, DataTypes } from 'sequelize';
export default (sequelize,DataTypes)=>{

  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
   
      Promotion.belongsTo(models.UserModel, {
        foreignKey: 'MerchantId', // The foreign key in Promotion referencing User (merchant)
        as: 'merchant', // Alias for the association
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Promotion.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    detail: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    MerchantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Promotion',
  });

return Promotion;
}