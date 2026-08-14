import "./src/config/env.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDatabase } from "./src/config/database.js";

import auth from "./src/routes/auth.route.js";
import prediction from "./src/routes/prediction.route.js";

import errorHandler from "./src/middleware/errorHandler.middleware.js";
// import authenticate from "./src/middleware/authenticate.middleware.js"

const startServer = async () => {

  try {

    await connectDatabase();

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors({
      origin: "http://localhost:3000",
      credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());

    app.use(express.static("public")); // Serve static files from the "public" directory

    //Routes
    app.use("/api/auth", auth);
    app.use("/api/predictions", prediction);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
  catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();