// URL validation
export const validateURL = (url) => {
  try {
    const validUrl = new URL(url);
    return validUrl.protocol === 'http:' || validUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Phone validation (international format)
export const validatePhone = (phone) => {
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Must start with + and have 7-15 digits after the +
  const phoneRegex = /^\+\d{7,15}$/;
  return phoneRegex.test(cleanPhone);
};

// Format phone number for tel: URI
export const formatPhoneForTel = (phone) => {
  // Remove all non-digit characters except +
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+' + cleanPhone;
  }
  
  return cleanPhone;
};

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!cleanPhone.startsWith('+')) {
    return '+' + cleanPhone;
  }
  
  return cleanPhone;
};

// Validate input based on QR code type
export const validateQRInput = (type, data) => {
  const trimmedData = data.trim();
  
  if (!trimmedData) {
    return {
      field: 'data',
      message: 'This field is required',
    };
  }

  switch (type) {
    case 'url':
      if (!validateURL(trimmedData)) {
        return {
          field: 'data',
          message: 'Please enter a valid URL (e.g., https://example.com)',
        };
      }
      break;
      
    case 'email':
      if (!validateEmail(trimmedData)) {
        return {
          field: 'data',
          message: 'Please enter a valid email address',
        };
      }
      break;
      
    case 'phone':
      if (!validatePhone(trimmedData)) {
        return {
          field: 'data',
          message: 'Please enter a valid international phone number (e.g., +1 555 123 4567, +44 20 1234 5678, +91 98765 43210). Must include country code starting with +.',
        };
      }
      break;
      
    default:
      return {
        field: 'type',
        message: 'Invalid QR code type',
      };
  }

  return null;
};

// Get placeholder text for input based on type
export const getPlaceholderText = (type) => {
  switch (type) {
    case 'url':
      return 'https://example.com';
    case 'email':
      return 'user@example.com';
    case 'phone':
      return '+1 555 123 4567 (country code required)';
    default:
      return '';
  }
};

// Get label text for input based on type
export const getLabelText = (type) => {
  switch (type) {
    case 'url':
      return 'Website URL';
    case 'email':
      return 'Email Address';
    case 'phone':
      return 'Phone Number';
    default:
      return 'Data';
  }
};

// Download helper
export const downloadQRCode = (qrCodeImage, filename = 'qrcode.png') => {
  const link = document.createElement('a');
  link.href = qrCodeImage;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};