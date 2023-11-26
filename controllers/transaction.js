import db from '../models/index.js'

const { TransactionModel, WalletModel } = db;

const createTransaction = async (req, res) => {
    const usdtRate = 1;
    let amountReceived;
    try {
        const { amountSent, type, senderId, receiverId } = req.body;
        //amountSent:usd
        //amountReceiver:usdt

        //assign value according to the type of transaction 
        if (type === 'transaction') { amountReceived = amountSent * usdtRate; }
        else if (type === 'transfer') { amountSent = 0; }
        else if (type === 'withdraw') { }

        //add transaction to the database
        const newTrans = await TransactionModel.create(
            { amountSent, amountReceived, type, senderId, receiverId });

        res.status(200).json({ "message": "Transaction added successfully", "data": newTrans });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//function to update balances according to the status of transaction
const updateWalletBalances=async(userId,amountSent,amountReceived,type,status)=>{
    try {

        //changing wallet balance in transaction case
        if (type === 'transaction') {
            const updatedWalletSender = await WalletModel.update({
                [usdBalance]: Sequelize.literal(`${usdBalance}-${amountSent}`),
                [usdtBalance]: Sequelize.literal(`${usdtBalance}+${amountReceived}`)

            }, { where: { UserId: userId } }
            )


            const updatedWalletReceiver = await WalletModel.update({
                [usdBalance]: Sequelize.literal(`${usdBalance}+${amountSent}`),
                [usdtBalance]: Sequelize.literal(`${usdtBalance}-${amountReceived}`)
            },
                { where: { UserId:userId } }
            )
        } else if (type === 'transfer') {
            //changing wallet balance in transfer case

            const updatedWalletSender = await WalletModel.update({
                [usdtBalance]: Sequelize.literal(`${usdtBalance}-${amountReceived}`)

            },
                { where: { UserId:userId } }
            )


            const updatedWalletReceiver = await WalletModel.update({
                [usdtBalance]: Sequelize.literal(`${usdtBalance}+${amountReceived}`)
            },
                { where: { UserId: userId } }
            )
        }
        // Response for 'completed' Transaction
        res.status(200).json({ message: "Transaction and wallet updated successfully", data: editedTrans });
    } catch (error) {
        // Handle errors during wallet updates
        res.status(500).json({ error: error.message });
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

            if (editedTrans.status === 'completed') {
               await updateWalletBalances(editedTrans.senderId,editedTrans.amountSent,editedTrans.amountReceived,editedTrans.type,editedTrans.status)
               await updateWalletBalances(editedTrans.receiverId,editedTrans.amountSent,editedTrans.amountReceived,editedTrans.type,editedTrans.status)
            
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
        res.status(500).json({ error: error.message });
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



//    //getting wallet for each user
//    if (editTransaction.status === 'completed')
//    try {
//        let walletSent = await WalletModel.findOne(send);
//        let walletReceiver = await WalletModel.findByPk(receiverId);

//        if (!walletReceiver || !walletSent) { res.status(404).json({ error: "there is no user has such id" }) }

//    } catch (error) {
//        res.status(500).json({ error: error.message })
//    }