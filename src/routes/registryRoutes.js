import {Router} from "express";
import { 
    getRegistry, 
    postRegistry 
} from "../controllers/registryController.js";

const router = Router();

router.post("/registry", postRegistry);

router.get("/registry", getRegistry);

export default router;