import express from 'express';
import { getUserWallet } from '../Controllers/user.js';

const router = express.Router();

router.get('/:userId', getUserWallet);

export default router;