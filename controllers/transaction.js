import db from '../models/index.js'

const { TransactionModel } = db;

const createTransaction = async (req, res) => {
    //trans set by user amountSent==amount in USD to buy usdt type:transaction sender:user receiver :merchant status:pending until merchant change it 
    //remove status type and amountReceived 
    try {
        const { amountSent, type, senderId, receiverId, createdAt, updatedAt } = req.body;
        const amountReceived = amountSent;//amountReceived : amount sent by merchant to user in usdt
        const newTrans = await TransactionModel.create(
            { amountSent, amountReceived, type, senderId, receiverId, createdAt, updatedAt });

        res.status(200).json({ "message": "Transaction added successfully", "data": newTrans });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const editTransaction = async (req, res) => {

    try {
        const { id, status } = req.body;
        const updatedTrans = await TransactionModel.update({
            status: status
        },
            {
                where: {
                    id: id
                }
            }
        )
        res.status(200).json({ "message": "Transaction Edited successfully", "data": updatedTrans });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const deleteTransaction = async (req, res) => {
    const { id } = req.body;
    const findedTrans = await TransactionModel.findByPk(id);
    if (findedTrans.status !== 'confirmed') {
        try {
            await findedTrans.destroy();
            res.status(200).jon({ message: "Transaction deleted successufly" });
        } catch (error) {

            res.status(400).json({ error: error.message })
        }
    } else {
        res.status(400).json({ error: "Transaction confirmed, you are not able to delete it anymore" })
    }

}


export { createTransaction, editTransaction, deleteTransaction }