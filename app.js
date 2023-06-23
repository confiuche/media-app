import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { database } from "./config/dBconnect.js";
import categoryRoutes from "./routes/categoryRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { Stripe } from "stripe"
import User from "./model/userModel.js"



dotenv.config();
database();

const app = express();


app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/comment",commentRoutes);

app.get("/success", async (req, res) => {
    res.send("<h1>Thanks your payment has been received</h1>");
  });

app.use(globalErrorHandler);

app.listen(PORT, console.log(`App started at ${PORT}`));

//for wrong route
// app.use("*", (req, res) => {
//   res.status(404).json({
//     message: `${req.originalUrl} not found`,
//   });
// });