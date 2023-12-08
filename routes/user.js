import express from 'express';
import { register, login, getUsers, getUser, updateProfile, deleteUser, logout } from '../controllers/userController.js';
import { upload } from '../middlware/multer.js';
import { logInValidation, registerValidation } from '../middlware/authvalidationMiddleware.js';
import { isAuthenticated, isAuthorizedUser} from '../middlware/authMiddleware.js';
const router = express.Router();

router.get('/:id',isAuthenticated, getUser);
router.delete('/:id',isAuthenticated, isAuthorizedUser(['admin']), deleteUser);
router.get('/', isAuthenticated, isAuthorizedUser(['admin']), getUsers);
router.put('/:id/profile', isAuthenticated, isAuthorizedUser(['merchant']), upload.single("image"), updateProfile);
router.post('/signup', registerValidation, register);
router.post("/login", logInValidation, login);
router.post("/logout",logout)

export default router;