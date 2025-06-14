const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password required'),
  authController.login
);

router.post('/refresh',
  body('refreshToken').isString(),
  authController.refresh
);

router.post('/request-password-reset',
  body('email').isEmail(),
  authController.requestPasswordReset
);

router.post('/reset-password',
  body('token').isString(),
  body('newPassword').isLength({ min: 6 }),
  authController.resetPassword
);

module.exports = router;