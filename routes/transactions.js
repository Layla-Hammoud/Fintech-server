import express from 'express'
import { createTransaction,deleteTransaction,editTransaction, getTransaction } from '../controllers/transaction.js'

const router=express.Router();

router.post('/',createTransaction);
router.put('/edit-transaction',editTransaction)
router.delete('/delete-transaction',deleteTransaction)
router.get('/',getTransaction)
export default router;