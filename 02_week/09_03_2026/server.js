const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/backendClassDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", ProductSchema);

app.post("/products", async (req, res) => {
  const { title, category, price, brand } = req.body;

  const ProductData = {
    title,
    category,
    price,
    brand,
  };

  try {
    const NewProduct = new Product(ProductData);
    await NewProduct.save();
    console.log(NewProduct);
    res.status(201).json({ message: "added the NewProduct", NewProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("server started at 3000");
});
