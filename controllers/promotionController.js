import db from "../models/index.js";
const {UserModel,PromotionModel} = db
import {check , validationResult} from 'express-validator'




//create promotion
export const createPromotion = async(req,res)=>{
    await Promise.all([
        check('id').notEmpty().isInt().withMessage('please enter a valid number for id').run(req),
        check('name', 'code').notEmpty().withMessage('please enter a valid name').run(req),
        check('amount').notEmpty().isNumeric().withMessage('please enter a valid amount').run(req),
        check('startDate', 'endDate').notEmpty().isISO8601().withMessage('enter a valid Date').run(req)
    ])

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    //request
    const{name,code,amount,detail,startDate,endDate,MerchantId} = req.body;
 
    try{
        const merchant = await UserModel.findByPk(MerchantId)
        if (!merchant){
            return res.status(400).json({error : 'merchant not found'})
        }
        const promotion = await PromotionModel.create({
            name,
            code,
            amount,
            detail,
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
    // Validation using express-validator
    await Promise.all([
        check('id').notEmpty().isInt().withMessage('please enter a valid number for id').run(req),
    ]);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.body.id
    try{
        const promotions = await PromotionModel.findByPk(id);
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

export const updatePromotion = async (req, res) => {

    await Promise.all([
        check('id').notEmpty().isInt().withMessage('please enter a valid number for id').run(req),
        check('name', 'code').notEmpty().withMessage('please enter a valid name').run(req),
        check('amount').notEmpty().isNumeric().withMessage('please enter a valid amount').run(req),
        check('startDate', 'endDate').notEmpty().isISO8601().withMessage('enter a valid Date').run(req)
    ])

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const { id,name, code, amount, detail, startDate, endDate } = req.body;
    try {
      const promotion = await PromotionModel.findByPk(id);
  
      if (!promotion) {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      const editPromotion = await PromotionModel.update({
        name,
        code,
        amount,
        detail,
        startDate,
        endDate
      },
      {
        where: { id: id }
      })
    if (editPromotion)
        return res.status(200).json({ message: 'Promotion updated successfully' });
    else
        return res.status(400).send('Error occured!')
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
//Delete promotion by ID
export const deletePromotion = async(req,res)=>{
    // Validation using express-validator
    await Promise.all([
        check('id').notEmpty().isInt().withMessage('please enter a valid number for id').run(req),
    ]);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id =req.body.id
    try{
        const deletePromotionById = await PromotionModel.destroy({ where: { id: id } });
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