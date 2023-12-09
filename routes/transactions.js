import express from 'express'
import { createTransaction,deleteTransaction,editTransaction, getTransactions,getTransactionUser } from '../controllers/transaction.js'

const router=express.Router();

router.post('/',createTransaction);
router.put('/edit-transaction',editTransaction)
router.delete('/delete-transaction',deleteTransaction)
router.get('/',getTransactions)
router.get('/transactionForUser',getTransactionUser)
export default router;