const express = require('express');
const router = express.Router();
const {
  generateQRCode,
  getQRCodeHistory,
  getQRCodeById,
  deleteQRCode,
  getQRCodeStats
} = require('../controllers/qrController');

const {
  validateURL,
  validateEmail,
  validatePhone,
  validateType,
  checkValidation
} = require('../middleware/validation');

// Dynamic validation based on type
const validateByType = (req, res, next) => {
  const { type } = req.body;
  
  // First validate the type
  validateType[0](req, res, (err) => {
    if (err) return next(err);
    
    // Then validate data based on type
    let dataValidator;
    switch (type) {
      case 'url':
        dataValidator = validateURL[0];
        break;
      case 'email':
        dataValidator = validateEmail[0];
        break;
      case 'phone':
        dataValidator = validatePhone[0];
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type'
        });
    }
    
    dataValidator(req, res, next);
  });
};

// Routes
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'QR API is working!', timestamp: new Date().toISOString() });
});
router.post('/generate', validateByType, checkValidation, generateQRCode);
router.get('/history', getQRCodeHistory);
router.get('/stats', getQRCodeStats);
router.get('/:id', getQRCodeById);
router.delete('/:id', deleteQRCode);

module.exports = router;