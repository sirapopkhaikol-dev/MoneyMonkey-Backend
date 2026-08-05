import express from "express";

import AuthController from "../controllers/auth.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";


const router = express.Router();




router.post("/google", asyncHandler(AuthController.googleLogin));



export default router;