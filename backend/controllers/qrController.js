const QRCode = require('qrcode');
const QRCodeModel = require('../models/QRCode');

// Generate QR Code
const generateQRCode = async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Format data based on type
    let formattedData = data;
    
    switch (type) {
      case 'email':
        formattedData = `mailto:${data}`;
        break;
      case 'phone':
        // Clean and format phone number for tel: URI
        let cleanPhone = data.replace(/[^\d+]/g, ''); // Remove all except digits and +
        
        // Ensure it starts with +
        if (!cleanPhone.startsWith('+')) {
          cleanPhone = '+' + cleanPhone;
        }
        
        // Validate minimum requirements for tel: URI
        if (cleanPhone.length < 8 || cleanPhone.length > 16) {
          return res.status(400).json({
            success: false,
            message: 'Phone number must be between 7-15 digits after country code'
          });
        }
        
        // Format as tel: URI (no spaces or special characters in tel: URI)
        formattedData = `tel:${cleanPhone}`;
        break;
      case 'url':
        formattedData = data; // URLs are used as-is
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid QR code type'
        });
    }

    // Generate QR code as Data URL (base64)
    const qrCodeDataURL = await QRCode.toDataURL(formattedData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Save to database
    const qrCodeDoc = new QRCodeModel({
      type,
      data,
      qrCodeData: qrCodeDataURL,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const savedQRCode = await qrCodeDoc.save();

    res.status(201).json({
      success: true,
      message: 'QR Code generated successfully',
      data: {
        id: savedQRCode._id,
        type: savedQRCode.type,
        originalData: savedQRCode.data,
        qrCodeImage: savedQRCode.qrCodeData,
        createdAt: savedQRCode.createdAt
      }
    });

  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
};

// Get QR Code History
const getQRCodeHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const qrCodes = await QRCodeModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipAddress -userAgent'); // Exclude sensitive data

    const total = await QRCodeModel.countDocuments();

    // Transform the data to match frontend expectations
    const transformedQRCodes = qrCodes.map(qr => ({
      id: qr._id,
      type: qr.type,
      originalData: qr.data,
      qrCodeImage: qr.qrCodeData,
      createdAt: qr.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        qrCodes: transformedQRCodes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch QR code history',
      error: error.message
    });
  }
};

// Get Single QR Code
const getQRCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const qrCode = await QRCodeModel.findById(id)
      .select('-ipAddress -userAgent');

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    res.status(200).json({
      success: true,
      data: qrCode
    });

  } catch (error) {
    console.error('Get QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch QR code',
      error: error.message
    });
  }
};

// Delete QR Code
const deleteQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const qrCode = await QRCodeModel.findByIdAndDelete(id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'QR Code deleted successfully'
    });

  } catch (error) {
    console.error('Delete QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete QR code',
      error: error.message
    });
  }
};

// Get QR Code Statistics
const getQRCodeStats = async (req, res) => {
  try {
    const stats = await QRCodeModel.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalQRCodes = await QRCodeModel.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        totalQRCodes,
        breakdown: stats
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

module.exports = {
  generateQRCode,
  getQRCodeHistory,
  getQRCodeById,
  deleteQRCode,
  getQRCodeStats
};