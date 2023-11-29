import express from 'express'
import { createTransaction,deleteTransaction,editTransaction, getTransactions } from '../controllers/transaction.js'

const router=express.Router();

router.post('/',createTransaction);
router.put('/edit-transaction',editTransaction)
router.delete('/delete-transaction',deleteTransaction)
router.get('/',getTransactions)
export default router;