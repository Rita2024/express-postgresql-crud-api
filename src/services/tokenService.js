const jwt = require('jsonwebtoken');
const userService = require('./userService');

const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  await userService.setRefreshToken(user.id, refreshToken);
  return refreshToken;
};

const verifyRefreshToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
  const stored = await userService.getRefreshToken(payload.userId);
  if (stored !== token) return null;
  return payload;
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };