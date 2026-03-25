const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const PORT = 5000;

// Connect with Database
mongoose
  .connect("mongodb://127.0.0.1:27017/backendClassDB")
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("Database connection error", err);
  });

// Create Schema
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  Price: {
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

// Create Mdoel
const Product = mongoose.model("Product", ProductSchema); // collection

app.get("/", (req, res) => {
  res.status(200).json("Server is running...");
});

//  Create a Post Route to insert one Value

app.post("/product", async (req, res) => {
  const { title, Price, category, brand } = req.body;

  const ProductData = {
    title,
    Price,
    category,
    brand,
  };
  try {
    const NewProduct = new Product(ProductData);
    await NewProduct.save();
    res.status(200).json(NewProduct);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Add data in bulk
app.post("/products/bulk", async (req, res) => {
  const products = req.body; // expecting an array of products

  try {
    const newProducts = await Product.insertMany(products);

    res.status(201).json({
      message: "Multiple products added successfully",
      data: newProducts,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/get-products", async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res.status(404).send("Prodcut Not Found");
    }
    res.json(product);
  } catch (error) {
    res.status(404).send(error);
  }
});

//  Find By Id
// Query Parameters we will continue
app.get("/product/:id", async (req, res) => {
  try {
    const ProductId = req.params.id;
    const product = await Product.findById(ProductId);
    if (!product) {
      return res.status(404).send("Prodcut Not Found");
    }
    res.json(product);
  } catch (error) {
    res.status(404).send(error);
  }
});

//  Query Parmeter

// Brand wise
app.get("/brandproducts", async (req, res) => {
  try {
    const { category, brand } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = brand;
    }

    const products = await Product.find(filter);

    if (!products) {
      return res.status(404).send("This category not Found");
    }

    res.json(products);
  } catch (error) {
    res.status(404).send(error);
  }
});

// app.get("/filterproduct",async(req,res)=>{
//    try {

//       const category = req.query.category;

//        const prodcut = await Prodcut.find({
//          category:category
//        })

//        res.status(201).json(prodcut)

//    } catch (error) {
//       res.status(404).send(error)
//    }
// })

// sorting thing

app.get("/sortedproduct", async (req, res) => {
  try {
    const Price = req.query.Price; ///  Price
    const sortePrice = {};

    if (Price === "asc") sortePrice.Price = 1;

    if (Price === "desc") sortePrice.Price = -1;

    const products = await Product.find().sort(sortePrice);

    res.status(201).json(products);
  } catch (error) {
    res.status(404).send(error);
  }
});

//  pagination

app.get("/products-pagination", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const product = await Product.find().skip(skip).limit(limit);

    res.status(201).json(product);
  } catch (error) {
    res.status(404).send(error);
  }
});

//     You have 5 minut4e
// Searching

app.get("/products-search", async (req, res) => {
  try {
    const search = req.query.search;

    const products = await Product.find({
      $or: [
        {
          category: { $regex: search, $options: "i" },
        },

        {
          brand: { $regex: search, $options: "i" },
        },
      ],
    });
    res.status(201).json(products);
  } catch (error) {
    res.status(404).send(error);
  }
});

//  Create one route which support only one title .

app.get("/search-title", async (req, res) => {
  try {
    const search = req.query.search;

    const products = await Product.find({
      title: {
        $regex: search,
        $options: "i",
      },
    });
    res.status(201).json(products);
  } catch (error) {
    res.status(404).send(error);
  }
});

// merge all concept in one api .

app.get("/products", async (req, res) => {
  try {
    const { category, brand, search, page = 1, limit = 10 } = req.query;

    // Filter by brand
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = brand;
    }

    //  Searching is completed
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination

    const pageNumber = parseInt(page);

    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const sortOption = {};

    if (sort === "asc") {
      sortOption.Price = 1;
    }

    if (sort === "desc") {
      sortOption.Price = -1;
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOption);

    if (!products) {
      return res.status(404).send("This category not Found");
    }

    res.json(products);
  } catch (error) {
    res.status(401).json({
      error: "Product Not Found",
    });
  }
});



// Start Server
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
