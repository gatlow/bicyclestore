require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./backend/routes/authRoutes");

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "frontend", "public")));


if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bicycleStore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
});


app.use("/api/auth", authRoutes);
app.use("/api/products", require("./backend/routes/productRoutes"));
app.use("/api/orders", require("./backend/routes/orderRoutes"));
app.use("/api/reviews", require("./backend/routes/reviewRoutes"));


const errorHandler = require("./backend/Middleware/errorMiddleware");

const PORT = process.env.PORT || 5050;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
