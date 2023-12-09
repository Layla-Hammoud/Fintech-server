import express from "express";
import "dotenv/config.js";
import cors from "cors";
import userRoute from './routes/user.js'
import promoRouter from "./routes/promotionRouter.js";
// import db from './models/index.js'
// import walletRoute from "./routes/wallet.js";
// import savingRoute from "./routes/saving.js";
// import promoRouter from "./routes/promotionRouter.js";
import db from './models/index.js'
import walletRoute from "./routes/wallet.js";
import savingRoute from "./routes/saving.js";
import transactionRoute from './routes/transactions.js'
import notificationRoute from './routes/notification.js'
// import morgan from 'morgan'
// import cookieParser from  'cookie-parser'
import morgan from 'morgan'
import cookieParser from  'cookie-parser'
// Create an instance of Express
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(express.json());
app.use(cors(corsOptions));


app.use(morgan('dev'));
app.use(cookieParser());
app.use("/api/users", userRoute); 
app.use("/api/promotions",promoRouter)
app.use("/api/wallet", walletRoute);
app.use("/api/saving", savingRoute);
app.use(morgan('dev'));
app.use(cookieParser());
app.use("/api/users", userRoute); 
app.use("/api/promotions",promoRouter)
app.use("/api/wallet", walletRoute);
app.use("/api/saving", savingRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/notifications", notificationRoute);


//the port where your application will listen
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, async() => {
  console.log(`Server is running on port ${port}`);
  console.log("connecting to the DB")
  await db.sequelize.sync()
  console.log("connected")
}); 