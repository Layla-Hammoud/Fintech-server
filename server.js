import sequelize from "./config/db.js";
import express from "express";
import "dotenv/config.js";
import cors from "cors";
import userRoute from './routes/user.js'
// Create an instance of Express
const app = express();

app.use(express.json());
app.use(cors());

// Define your routes or other middleware here
app.use("/api/users", userRoute);
// Define the port where your application will listen
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});