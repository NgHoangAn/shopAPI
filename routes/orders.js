const { isAdmin, auth } = require("../middleware/auth");
const { Order } = require("../models/orders");
const { Product } = require("../models/products");
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

router.post("/", auth, async (req, res) => {
  const newOrder = new Order({
    userId: req.body.auth._id,
    products: req.body.cartItem,
    subtotal: req.body.cartTotalAmount,
  });
  try {
    const savedOrder = await newOrder.save();
    if (savedOrder) {
      let array = [];
      let temp;
      req.body.cartItem.map((item) => array.push(item));
      for (let i = 0; i < array.length; i++) {
        temp = await Product.findById(array[i]._id);
        let newQty = temp.qty - array[i].quantity;
        const updatedProduct = await Product.findByIdAndUpdate(
          array[i]._id,
          {
            $set: {
              qty: newQty,
            },
          },
          { new: true }
        );
      }
      res.status(200).send("success");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("fail");
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
