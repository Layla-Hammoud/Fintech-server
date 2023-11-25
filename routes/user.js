import express from 'express';
import { register, login, getUsers, getUser, updateProfile } from '../controllers/userController.js';
import { upload } from '../middlware/multer.js';

const router = express.Router();

router.get('/:id', getUser);
router.get('/', getUsers);
router.put('/:id/profile',upload.single("image"), updateProfile);
router.post('/signup', register);
router.post("/login", login);



export default router;