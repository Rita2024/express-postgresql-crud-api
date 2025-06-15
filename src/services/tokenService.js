const jwt = require('jsonwebtoken');
const userService = require('./userService');

// Generate an access token that includes userId, email, and role
const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

// Generate a refresh token that also includes userId, email, and role for consistency
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  await userService.setRefreshToken(user.id, refreshToken);
  return refreshToken;
};

// Verify the refresh token and check it matches the stored token in the DB
const verifyRefreshToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
  const stored = await userService.getRefreshToken(payload.userId);
  if (stored !== token) return null;
  return payload; // payload includes userId, email, and role
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };