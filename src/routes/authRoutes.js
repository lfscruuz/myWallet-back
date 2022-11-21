import { 
    signIn, 
    signOut, 
    signUp 
} from "../controllers/authController.js";

import {Router} from "express";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";
import { sessionsSchemaValidation, signUpSchemaValidation } from "../middlewares/authSchemasValidationMiddleware.js";

const router = Router();

router.post("/sign-up", signUpSchemaValidation, signUp);

router.post("/sign-in", sessionsSchemaValidation, signIn);

router.delete("/sign-out", validateToken, signOut);

export default router;