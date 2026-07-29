import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { myWallet, myTransactions } from "../controller/wallet.controller.js";

const router = Router();

router.use(authenticate);

router.get("/me", myWallet);

router.get("/me/transactions", myTransactions);

export default router;
