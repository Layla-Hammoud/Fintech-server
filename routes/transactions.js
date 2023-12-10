import express from 'express'
import { isAuthenticated, isAuthorizedUser} from '../middlware/authMiddleware.js';
import { createTransaction,deleteTransaction,editTransaction, getTransactionMerchant, getTransactions,getTransactionUser } from '../controllers/transaction.js'

const router=express.Router();
// isAuthenticated,isAuthorizedUser(['user','merchant']),
router.post('/',createTransaction);
router.put('/edit-transaction',editTransaction)
router.delete('/delete-transaction',isAuthenticated,isAuthorizedUser(['user','merchant','admin']),deleteTransaction)
router.get('/',isAuthenticated,isAuthorizedUser(['user','merchant','admin']),getTransactions)
router.get('/transactionForMerchant',getTransactionMerchant)
router.get('/transactionForUser/:id',getTransactionUser)
//isAuthenticated,isAuthorizedUser(['user','merchant','admin'])
export default router;