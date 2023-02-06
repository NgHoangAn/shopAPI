const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Từ chối truy cập. Mời bạn đăng nhập lại...");
  }
  try {
    const serectKey = process.env.JWT_SERECT_KEY;
    const user = jwt.verify(token, serectKey);
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("truy cập không khả dụng");
  }
};

const isUser = (req, res, next) => {
  auth(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Từ chối truy cập. Người dùng không hợp lệ");
    }
  });
};

const isAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Truy cập không khả dụng");
    }
  });
};

module.exports = { auth, isAdmin, isUser };
