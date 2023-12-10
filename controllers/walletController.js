import db from "../models/index.js";
import wallet from "../models/wallet.js";

const {WalletModel} = db;

export const createWallet = async (req, res) => {
    try{
        const{ UserId, usdBalance, usdtBalance} = req.body;
        if (!UserId || ! usdBalance || !usdtBalance){
            return res.status(400).json({
                error : "All Fields are required!!"
            })
        } 
        const wallet = await WalletModel.create({UserId, usdBalance, usdtBalance});
        return res.status(200).json({success: true, data: wallet});
    }catch(error){
        console.log(error);
        return res.status(500).send({success: false, error: "internal server error"});
    }
};

export const getWalletById = async (req, res) => {
    try{
        const {id} = req.userData;
        
        const wallet = await WalletModel.findOne({
            where: {UserId: id},
        }); 

        if(!wallet){
            return res.status(404).send({ success: false , error: "wallet not found"});
            
        }
        return res.status(200).json({ success: true, data: wallet});
    }catch(error){
        console.log(error);
        return res.status(500).send({ success: false, error: "internal server error"})
    } 
};


export const getWallet = async (req , res) => {
    try {
        const wallet = await WalletModel.findAll()
        return res.status(200).json({
            data : wallet
        })
    } catch (error) {
        return res.status(500).json({
            err: error
        })
    }
}

export const deleteWalletById = async (req, res) => {
    try{
        const id= req.params.id;
        if(!id){
            return res.status(400).json({
                error : "No user found"
            })
        }
        const wallet = await WalletModel.findOne({
            where : {userId: id},

        });

        if(!wallet){
            return res.status(404).json({success: false, error: "wallet not found"});
        }
        await wallet.destroy();
        return res.status(200).json({success: true, message : `wallet ${wallet.id} deleted successfuly`});
    }catch(error){
        return res.status(500).json({success: false, error: "internal server error"});
    }
}

// export const updateUsdBalance = async (req, res) => {
//     try{
//         const userId = req.params.userId;
//         const { usdBalance } = req.body;
//         const wallet = await WalletModel.findOne({
//             where : {userId: userId},

//         });

//         if(!wallet){
//             return res.status(404).json({message: "wallet not found" });
//         }
//         wallet.usdBalance= usdBalance;
//         await wallet.save();
//         return res.status(200).json({message: "USD balance updated successfully"});

//     }catch(error){
//         return res.status(500).json({message: "internal server error"});
//     }

// }

// export const updateUsdtBalance = async (req, res) => {
//     try{
//         const userId = req.params.userId;
//         const { usdtBalance } = req.body;
//         if (!userId){
//             return res.status(400).json({
//                 error : "No user specified"
//             })
//         }
//         const wallet = await WalletModel.findOne({
//             where : {UserId: userId},
//         });
//         if(!usdtBalance){
//             return res.status(400).json({
//                 error : "All Fileds are required"
//             })
//         }
//         if(!wallet){
//             return res.status(404).json({message: "wallet not found" });
//         }
//         // wallet.usdtBalance= usdtBalance;
//         // await wallet.save();
//         WalletModel.update({
//             usdtBalance : usdtBalance
//         } , {
//             where : {UserId : userId}
//         })
//         return res.status(200).json({message: `USDT balance updated successfully`});

//     }catch(error){
//         return res.status(500).json({message: "internal server error"});
//     }

// }