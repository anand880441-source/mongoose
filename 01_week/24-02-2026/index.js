const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Flipkart')
.then(()=>console.log("MongoDB Connection Sucessfully"))
.catch((error)=> console.log("MongoDB Connection Faild"))


const userSchema = mongoose.Schema({})
const User = mongoose.model("users",userSchema);

const orderSchema = mongoose.Schema({})
const Order = mongoose.model("orders",orderSchema);

app.get("/", (req, res) => {
  res.send("users server is running...");
});

app.get("/users", async(req, res) => {
  console.log("users desplayed...");

  const data = await User.find({});
  res.status(200).json(data);
});

app.get("/orders", async(req, res) => {
  console.log("users desplayed...");

  const data1 = await Order.find({});
  res.status(200).json(data1);
});



app.listen(3000, () => {
  console.log("server started on port 3000")
});
