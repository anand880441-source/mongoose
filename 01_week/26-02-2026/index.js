const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Mongousers')
.then(()=>console.log("MongoDB Connection Sucessfully"))
.catch((error)=> console.log("MongoDB Connection Faild"))



app.get("/", (req, res) => {
  res.send("users server is running...");
});


const userSchema = mongoose.Schema({
    name: String,
    emain :String,
    password: String,
})
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

app.listen(3000, () => {
  console.log("server started on port 3000")
});
