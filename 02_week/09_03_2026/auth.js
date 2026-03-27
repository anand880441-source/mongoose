const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/AuthClass")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("Failed to connect", err));

// 1. Fixed Schema Definition
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const User = mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
  res.status(200).json("Server is running...")
})

app.get("/users", async (req, res) => {
  try {
    const data = await User.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- REGISTER ROUTE ---
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

// --- LOGIN ROUTE ---
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare entered password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 3. Success (Return user info without the password)
    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));






// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const app = express();

// app.use(cors());
// app.use(express.json());

// //connect to mongo

// mongoose
//   .connect("mongodb://localhost:27017/AuthClass")
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((error) => {
//     console.log("MongoDB failed to connect", error);
//   });

// //empty schema/blueprint

// const userSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: String,
//     password: String,
//   },
//   { versionKey: false },
//   { timestamps: true },
// );

// //collection name

// const products = mongoose.model("users", userSchema);

// //route

// app.get("/",(req,res)=>{
//   res.status(200).json("Server is running...")
// })

// app.get("/users", async (req, res) => {
//   try {
//     const data = await products.find({});
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.post("/addusers", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const hashedpassword = await bcrypt.hash(password, 10);

//     // Check if user already exists
//     const existingUser = await products.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create new user
//     const userSchema = new mongoose.Schema({
//       name: {
//         type: String,
//         minlength: 2,
//         required: true,
//       },
//       email: {
//         type: String,
//         required: true,
//         lowercase: true,
//         unique: true,
//       },
//       password: {
//         type: String,
//         required: true,
//         minlength: [6, "password must be 6 charachters"],
//       },
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: "User added successfully",
//       user: newUser,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error adding user",
//       error: err.message,
//     });
//   }
// });

// app.post("/addmultipleusers", async (req, res) => {
//   try {
//     const users = req.body;

//     const result = await products.insertMany(users);

//     res.status(201).json({
//       message: "Multiple users added successfully",
//       data: result,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error inserting multiple users",
//       error: err.message,
//     });
//   }
// });

// app.listen(5000, () => {
//   console.log("Server started on port 5000");
// });
