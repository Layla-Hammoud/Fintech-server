import express from 'express';
import { register, login, getUsers, getUser, updateProfile } from '../controllers/userController.js';
import { upload } from '../middlware/multer.js';
import { logInValidation, registerValidation } from '../middlware/authvalidationMiddleware.js';
import { isAuthenticated, isAuthorizedUser} from '../middlware/authMiddleware.js';
const router = express.Router();

router.get('/:id',isAuthenticated, getUser);
router.get('/', isAuthenticated, isAuthorizedUser(['admin']), getUsers);
router.put('/:id/profile', isAuthenticated, isAuthorizedUser(['merchant']), upload.single("image"), updateProfile);
router.post('/signup', registerValidation, register);
router.post("/login", logInValidation, login);


export default router;