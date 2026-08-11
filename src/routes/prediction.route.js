import express from "express";

import AuthController from "../controllers/auth.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import authenticate from "../middleware/authenticate.middleware.js";
import PredictionController from "../controllers/prediction.controller.js";


const router = express.Router();

// create prediction request and prediction result via normal and bulk transaction
router.post("/create", authenticate, asyncHandler(PredictionController.createPrediction));

// find a prediction request history via page and limit
router.get("/find/reqHistory", authenticate, asyncHandler(PredictionController.findReqHistoryPrediction));

// find a prediction result with a specific prediction id : example when click to specific prediction to show a result
router.get("/find/resultHistory/:prediction_id", authenticate, asyncHandler(PredictionController.findResultHistoryByPredictionId));

// show an overall : Left Join + GroupBy + Having to Summary
router.get('/overview', authenticate, asyncHandler(PredictionController.findPredictionOverview));



export default router;