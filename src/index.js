import express from "express";
import joi from "joi";
import cors from "cors";

import authRouters from "./routes/authRoutes.js";
import registryRouters from "./routes/registryRoutes.js"
// const signInSchema = joi.object({
//     email: joi.string().email().required(),
//     password: joi.string().required()
// });



const app = express();
app.use(cors());
app.use(express.json());
app.use(authRouters);
app.use(registryRouters);




app.listen(5000);