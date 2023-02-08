const express = require("express");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();
const { Product } = require("../models/products");
const cloudinary = require("../utils/cloundinary");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post("/", isAdmin, async (req, res) => {
  const { name, brand, desc, price, qty, image, categoryId } = req.body;
  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_present: "shop-online",
      });
      if (uploadRes) {
        const product = new Product({
          name,
          brand,
          desc,
          price,
          qty,
          image: uploadRes,
          categoryId,
        });
        const saveProduct = await product.save();
        res.status(200).send(saveProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
