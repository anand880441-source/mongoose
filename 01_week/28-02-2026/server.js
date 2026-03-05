const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/MongooseDay_5')
.then(()=>console.log("MongoDB Connection Sucessfully"))
.catch((error)=> console.log("MongoDB Connection Faild"))



app.get("/", (req, res) => {
  res.send("users server is running...");
});


const userSchema = mongoose.Schema({
    _id: Number,
    name: String,
    email :String,
    password: String,
}, {timestamps: true}, {versionKey: false});

const User = mongoose.model("User",userSchema);

app.get("/addusers", async(req, res) => {
  console.log("users desplayed...");

  const data = await User.find({});
  res.status(200).json(data);
});

app.post('/addusers', async(req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        res.send("User created...")
    }
    catch{
        res.status(400).json({message: err.message});
    }
})

app.get("/users/:id", async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
})

app.put("/users/:id", async(req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
})

app.delete("/users/:id", async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json({message: "User deleted successfully"});
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
})

app.post('/addmultipleusers', async(req,res)=>{
    try{
       const users = await User.insertMany(req.body);
       res.status(201).send(users);
    }
    catch (err){
        res.status(400).send(err)
    }
})


app.listen(3000, () => {
  console.log("server started on port 3000")
});
