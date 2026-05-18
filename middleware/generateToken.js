const jwt = require('jsonwebtoken');
const generateToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role
    },
    process.env.SECRET_TOKEN,
    {
      expiresIn: "7d"
    }
  );
};

module.exports = generateToken;