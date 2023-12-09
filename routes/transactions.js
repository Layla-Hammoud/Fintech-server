import express from 'express'
import { isAuthenticated, isAuthorizedUser} from '../middlware/authMiddleware.js';
import { createTransaction,deleteTransaction,editTransaction, getTransactionMerchant, getTransactions } from '../controllers/transaction.js'

const router=express.Router();
// isAuthenticated,isAuthorizedUser(['user','merchant']),
router.post('/',createTransaction);
router.put('/edit-transaction',isAuthenticated,isAuthorizedUser(['merchant']),editTransaction)
router.delete('/delete-transaction',isAuthenticated,isAuthorizedUser(['user','merchant','admin']),deleteTransaction)
router.get('/',isAuthenticated,isAuthorizedUser(['user','merchant','admin']),getTransactions)
router.get('/transactionForMerchant/:id',getTransactionMerchant)
//isAuthenticated,isAuthorizedUser(['user','merchant','admin'])
export default router;