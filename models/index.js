import { Sequelize } from "sequelize";
import 'dotenv/config'
import User from './user.js'
import Wallet from './wallet.js'



// Your Sequelize configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);


const UserModel = User(sequelize,Sequelize)
const WalletModel = Wallet(sequelize,Sequelize)

const db = {
  sequelize,
  Sequelize,
  UserModel,
  WalletModel
}

Object.keys(db).forEach((modelName) =>{
  if(db[modelName].associate) {
    db[modelName].associate(db)
  }
  })

export default db;