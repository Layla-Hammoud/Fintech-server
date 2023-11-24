import db from '../models/index'
const { TransactionModel } = db;

const createTransaction = async (req, res) => {
    const {
        amountSent,
        amountReceived,
        type,
        status,
        senderId,
        receiverId,
    } = req.body;

try{
    const newTrans= await TransactionModel.create({amountSent,amountReceived,type,status,senderId,receiverId});

res.status(200).send({transaction: newTrans});
}catch(error){res.send({error:error})}
}

export {createTransaction}