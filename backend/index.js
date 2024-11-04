const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const dbConfig = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
// const authenticateToken = require("./middlewares/authenticateToken");

const app = express();
const port = process.env.PORT || 2000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(dbConfig.uri, dbConfig.options)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
