const jwt = require("jsonwebtoken");

const genAuthToken = (user) => {
  const serectKey = process.env.JWT_SERECT_KEY;

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    serectKey
  );
  return token;
};

module.exports = genAuthToken;
