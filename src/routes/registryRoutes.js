import {Router} from "express";
import { 
    getRegistry, 
    postRegistry 
} from "../controllers/registryController.js";
import { registrySchemaValidation } from "../middlewares/registrySchemaValidationMiddleware.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";

const router = Router();

router.use(validateToken);

router.post("/registry", registrySchemaValidation, postRegistry);

router.get("/registry", getRegistry);

export default router;