import express from "express";
import cors from "cors";
// import { connectDB } from "./connect-to-database/database.js";
// import test from "./test/test.js";

import auth from "./src/routes/auth.route.js";

import errorHandler from "./src/middleware/errorHandler.middleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static("public")); // Serve static files from the "public" directory

//Routes
// app.use("/app", test);
app.use("/api/auth", auth);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

