import express from "express";

import AuthController from "../controllers/auth.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import authenticate from "../middleware/authenticate.middleware.js";
import PredictionController from "../controllers/prediction.controller.js";


const router = express.Router();


router.post("/create", authenticate, asyncHandler(PredictionController.createPrediction));



export default router;