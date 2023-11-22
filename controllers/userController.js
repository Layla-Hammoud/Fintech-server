import  User  from '../models/user.js';
import Wallet from '../models/wallet.js';
// function for retrieving a user with their wallet
const getUserWallet=async(req, res)=>{
    try {
      const userId = req.params.userId; 
      const userWallet = await Wallet.findByPk(userId, { include: 'user' });
      res.status(200).json({ userWallet :userWallet });
  
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
  
  export { getUserWallet };
