const { body, validationResult } = require('express-validator');

// URL validation
const validateURL = [
  body('data')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please provide a valid URL with http:// or https://'),
];

// Email validation
const validateEmail = [
  body('data')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

// Phone number validation (international format)
const validatePhone = [
  body('data')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
];

// Type validation
const validateType = [
  body('type')
    .isIn(['url', 'email', 'phone'])
    .withMessage('Type must be one of: url, email, phone'),
];

// Check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateURL,
  validateEmail,
  validatePhone,
  validateType,
  checkValidation
};