const express = require("express");
const { User } = require("../models/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const genAuthToken = require("../utils/genAuthToken");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user = await User.find().sort({ _id: -1 });
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email không chính xác");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Mật khẩu không chính xác");

  const token = genAuthToken(user);
  res.send(token);
});

router.post("/register", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email người dùng đã tồn tại...");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();
  const token = genAuthToken(user);

  res.send(token);
});

module.exports = router;
