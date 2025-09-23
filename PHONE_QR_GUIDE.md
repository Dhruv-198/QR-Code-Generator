# QR Code Generator - Phone Number Feature

## 📞 Phone Number QR Codes

When you generate a QR code for a phone number, the system automatically formats it with the `tel:` URI scheme, which enables direct calling functionality.

### How it works:

1. **Input**: Enter a phone number with country code (e.g., `+1234567890`)
2. **Processing**: The system formats it as `tel:+1234567890`
3. **QR Code**: Contains the tel: URI scheme
4. **Scanning**: Automatically opens the phone dialer

### Features:

- ✅ **Auto-format**: Automatically adds country code if missing
- ✅ **Direct dialing**: QR code opens phone dialer when scanned
- ✅ **Universal compatibility**: Works with all modern smartphones
- ✅ **Validation**: Ensures proper international phone number format

### Supported formats:

- `+1234567890` (preferred)
- `1234567890` (will auto-add +)
- `+1-234-567-890` (will clean formatting)

### Testing:

1. Generate a phone number QR code
2. Scan it with your smartphone camera
3. Your phone should automatically prompt to call the number

### Requirements:

- Phone number must include country code
- Minimum 7 digits, maximum 15 digits
- International format recommended (+country code + number)

## Examples:

- US: `+1234567890`
- UK: `+441234567890`
- Germany: `+491234567890`
- India: `+911234567890`

The QR code will contain `tel:+[country][number]` which is the standard URI scheme for phone numbers that all modern devices recognize.