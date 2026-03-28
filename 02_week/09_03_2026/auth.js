const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "secretkey123"; 

app.use(express.json());

// --- Database Connection ---
mongoose
  .connect("mongodb://localhost:27017/AuthClass")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("Failed to connect", err));

// --- Schema & Model ---
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const User = mongoose.model("User", userSchema);

// --- Middleware: Protect Routes ---
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Please login first.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Contains userId and name
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

// --- Routes ---

app.get("/", (req, res) => {
  res.status(200).json("Server is running...");
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, name: user.name }, SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protected Profile Route
app.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.status(200).json({
      success: true,
      message: "Here is your profile",
      data: user,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));





// const express=require("express"); 
// const mongoose=require("mongoose"); 
// const bcrypt = require('bcrypt');
// const jwt = require("jsonwebtoken")
// const app=express()

// app.use(express.json())

// const PORT=3000 

// const SECRET_KEY = "mynameyogesh12345678j990"

// // Connect With Database 
// mongoose.connect("mongodb://127.0.0.1:27017/Lab2AuthClass2")
// .then(()=>{
// console.log("MongoDB Connected Successfully")
// })
// .catch((err)=>{
// console.log("Database connection error",err)
// })

// //  Step 1 . Create a Schema 
// //  Step  2 . Create a Model 

// const UserSchema = new mongoose.Schema({
//  name:{
//    type:String,
//    required:true,
//  },
//  email:{
//    type:String,
//    required:true,
//  },
//  password:{
//    type:String,
//    required:true,
//  }

// })

// //  Stept 
// const User = mongoose.model("User",UserSchema)  // Model 





// // Regitation 
// // Login  


// //  Regitation 
// // Post 

// app.post("/regiter",async(req,res)=>{
//    const {name,email,password} =  req.body; 
//    try {

    
 
//    // we are bcrypt for hash password 
//      const hashpassword = await bcrypt.hash(password,8); 
       
//      const Myuser = {
//          name,email,
//          password:hashpassword
//       }
     
//       const NewUser = new User(Myuser);

//       await NewUser.save(); 

//       res.status(201).json({msg:"User Regitation Done"})
      
      
//    } catch (error) {
//       res.status(401).send(error);
//    }
// })   //  Done 




// // Login 
// // Post

// app.post("/login",async (req,res) => {
//   const {email,password} = req.body; 
//   try {
  
//     const user =  await User.findOne({email});    

    
//     if(!user){
//        return res.status(401).json({msg:"Please Register First !"})
//     }

//   const ismatch  =  await bcrypt.compare(password,user.password);    // true false 

//   if(!ismatch){
//     return res.status(401).json({msg:"Your password wrong"})
//   }

// const token  = jwt.sign(
//   {
//   userId:user._id,
//   userName:user.name, 
//  }, // paylod 
//  SECRET_KEY , 
//  {expiresIn:"1d"}

// )
  
//   if(ismatch){
//     return res.status(201).json(
//       {
//          msg:"Login Done",
//          Token:token
         
        
    
//     }
//     )
//   }


  
//   } catch (error) {
//     res.status(401).json(error)
//   }
// })




// ///moddlwaare   





// // Start Server 
// app.listen(PORT,()=>{
// console.log("Server running on port",PORT)
// })