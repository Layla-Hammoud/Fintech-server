
import db from '../models/index.js';
import { Sequelize } from 'sequelize';
import validator from 'validator';
import Op  from 'sequelize';
const { TransactionModel, WalletModel, PromotionModel, UserModel } = db;
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);


//function to updateWallet Balance
const updateWalletBalance = async (userId, amountSent, amountReceived, type, role) => {
    const updateFields = {};

    if (type === 'transfer') {
        if (role === 'sender') {
            updateFields.usdtBalance = sequelize.literal(`usdtBalance-${amountReceived}`);
        } else {
            updateFields.usdtBalance = sequelize.literal(`usdtBalance+${amountReceived}`);
        }
    } else if (type === 'deposit') {
        updateFields.usdBalance = sequelize.literal(`usdBalance+${amountSent}`);
    } else if (type === 'transaction') {
        if (role === 'sender') {
            updateFields.usdtBalance = sequelize.literal(`usdtBalance+${amountReceived}`);
            updateFields.usdBalance = sequelize.literal(`usdBalance-${amountSent}`);
        } else {
            updateFields.usdtBalance = sequelize.literal(`usdtBalance-${amountReceived}`);
            updateFields.usdBalance = sequelize.literal(`usdBalance-${amountSent}`);
        }
    } else if (type === 'withdraw') {
        if (role === 'sender') {
            updateFields.usdtBalance = sequelize.literal(`usdtBalance-${amountReceived}`);
        }
        //for receiver!!!!!!!!!!
    }
    console.log(updateFields);
    await WalletModel.update(updateFields, { where: { UserId: userId } });
};


//function to get user by userName
const getUserByUsername = async (username) => {
    const user = await UserModel.findOne({ where: { userName: username } });
    if (!user) {
        throw new Error(`User not found with username: ${username}`);
    }
    return user;
};


//function to check balance before finishing transaction
const checkWalletBalance = async (userId, amountReceived, amountSent) => {
    const senderWallet = await WalletModel.findOne({ where: { UserId: userId } });
    const usdBalance = senderWallet.usdBalance;
    const usdtBalance = senderWallet.usdtBalance;

    return amountReceived > usdtBalance || amountSent > usdBalance;
};


//function to create notification
const createNotification = async (transId, title, message) => {
    ///////////////////////for later
};

const createTransaction = async (req, res) => {
    const usdtRate = 1;
    let promotionDiscount = 1;

    try {
        let { amountSent = 0, amountReceived = 0, type, senderUsername, receiverUsername, status = 'pending', code = 'unavailable' } = req.body;

        const sender = await getUserByUsername(senderUsername);
        const receiver = await getUserByUsername(receiverUsername);

        if (code !== 'unavailable') {
            const promotion = await PromotionModel.findOne({ where: { code: code } });
            if (promotion) {
                promotionDiscount = (1 + (promotion.amount) / 100);
            }
        }

        if (type === 'transaction') {
            amountReceived = amountSent * usdtRate * (promotionDiscount);
        } else if (type === 'transfer') {
            status = 'completed';
        } else if (type === 'deposit') {
            status = 'completed';
        }

        // Validate entry data
        if (!validator.isNumeric(amountSent.toString()) || !validator.isNumeric(amountReceived.toString())) {
            return res.status(400).json({ error: 'Amounts must be numeric' });
        }

        try {
            const permissionTrans = await checkWalletBalance(sender.id, amountReceived, amountSent);
            if (permissionTrans && type !== 'deposit') {
                return res.status(500).json({ error: 'insufficient funds' });
            }

            // Create the transaction only if there are sufficient funds
            const newTrans = await TransactionModel.create({
                amountSent,
                amountReceived,
                type,
                senderId: sender.id,
                receiverId: receiver.id,
                status,
            });

            if (status === 'completed') {// Update wallet balances
                await updateWalletBalance(receiver.id, amountSent, amountReceived, type, 'receiver');
                await updateWalletBalance(sender.id, amountSent, amountReceived, type, 'sender');

                // Create notifications for sender 
                await createNotification(newTrans.id, 'Transaction created', 'You have a new transaction.');
            }

            res.status(200).json({ message: 'Transaction added successfully', data: newTrans });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editTransaction = async (req, res) => {
    try {
        const { id, status } = req.body;
        const editedTrans = await TransactionModel.findByPk(id);

        if (!editedTrans) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const sender = await UserModel.findByPk(editedTrans.senderId);
        const receiver = await UserModel.findByPk(editedTrans.receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Sender or receiver not found' });
        }


        // Validate entry data
        if (!validator.isNumeric(id.toString()) || !validator.isIn(status, ['pending', 'completed', 'canceled'])) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        // Find the transaction by id and update its status
        await editedTrans.update(
            { status: status },
            { where: { id: id } }
        );

        if (editedTrans.status === 'completed') {
            try {
                const permissionTrans = await checkWalletBalance(sender.id, editedTrans.amountReceived, editedTrans.amountSent);
                if (permissionTrans) {
                    return res.status(500).json({ error: 'insufficient funds' });
                }

                else {
                    await updateWalletBalance(sender.id, editedTrans.amountSent, editedTrans.amountReceived, editedTrans.type, 'sender');
                    await updateWalletBalance(receiver.id, editedTrans.amountSent, editedTrans.amountReceived, editedTrans.type, 'receiver');

                    // Create notifications for the sender 
                    await createNotification(editedTrans.id, 'Transaction completed', 'Your transaction has been completed.');

                    res.status(200).json({ message: 'Wallet updated successfully' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Wallet not updated' });
            }
        } else {
            res.status(200).json({ message: 'Transaction updated successfully' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteTransaction = async (req, res) => {
    const { id } = req.body;

    // Validate entry data
    if (!validator.isNumeric(id.toString())) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const foundTrans = await TransactionModel.findByPk(id);
        if (foundTrans.status !== 'completed') {
            try {
                await foundTrans.destroy();
                res.status(200).json({ message: 'Transaction deleted successfully' });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        } else {
            res.status(400).json({ error: 'Transaction confirmed, you are not able to delete it anymore' });
        }
    } catch (error) {
        res.status(400).json({ message: 'No transaction found' });
    }
};

const getTransactions = async (req, res) => {
    const page = req.query.page || 1;
    let limit = 10; // Number of transactions per page

    try {
        const transactions = await TransactionModel.findAndCountAll({
            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            data: transactions.rows,
            totalItems: transactions.count,
            totalPages: Math.ceil(transactions.count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getTransactionMerchant = async (req, res) => {
    const page = req.query.page || 1;
    const userId = req.body.id;
    let limit = 7; // Number of transactions per page

    try {
        const transactions = await TransactionModel.findAndCountAll({
            where: {
                // [sequelize.Op.or]: [
                //     { senderId: userId },
                //     { receiverId: userId }
                // ]
                receiverId:userId
            },
            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            data: transactions.rows,
            totalItems: transactions.count,
            totalPages: Math.ceil(transactions.count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




export { createTransaction, editTransaction, deleteTransaction, getTransactions, getTransactionMerchant };
