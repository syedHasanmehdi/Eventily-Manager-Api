import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

import express from "express";
import morgan from "morgan";
import { config } from "./config/index.js";
import { connectDB } from "./services/Database/database.js";

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

const port = config.port;

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
