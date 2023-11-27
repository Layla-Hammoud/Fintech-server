import express from "express";
import {createPromotion , getAllPromotions , getPromotionById, updatePromotion,deletePromotion} from '../controllers/promotionController.js'


const promoRouter = express.Router();


promoRouter.post('/create',createPromotion);
promoRouter.get('/read' ,getAllPromotions);
promoRouter.get('/read/:id' , getPromotionById);
promoRouter.put('/update'/updatePromotion);
promoRouter.delete('/delete', deletePromotion)




export default promoRouter;