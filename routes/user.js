import express from 'express';
import { register, login, getUsers, getUser, updateProfile } from '../controllers/userController.js';
import { upload } from '../middlware/multer.js';
import { logInValidation, registerValidation } from '../middlware/authvalidation.middleware.js';
import { authenticateToken } from '../middlware/auth.middleware.js';
const router = express.Router();

router.get('/:id', getUser);
router.get('/', getUsers);
router.put('/:id/profile', authenticateToken, upload.single("image"), updateProfile);
router.post('/signup', registerValidation, register);
router.post("/login", logInValidation, login);



export default router;