const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

//connect to mongo

mongoose.connect("mongodb://localhost:27017/AuthClass")
.then(()=>{console.log("MongoDB connected")})
.catch((error)=>{console.log("MongoDB failed to connect",error)});

//empty schema/blueprint

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
},
{versionKey:false}
,
{timestamps:true}

);


//collection name

const products = mongoose.model("users",userSchema);

//route

app.get("/users", async (req, res) => {
    try {
        const data = await products.find({});
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});


app.post("/addusers", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedpassword = await bcrypt.hash(password, 10)

    // Check if user already exists
    const existingUser = await products.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new products({
      name,
      email,
      password : hashedpassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User added successfully",
      user: newUser
    });

  } catch (err) {
    res.status(500).json({
      message: "Error adding user",
      error: err.message
    });
  }
});


app.post("/addmultipleusers", async (req, res) => {
  try {
    const users = req.body; 

    const result = await products.insertMany(users);

    res.status(201).json({
      message: "Multiple users added successfully",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      message: "Error inserting multiple users",
      error: err.message
    });
  }
});


app.listen(5000, () => {
  console.log("Server started on port 5000");
});