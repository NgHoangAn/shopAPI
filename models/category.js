const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    image: { type: Object, require: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
exports.Category = Category;
