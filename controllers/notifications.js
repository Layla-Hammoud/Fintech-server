
import db from '../models/index.js'
const { NotificationModel } = db

const getNotification = async (req, res) => {
    try {
        const Notifications = await NotificationModel.findAll();
        res.status(200).json({ data: Notification });

    } catch (error) { res.status(404).json({ message: "there is no Notification yet" }) }
}


const deleteNotification = async (req, res) => {
    const { id } = req.body;
    try {
        const findedNotification = await NotificationModel.findByPk(id);
        await findedNotification.destroy();
        res.status(200).json({ message: "Notification deleted successufly" });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }


}

const createNotification = async (req, res) => {

    try {
        const { TransactionId, title, message } = req.body;

        const newNotification = await NotificationModel.create(
            { TransactionId, title, message });

        res.status(200).json({ "message": "Notification added successfully", "data": newNotification });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const editNotification = async (req, res) => {

    try {

        const { id, title, message } = req.body;
        const updatedNotification = await NotificationModel.update(
            {
                title: title,
                message: message
            },
            { where: { id: id } })

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
        
export { createNotification, editNotification, deleteNotification, getNotification }