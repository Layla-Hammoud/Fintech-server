import express from "express";
import { createSaving, updateSaving, deleteSaving, getAllSavings,getSavingById } from "../controllers/savingController.js";

const savingRoute = express.Router();

savingRoute.get('/viewAll', getAllSavings);

savingRoute.post('/addSaving/:id', createSaving);

savingRoute.patch('/updateSaving/:id', updateSaving);

savingRoute.delete('/delete/:id', deleteSaving);

savingRoute.get('/viewOne/:id', getSavingById);


export default savingRoute