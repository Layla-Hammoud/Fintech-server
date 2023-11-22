'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Saving extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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

  Saving.associate = (models) => {
    Saving.belongsTo(models.Wallet, {
      foreignKey: 'wallet_id', // The foreign key in Saving referencing Wallet
      as: 'wallet', // Alias for the association
    });
  };

  return Saving;
};