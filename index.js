const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const users = require("./routes/users");
const products = require("./routes/products");
const stripe = require("./routes/stripe");
const orders = require("./routes/orders");
const category = require("./routes/categoy");
const app = express();
const bodyParser = require("body-parser");
const compression = require("compression");
const PORT = process.env.PORT || 3030;
app.use(cors());

app.use(bodyParser.json({ limit: "900kb" }));
app.use(compression());
app.use(express.json());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/stripe", stripe);
app.use("/api/orders", orders);
app.use("/api/category", category);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, console.log("Server running"));
const uri = process.env.DB_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("ket noi server thanh cong"))
  .catch((err) => console.log("ket noi server that bai", err.message));
