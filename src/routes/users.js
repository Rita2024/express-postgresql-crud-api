const express = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/', userController.getAllUsers);

router.get('/:id',
  param('id').isInt().withMessage('User ID must be an integer'),
  userController.getUserById
);

router.post('/',
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  body('password').isLength({ min: 6 }).withMessage('Password (min 6 chars) required'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  userController.createUser
);

router.put('/:id',
  param('id').isInt().withMessage('User ID must be an integer'),
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  userController.updateUser
);

router.delete('/:id',
  param('id').isInt().withMessage('User ID must be an integer'),
  authorize('admin'),
  userController.deleteUser
);

module.exports = router;