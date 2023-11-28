import express from "express";
import {createPromotion , getAllPromotions , updatePromotion,deletePromotion,getPromotionsByMerchant} from '../controllers/promotionController.js'


const promoRouter = express.Router();


promoRouter.post('/create',createPromotion);
promoRouter.get('/read' ,getAllPromotions);
promoRouter.get('/read/:merchantId',getPromotionsByMerchant);
promoRouter.put('/update', updatePromotion);
promoRouter.delete('/delete', deletePromotion)




export default promoRouter;