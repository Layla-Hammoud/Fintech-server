import db from "../models/index.js";
const { UserModel, PromotionModel } = db
import validator from "validator";



//create new promotion
export const createPromotion = async (req, res) => {
    //request
    const { name, code, amount, detail, startDate, endDate, MerchantId } = req.body;
    //validation for every attribute if it is number or date or string or empty
    if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid input name' })
    }
    if (typeof code !== 'string') {
        return res.status(400).json({ error: 'Invalid input code' })
    }
    if (typeof detail !== 'string') {
        return res.status(400).json({ error: 'Invalid input detail' })
    }
    if (!validator.isISO8601(startDate)) {
        return res.status(400).json({ error: 'Invalid input startDate' })
    }
    if (!validator.isISO8601(endDate)) {
        return res.status(400).json({ error: 'Invalid input endDate' })
    }
    //find merchant by the id from the user table
    try {
        const merchant = await UserModel.findByPk(MerchantId)
        if (!merchant) {
            return res.status(400).json({ error: 'merchant not found' })
        }
        // creation the promotion
        const promotion = await PromotionModel.create({
            name,
            code,
            amount,
            detail,
            startDate,
            endDate,
            MerchantId,
        });
        res.status(201).json({message:'added promotion',data:promotion})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }

}

//get promotions for a specific merchant

export const getPromotionsByMerchant = async (req, res) => {
    //request
    const { merchantId } = req.params;

    //validation for merchantId is not number or empty
    if (!validator.isInt(merchantId.toString())) {
        return res.status(400).json({ error: 'Please enter a valid number for merchantId' });
    }

    try {
        // Extracting pagination parameters from the request query
        const { page = 1, pageSize = 10 } = req.query;

        // Calculating the offset based on the page number and page size
        const offset = (page - 1) * pageSize;

        // Fetching promotions  for a specific merchant by  (merchantId) with pagination
        const promotions = await PromotionModel.findAll({
            where: {
                MerchantId: merchantId,
            },
            offset,
            limit: parseInt(pageSize)
        });
        // condition to check if i have promotions
        if (promotions.length > 0) {
            res.status(200).json({ Promotions: promotions });
        } else {
            console.log(`No promotions found for merchant with ID ${merchantId}`);
            res.status(404).json({ error: 'No promotions found for the specified merchant' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
};

//get all promotions
export const getAllPromotions = async (req, res) => {
    //pagination
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const promotions = await PromotionModel.findAll({
            offset,
            limit: parseInt(pageSize),
            include: [{ model: UserModel, as: "merchant" }]
        });
        if (promotions) {
            res.status(200).json({ Promotions: promotions })
        }
        else {
            console.log('promotions not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Internel Server Error')
    }
}

//update promotion by Id

export const updatePromotion = async (req, res) => {

    //request
    const { id, name, code, amount, detail, startDate, endDate } = req.body;

    //validation for every attribute
    if (!validator.isInt(id.toString())) {
        return res.status(400).json({ error: 'Invalid input id' })
    }
    if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid input name' })
    }
    if (typeof code !== 'string') {
        return res.status(400).json({ error: 'Invalid input code' })
    }
    if (!validator.isNumeric(amount.toString())) {
        return res.status(400).json({ error: 'Invalid input amount' })
    }
    if (typeof detail !== 'string') {
        return res.status(400).json({ error: 'Invalid input detail' })
    }
    if (!validator.isISO8601(startDate)) {
        return res.status(400).json({ error: 'Invalid input startDate' })
    }
    if (!validator.isISO8601(endDate)) {
        return res.status(400).json({ error: 'Invalid input endDate' })
    }

    //checking if promotion exists or not
    try {
        const promotion = await PromotionModel.findByPk(id);

        if (!promotion) {
            return res.status(404).json({ error: 'Promotion not found' });
        }
        //update promotion 
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
        //condition check if i have updated 
        if (editPromotion)
            return res.status(200).json({ message: 'Promotion updated successfully' });
        else
            return res.status(400).send('Error occured!')
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Delete promotion by ID
export const deletePromotion = async (req, res) => {

    //request
    const id = req.body.id

    // Validation using validator
    //check if id is not number or empty return message to enter valid id
    if (!validator.isInt(id.toString())) {
        return res.status(400).json({ error: 'Please enter a valid number for id' });
    }
    //find promotion by id and deleted
    try {
        const deletePromotionById = await PromotionModel.destroy({ where: { id: id } });
        if (deletePromotionById > 0) {
            res.status(200).json({ message: 'Promotion deleted successfully' })
        } else {
            res.status(404).json({ error: 'Promotion not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}