const { isAdmin, auth } = require("../middleware/auth");
const { Order } = require("../models/orders");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const order = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!req.user.isAdmin && req.user._id !== order.userId)
      return res.status(403).send("Access denied. Not authorized ...");

    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
