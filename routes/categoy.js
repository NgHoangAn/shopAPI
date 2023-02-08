const express = require("express");

const router = express.Router();
const { Category } = require("../models/category");
const cloudinary = require("../utils/cloundinary");

router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).send(category);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  const { name, image } = req.body;
  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_present: "shop-online",
      });
      if (uploadRes) {
        const category = new Category({
          name,
          image: uploadRes,
        });
        const saveCategory = await category.save();
        res.status(200).send(saveCategory);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).send("Category not found...");
    if (category.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        category.image.public_id
      );
      if (destroyResponse) {
        const deleteCategory = await Category.findByIdAndDelete(req.params.id);
        res.status(200).send(deleteCategory);
      }
    } else {
      console.log("Action terminated. Failed to deleted category");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
