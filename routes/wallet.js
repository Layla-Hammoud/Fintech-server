import express from "express";
//const walletController = require ('../controllers/walletController');
import { deleteWalletById, getWalletById, createWallet , getWallet} from "../controllers/walletController.js";

const walletRoute = express.Router();

walletRoute.get('/view/:id', getWalletById);

walletRoute.get('/viewALl', getWallet);

walletRoute.post('/add', createWallet);

walletRoute.delete('/delete/:id', deleteWalletById);

export default walletRoute;

