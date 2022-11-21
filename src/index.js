import express from "express";
import joi from "joi";
import cors from "cors";
import authRouters from "./routes/authRoutes.js";
import registryRouters from "./routes/registryRoutes.js";






const app = express();
app.use(cors());
app.use(express.json());
app.use(authRouters);
app.use(registryRouters);




app.listen(5000);