require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {connectDB} = require("./connect-to-database/database");
const test = require("./test/test"); 


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/app", test);

// Connect to MongoDB ก่อนเริ่ม Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
