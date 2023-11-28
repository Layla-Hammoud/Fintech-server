import express from 'express'
import { createNotification,deleteNotification,editNotification, getNotification } from '../controllers/notifications.js'

const router=express.Router();

router.post('/',createNotification);
router.put('/edit-Notification',editNotification)
router.delete('/delete-Notification',deleteNotification)
router.get('/',getNotification)
export default router;