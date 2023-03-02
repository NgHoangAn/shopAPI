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
  const { name, brand, desc, price, qty, image, categoryId, code } = req.body;
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
          code,
          qty,
          image: uploadRes,
          categoryId,
        });
        //console.log(product);
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

router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.productImg) {
    try {
      const destroyResponse = await cloudinary.uploader.destroy(
        req.body.product.image.public_id
      );
      if (destroyResponse) {
        const uploadRes = await cloudinary.uploader.upload(
          req.body.productImg,
          {
            upload_present: "alacs-house",
          }
        );
        if (uploadRes) {
          const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                ...req.body.product,
                image: uploadRes,
              },
            },
            { new: true }
          );
          res.status(200).send(updatedProduct);
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Product not found...");

    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );

      if (destroyResponse) {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).send(deleteProduct);
      }
    } else {
      console.log("Action terminated. Failed to deleted product image...");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
