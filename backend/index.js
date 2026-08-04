const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
dotenv.config();
connectDB();

const app = express();
app.use(cors(
  {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.FRONTEND_URL].filter(Boolean),
    credentials: true
  }
));

app.get("/", (req, res) => {
  res.send("DailyCart is working Properly!");
});

app.use(express.json());

app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/products', require("./routes/productRoutes"));
app.use('/api/orders', require("./routes/orderRoutes"));
app.use('/api/payment', require("./routes/paymentRoutes"));
app.use('/api/admin', require("./routes/adminRoutes")); 

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("DailyCart API is running..");
  });
}


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 