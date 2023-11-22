import sequelize from "./config/db.js";
import express from "express";
import "dotenv/config.js";
import cors from "cors";
// Create an instance of Express
const app = express();
import userRoutes from './Routers/user.js'


app.use(express.json());
app.use(cors());
app.get('/t',(req,res)=>{res.send('hello')})
app.use('/users',userRoutes)

// Define your routes or other middleware here

// Define the port where your application will listen
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});