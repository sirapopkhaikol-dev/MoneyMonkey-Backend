const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGO_URI = "mongodb://localhost:27017";

const DB_NAME = "test"; // ชื่อ Database ที่ต้องการใช้

let db; // เก็บ instance ของ Database

async function connectDB() {
  if (db) return db; // ถ้ามีการเชื่อมต่ออยู่แล้วให้ใช้ตัวเดิม

  try {
    const client = await MongoClient.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(DB_NAME);
    console.log("✅ MongoDB Connected");
    return db;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err;
  }
}

// Export ฟังก์ชัน connectDB()
module.exports = { connectDB };
