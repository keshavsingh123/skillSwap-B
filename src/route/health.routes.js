import { Router } from "express";
import { getHealthStatus } from "../controller/health.controller.js";

const router = Router();

router.get("/", getHealthStatus);

export default router;
