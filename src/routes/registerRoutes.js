
import {
    registerList,
    inputRegister,
    outputRegister
} from "../controllers/registerController.js";
import { schemaValidation } from "../middlewares/registerMiddleware.js";
import {Router} from "express";

const router = Router();

router.get("/meus-dados", registerList);

router.use(schemaValidation);

router.post("/entrada", inputRegister);
router.post("/saida", outputRegister);

export default router;