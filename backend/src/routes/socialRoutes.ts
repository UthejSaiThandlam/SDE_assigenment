import { Router } from "express";
import { getSocial } from "../controllers/socialController";

const router = Router();
router.get("/", getSocial);

export default router;
