// import { DatabaseError } from 'sequelize';
import db from '../models/index.js'

const {UserModel,WalletModel} = db

const getUserWallet=async(req, res)=>{
    try {
     const id = req.params.id;
     console.log(id);
      const userWallet = await WalletModel.findAll();
      if (userWallet) { 
        res.status(200).json({ user:userWallet});
      } else {
        console.log('User not found');
      }
      
  
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
 
  export { getUserWallet };
