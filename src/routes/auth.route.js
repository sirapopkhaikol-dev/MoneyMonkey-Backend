import express from "express";

import AuthController from "../controllers/auth.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
// import authenticate from "../middleware/authenticate.middleware.js";


const router = express.Router();


router.post("/google", asyncHandler(AuthController.googleLogin));
router.post("/refresh", asyncHandler(AuthController.refresh));



export default router;