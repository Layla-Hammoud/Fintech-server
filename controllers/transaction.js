import db from '../models/index.js'
import { Sequelize } from 'sequelize';
const { TransactionModel, WalletModel } = db;
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
    }
);
//function to update balances according to the status of transaction
const updateWalletBalanceSender = async (userId, amountSent, amountReceived, type) => {

    //changing wallet balance in transaction case
    if (type === 'transaction') {

        await WalletModel.update({
            usdBalance: sequelize.literal(`usdBalance-${amountSent}`),
            usdtBalance: sequelize.literal(`usdtBalance-${amountReceived}`),
        }, { where: { UserId: userId } }
        )

    } else if (type === 'transfer') {
        //changing wallet balance in transfer case

        const updatedWalletSender = await WalletModel.update({
            usdtBalance: sequelize.literal(`usdtBalance-${amountReceived}`)

        },
            { where: { UserId: userId } }
        )

    } else if (type === 'withdraw') {
        const updatedWalletSender = await WalletModel.update({
            usdtBalance: sequelize.literal(`usdtBalance-${amountReceived}`)

        },
            { where: { UserId: userId } }
        )
    } else if (type === 'deposit') {
        const updatedWalletSender = await WalletModel.update({
            usdBalance: sequelize.literal(`usdBalance+${amountSent}`),


        },
            { where: { UserId: userId } }
        )
    }

}

const createTransaction = async (req, res) => {
    const usdtRate = 1;
    const unavailableAmount = 0.00;

    try {
        let { amountSent, amountReceived, type, senderId, receiverId, status } = req.body;
        //amountSent:usd
        //amountReceiver:usdt

        //assign value according to the type of transaction 
        if (type === 'transaction') { amountReceived = amountSent * usdtRate; }
        else if (type === 'transfer') { amountSent = unavailableAmount; }
        else if (type === 'withdraw') { amountSent = unavailableAmount; }
        else if (type === 'deposit') { status = 'completed'; await updateWalletBalanceSender(senderId, amountSent, amountReceived, type) }

        //add transaction to the database
        const newTrans = await TransactionModel.create(
            { amountSent, amountReceived, type, senderId, receiverId, status });


        res.status(200).json({ "message": "Transaction added successfully", "data": newTrans });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



const updateWalletBalanceReceiver = async (userId, amountSent, amountReceived, type) => {

    //changing wallet balance in transaction case
    if (type === 'transaction') {

        await WalletModel.update({
            usdBalance: sequelize.literal(`usdBalance-${amountSent}`),
            usdtBalance: sequelize.literal(`usdtBalance-${amountReceived}`),
        },
            { where: { UserId: userId } }
        )
    } else if (type === 'transfer') {
        //changing wallet balance in transfer case


        await WalletModel.update({
            usdtBalance: sequelize.literal(`usdBalance+${amountReceived}`)
        },
            { where: { UserId: userId } }
        )
    }

}

const editTransaction = async (req, res) => {

    try {
        //update trans status
        const { id, status } = req.body;
        const updatedTrans = await TransactionModel.update(
            { status: status },
            { where: { id: id } }
        )
        if (updatedTrans > 0) {
            const editedTrans = await TransactionModel.findByPk(id);
            console.log(editedTrans.status)
            if (editedTrans.status === 'completed') {
                console.log(editedTrans.status)

                try {
                    let senderWallet = await updateWalletBalanceSender(editedTrans.senderId, editedTrans.amountSent, editedTrans.amountReceived, editedTrans.type)
                    let receiverWallet = await updateWalletBalanceReceiver(editedTrans.receiverId, editedTrans.amountSent, editedTrans.amountReceived, editedTrans.type) 
                    res.status(200).json({ message: "wallet updated successfully" });
                }
                catch (error) { res.status(500).json({ error: 'wallett not up' }) }

            } else {
                // Response for incomplete transaction
                res.status(200).json({ message: "Transaction updated successfully", data: editedTrans });
            }
        } else {
            // Response when the transaction is not found
            res.status(404).json({ message: "Transaction not found" });
        }
    } catch (error) {
        // Handle errors during the main transaction update
        res.status(500).json({ error: 'ggggggg' });
    }
};

const deleteTransaction = async (req, res) => {
    const { id } = req.body;
    try {
        const findedTrans = await TransactionModel.findByPk(id);
        if (findedTrans.status !== 'completed') {
            try {
                await findedTrans.destroy();
                res.status(200).json({ message: "Transaction deleted successufly" });
            } catch (error) {

                res.status(400).json({ error: error.message })
            }
        } else {
            res.status(400).json({ error: "Transaction confirmed, you are not able to delete it anymore" })
        }
    } catch (error) {
        res.status(400).json({ message: "No transaction found " })
    }


}

const getTransaction = async (req, res) => {
    try {
        const transactions = await TransactionModel.findAll();
        res.status(200).json({ data: transactions });

    } catch (error) { res.status(400).json({ message: "there is no transaction yet" }) }
}

export { createTransaction, editTransaction, deleteTransaction, getTransaction }


