const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

// In-memory password reset tokens for demo (use DB in production)
const resetTokens = {};

// --- LOGIN CONTROLLER ---
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // --- Ensure the access token includes the user role! ---
    const accessToken = tokenService.generateAccessToken({
      id: user.id,
      role: user.role
    });

    const refreshToken = await tokenService.generateRefreshToken({
      id: user.id,
      role: user.role
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'No refresh token provided' });
    const payload = await tokenService.verifyRefreshToken(refreshToken);
    if (!payload) return res.status(401).json({ error: 'Invalid refresh token' });
    const user = await userService.getUserById(payload.id || payload.userId);
    // Make sure the new access token includes the latest role
    const accessToken = tokenService.generateAccessToken({
      id: user.id,
      role: user.role
    });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link was sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    resetTokens[token] = { userId: user.id, expires: Date.now() + 1000 * 60 * 15 }; // 15 min expiry
    // In production, send email with token link here
    res.json({ message: 'Password reset link generated.', token });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const data = resetTokens[token];
    if (!data || data.expires < Date.now()) return res.status(400).json({ error: 'Invalid or expired token' });
    await userService.updatePassword(data.userId, newPassword);
    delete resetTokens[token];
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
};