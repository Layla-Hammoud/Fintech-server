import express from 'express'
import { isAuthenticated, isAuthorizedUser} from '../middlware/authMiddleware.js';
import { createTransaction,deleteTransaction,editTransaction, getTransactionMerchant, getTransactions } from '../controllers/transaction.js'

const router=express.Router();

router.post('/',isAuthenticated,isAuthorizedUser(['user','merchant']),createTransaction);
router.put('/edit-transaction',isAuthenticated,isAuthorizedUser(['merchant']),editTransaction)
router.delete('/delete-transaction',isAuthenticated,isAuthorizedUser(['user','merchant','admin']),deleteTransaction)
router.get('/',isAuthenticated,isAuthorizedUser(['user','merchant','admin']),getTransactions)
router.get('/transactionsForMerchant',isAuthenticated,isAuthorizedUser(['user','merchant','admin']),getTransactionMerchant)

export default router;