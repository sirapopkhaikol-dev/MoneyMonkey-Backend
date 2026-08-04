const express = require("express");
const { connectDB } = require("../connect-to-database/database");
const { ObjectId } = require("mongodb");
const router = express.Router();

// Hello route for testing purposes
async function hello(req, res) {
    res.send('223')
}

// Save result data into the database
async function resultsave(req, res) {
    try {
        const { Money_input, Year_input, Result, Percentage, email } = req.body;
        const date = new Date().toLocaleDateString("th-TH", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        console.log(req.body);
        const db = await connectDB();
        const collection = await db.collection("archivecollections");
        await collection.insertOne({ email, Money_input, Year_input, Result, Percentage, date });
        res.status(200).json({ message: "Data saved" });
        console.log("Data saved");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error saving data" });
    }
}

// Check login or register a user
async function checkLoginRegister(req, res) {
    try {
        const db = await connectDB();
        const { email, pass, confirmpass } = req.body;

        console.log("Email:", email);
        console.log("Password", pass);

        if (!confirmpass) {
            // Login
            const checkLogin = await db.collection("loginregistercollections").findOne({ email });
            if (!checkLogin || checkLogin.pass !== pass) {
                return res.status(400).json({ error: "Invalid username or password" });
            }
            res.status(200).json({ message: "Login successful" });
        } else {
            // Register
            const existingUser = await db.collection("loginregistercollections").findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Username already exists" });
            }
            await db.collection("loginregistercollections").insertOne({ email, pass });
            res.status(200).json({ message: "User created successfully" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error processing request" });
    }
}

// Fetch results for a user based on email
async function getResults(req, res) {
    try {
        const { email } = req.query; // Get email from query params

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const db = await connectDB();
        const results = await db.collection("archivecollections").find({ email }).toArray();

        if (results.length === 0) {
            return res.status(404).json({ message: "No results found for this email" });
        }

        res.status(200).json(results); // Send the results back to the client
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ message: "Error fetching results" });
    }
}

async function deleteResult(req, res) {
    try {
        console.log("Delete ID:", req.params.id);
        const  id  = req.params.id; // Get the result ID from the request params
        const objectId = new ObjectId(id);
        const db = await connectDB();
        const collection = await db.collection("archivecollections");

        // // Delete the result by its ID
        await collection.deleteOne({ _id : objectId });

        
        res.status(200).json({ message: "Result deleted successfully" });
    } catch (error) {
        console.error("Error deleting result:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getexpenses(req, res){
        try {
            const { email } = req.query; // Get email from query params
    
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }
    
            const db = await connectDB();
            const results = await db.collection("expenses").find({ email }).toArray();
    
            if (results.length === 0) {
                return res.status(404).json({ message: "No results found for this email" });
            }
    
            res.status(200).json(results); // Send the results back to the client
        } catch (error) {
            console.error("Error fetching results:", error);
            res.status(500).json({ message: "Error fetching results" });
        }
    }

async function addExpense(req, res) {
    // Check if email is present in the query parameters for fetching expenses
    const email = req.query.email;

    if (email) {
        // If email exists in query, fetch expenses for that email
        try {
            const expenses = await Expense.find({ email });  // Find expenses by email
            return res.status(200).json(expenses);  // Return the found expenses
        } catch (error) {
            console.error("Error fetching expenses:", error);
            return res.status(500).json({ message: "Failed to fetch expenses" });
        }
    }

    // If email is not in the query, proceed to add a new expense
    try {
        const { email, item, amount, date } = req.body;
        console.log("Expense data:", req.body);
        // Check if necessary fields are provided
        if (!email || !item || !amount || !date) {
            return res.status(400).json({ message: "All fields (email, item, amount, date) are required" });
        }

        const db = await connectDB();  // Ensure you have a valid DB connection
        const collection = await db.collection("expenses");
        await collection.insertOne({ email, item, amount, date });  // Insert new expense
        console.log("Expense added successfully");
        return res.status(200).json({ message: "Expense added successfully" });
    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({ message: "Error adding expense" });
    }
}

async function deleteExpenses(req, res) {
    try {
        console.log("Delete ID:", req.params.id);
        const  id  = req.params.id; // Get the result ID from the request params
        const objectId = new ObjectId(id);
        const db = await connectDB();
        const collection = await db.collection("expenses");

        // // Delete the result by its ID
        collection.deleteOne({ _id : objectId });

        
        res.status(200).json({ message: "expenses deleted successfully" });
    } catch (error) {
        console.error("Error deleting result:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Routes
router.get("/lol", hello);
router.post("/regdata", checkLoginRegister);
router.post("/logindata", checkLoginRegister);
router.post("/resultsave", resultsave);
router.post('/results/:id', deleteResult);
router.post('/deleteExpenses/:id', deleteExpenses);
router.post('/expenses', addExpense);


// New route to fetch results by user email
router.get("/results", getResults);

router.get("/getexpenses", getexpenses);

module.exports = router;
