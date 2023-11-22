import express from 'express';
import { getUserWallet } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', getUserWallet);

export default router;