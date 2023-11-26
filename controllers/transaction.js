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
       if(updatedTrans>0) {const editedTrans=await TransactionModel.findByPk(id);
        res.status(200).json({ "message": "Transaction Edited successfully", "data": editedTrans });}
       else { res.status(404).json({ "message": "Transaction not found" });}

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


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