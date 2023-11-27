import db from "../models/index.js";
const {UserModel,PromotionModel} = db

//create promotion
export const createPromotion = async(req,res)=>{
    //request
    const{name,code,amount,promotionDetail,startDate,endDate,MerchantId} = req.body;
    //check if present in request body
    if(!name || !code || !amount || ! promotionDetail || !startDate || ! endDate || ! MerchantId){
        return res.status(400).json({ error: "Missing required fields" });
    }
    //create promotion
    try{
        const merchant = await UserModel.findByPk(MerchantId)
        if (!merchant){
            return res.status(400).json({error : 'merchant not found'})
        }
        const promotion = await PromotionModel.create({
            name,
            code,
            amount,
            promotionDetail,
            startDate,
            endDate,
            MerchantId,
        });
        res.status(201).json(promotion)
    }catch(error){
        console.error(error)
        res.status(500).json({error:'Internal Server Error'})
    }
    
}
//get all promotions
export const getAllPromotions = async(req,res)=> {
    try{
        const promotions = await PromotionModel.findAll();
        if(promotions){
            res.status(200).json({Promotions: promotions})
        }
        else{
            console.log('promotions not found');
        }
    }catch(error){
        console.log(error);
        res.status(500).json('Internel Server Error')
    }
}

//get promotion by id

export const getPromotionById = async(req,res)=>{
    const {id} = req.params;
    try{
        const promotions = await PromotionModel.findByPk(id ,{include : UserModel});
        if(promotions){
            res.status(200).json({promotion:promotions})
        }else{
            res.status(404).json({ error: 'Promotion not found' });
        } 
    }catch (error){
        console.error(error);
        res.status(500).json({error:'Internal Server Error'})
    }
}

//update promotion by Id
export const updatePromotion = async(req,res)=>{
    const {id} =req.params;
    try{
       const updatePromotionById = await PromotionModel.findByPk(id);
       if (!updatePromotionById){
        return res.status(404).json({ error: 'Promotion not found' });
       }await PromotionModel.update(req.body, { fields: ['name', 'code', 'amount', 'promotionDetail', 'startDate', 'endDate'] });
       res.status(200).json({ message: 'Promotion updated successfully' });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     
    }
}
//Delete promotion by ID
export const deletePromotion = async(req,res)=>{
    const {id} =req.params;
    try{
        const deletePromotionById = await PromotionModel.destroy({where: {id}});
        if (deletePromotionById > 0){
            res.status(200).json({message : 'Promotion deleted successfully'})
        }else{
            res.status(404).json({error : 'Promotion not found'})
        }
    }catch(error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}