import db from "../models/index.js";
import validator from "validator";
//import saving from "../models/saving.js";
//import Wallet from "../models/wallet.js";

const {SavingModel,WalletModel} = db;

export const getAllSavings = async (req, res) => {
    try{
        const savings = await SavingModel.findAll();
        return res.status(200).json({
            success: true, 
            data: savings });
    }catch(error){
        return res.status(500).json({ 
            success: false, 
            error: "internal server error"});

    }
}

export const getSavingById = async (req , res) => {
    try{
        const savingId = req.params.id;
        const saving = await SavingModel.findOne({
            where : {id: savingId},
        })
        if(!saving){
            return res.status(404).json({ 
                success: false, 
                error: "saving not found"});
        }
        return res.status(200).json({
            success: true, 
            data: saving });
    }catch(error){
        return res.status(500).json({
            success: false, 
            error: "internal server error"});
    }
    
};

export const createSaving = async (req , res) => {
    try{
        const{ title, goalAmount}= req.body;
        const WalletId = req.params.id;

        if(!validator.isLength(title,{min: 1})){
            return res.status(400).json({
                success: false,
                error: "title can not be empty",
            });
        }

        if(!validator.isNumeric(goalAmount)){
            return res.status(400).json({
                success: false,
                error: "goalAmount must be a number",
            });
        }

        const numericGoalAmount = parseFloat(goalAmount);
        if(numericGoalAmount <=0){
            return res.status(400).json({
                success: false,
                error: "goal amount must be greater than 0",
            });
        }
        const newSaving = await SavingModel.create({
            title,
            goalAmount: numericGoalAmount,
            amount: 0,
            status: 'incompleted',
            WalletId,
        });
        return res.status(200).json({
            success: true, 
            data: newSaving});

    }catch(error){
        return res.status(500).json({
            success: false, 
            error: "internal server error"})

    }
};

export const updateSaving = async (req, res) => {
    try{
        const savingId = req.params.id;
        const {amount} = req.body;
        const saving = await SavingModel.findOne({
            where : {id : savingId},
        });

        if(!saving){
            return res.status(500).json({
                success: false,
                error: "saving not found"})
        }

        if (saving.status === "completed") {
            return res.status(400).json({
                success: false,
                error: "Saving is already completed. Cannot add more amount.",
            });
        }

        if(!validator.isNumeric(amount)){
            return res.status(400).json({
                success: false,
                error: "Amount must be anumber",
            })
        }

        const numericAmount = parseFloat(amount);
        if(numericAmount <= 0){
            return res.status(400).json({
                success: false,
                error: "Amount must be greater than 0",
            });
        }

        
        
        const wallet = await WalletModel.findByPk(saving.WalletId);
        if(amount > wallet.usdtBalance){
            return res.status(400).json({
                success: false,
                error: "amount exceeds available USDT balance in your wallet"
            })
        }

        saving.amount+= amount;
        wallet.usdtBalance -= amount;
        await wallet.save();
        if(saving.amount>saving.goalAmount){
            return res.status(400).json({
                success: false,
                error: "amount exceeds the amountGoal"
            })
            
        }
        await saving.save();

        if(saving.amount === saving.goalAmount){
            saving.status = "Completed";
            
        }
        await saving.save();

        wallet.usdtBalance -= amount;
        await wallet.save();

        return res.status(200).json({
            success: true, 
            data: saving});

    }catch(error){
        return res.status(500).json({
            success: false,
            error: "internal server error"})
    }
}

export const deleteSaving = async (req, res) => {
    try{
        const savingId = req.params.id;
        const saving = await SavingModel.findOne({
            where : {id : savingId},
        })
        if(!saving){
            return res.status(404).json({
                success: false, error: "saving not found"
            });
        }

        const wallet = await WalletModel.findByPk(saving.WalletId)
        
        wallet.usdtBalance += saving.amount;
        await wallet.save();
        await saving.destroy();

        return res.status(200).json({
            success: true, 
            message: "saving deleted successfully"});


    }catch(error){
        return res.status(500).json({
            success: false,
            error: "internal server error"})

    }
}