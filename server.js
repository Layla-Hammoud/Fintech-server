import express from "express";
import "dotenv/config.js";
import cors from "cors";
import userRoute from './routes/user.js'
import walletRoute from './routes/wallet.js';
import savingRoute from './routes/saving.js';
import db from './models/index.js'
import morgan from "morgan";
// Create an instance of Express
const app = express();



app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

app.use("/api/users", userRoute); 
app.use("/api/wallet", walletRoute);
app.use("/api/saving", savingRoute);


//the port where your application will listen
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, async() => {
  console.log(`Server is running on port ${port}`);
  console.log("connecting to the DB")
  await db.sequelize.sync()
  console.log("connected")
}); 