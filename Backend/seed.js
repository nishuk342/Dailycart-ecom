require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Product.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "Admin User",
        email: "admin@dailycart.com",
        password: hashedPassword,
        role: "admin",
        verified: true,
      },
      {
        name: "John Doe",
        email: "john@dailycart.com",
        password: hashedPassword,
        role: "user",
        verified: true,
      },
      {
        name: "Jane Smith",
        email: "jane@dailycart.com",
        password: hashedPassword,
        role: "user",
        verified: false,
      },
    ];

    const products = [
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones with 30-hour battery life.",
        price: 2999,
        category: "Electronics",
        stock: 15,
        imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Smart Watch",
        description: "Water-resistant smartwatch with health tracking features.",
        price: 1899,
        category: "Wearables",
        stock: 20,
        imageURL: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Gaming Mouse",
        description: "Ergonomic gaming mouse with customizable RGB lighting.",
        price: 1299,
        category: "Accessories",
        stock: 35,
        imageURL: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Portable Speaker",
        description: "Compact Bluetooth speaker with rich bass and 12-hour playback.",
        price: 1599,
        category: "Audio",
        stock: 12,
        imageURL: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80",
      },
    ];

    await User.insertMany(users);
    await Product.insertMany(products);

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedData();
