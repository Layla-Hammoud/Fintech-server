import express from 'express'
import { isAuthenticated, isAuthorizedUser} from '../middlware/authMiddleware.js';
import { createTransaction,deleteTransaction,editTransaction, getTransactionUser, getTransactions } from '../controllers/transaction.js'

const router=express.Router();
// isAuthenticated,isAuthorizedUser(['user','merchant']),
router.post('/',createTransaction);
router.put('/edit-transaction',isAuthenticated,isAuthorizedUser(['merchant']),editTransaction)
router.delete('/delete-transaction',isAuthenticated,isAuthorizedUser(['user','merchant','admin']),deleteTransaction)
router.get('/',getTransactions)
router.get('/transactionForUser',getTransactionUser)

export default router;