const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    brand: { type: String, require: true },
    categoryId: { type: String, require: true },
    desc: { type: String, require: true },
    price: { type: Number, require: true },
    qty: { type: Number, require: true },
    image: { type: Object, require: true },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
exports.Product = Product;
