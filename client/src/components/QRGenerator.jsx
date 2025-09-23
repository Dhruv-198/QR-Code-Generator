import React, { useState } from 'react';
import { Link, Mail, Phone, Download, Copy, Share2 } from 'lucide-react';
import { qrCodeService } from '../services/api';
import { validateQRInput, getPlaceholderText, getLabelText, downloadQRCode, formatPhoneForTel } from '../utils/validation';

const QRGenerator = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [inputData, setInputData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [error, setError] = useState('');

  const tabs = [
    { id: 'url', label: 'Website URL', icon: Link },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setInputData('');
    setError('');
    setQrResult(null);
  };

  const handleInputChange = (e) => {
    setInputData(e.target.value);
    setError('');
  };

  const generateQRCode = async () => {
    // Validate input
    const validationError = validateQRInput(activeTab, inputData);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Format phone number if needed
      let processedData = inputData.trim();
      if (activeTab === 'phone') {
        // Use the proper phone formatting function
        processedData = formatPhoneForTel(processedData);
      }

      const result = await qrCodeService.generateQRCode({
        type: activeTab,
        data: processedData,
      });

      if (result.success) {
        setQrResult(result.data);
      } else {
        setError(result.error || 'Failed to generate QR code');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrResult) {
      const filename = `qr-${activeTab}-${Date.now()}.png`;
      downloadQRCode(qrResult.qrCodeImage, filename);
    }
  };

  const handleCopyToClipboard = async () => {
    if (qrResult) {
      try {
        await navigator.clipboard.writeText(qrResult.originalData);
        // You could add a toast notification here
        alert('Copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrResult) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for: ${qrResult.originalData}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="card fade-in">
        {/* Header */}
        <div className="card-header">
          <h1 className="text-2xl font-semibold mb-2">QR Code Generator</h1>
          <p className="text-gray-100 text-sm">Generate professional QR codes for URLs, emails, and phone numbers</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`tab-button flex items-center gap-2 ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-3">
                  {getLabelText(activeTab)}
                </label>
                <input
                  id="qr-input"
                  type="text"
                  value={inputData}
                  onChange={handleInputChange}
                  placeholder={getPlaceholderText(activeTab)}
                  className={`w-full input-field ${
                    error ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {activeTab === 'phone' && (
                  <div className="mt-3 p-3 rounded-lg status-info">
                    <p className="text-sm font-medium flex items-center gap-2">
                      📞 <span>Phone Dialer Integration</span>
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      Use international format (e.g., +1 555 123 4567). QR code will open phone dialer when scanned.
                    </p>
                  </div>
                )}
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="w-4 h-4">⚠️</span>
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={generateQRCode}
                disabled={isLoading || !inputData.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating QR Code...
                  </>
                ) : (
                  <>Generate QR Code</>
                )}
              </button>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                QR Code Preview
              </h3>
              
              {qrResult ? (
                <div className="space-y-6">
                  <div className="qr-preview text-center">
                    <img
                      src={qrResult.qrCodeImage}
                      alt="Generated QR Code"
                      className="mx-auto max-w-full h-auto rounded-lg"
                      style={{ maxWidth: '280px' }}
                    />
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Type:</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                        {activeTab.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Data:</span>
                      <span className="text-right text-gray-800 max-w-48 break-all">
                        {qrResult.originalData}
                      </span>
                    </div>
                    {activeTab === 'phone' && (
                      <div className="p-3 rounded-lg status-success">
                        <p className="text-sm font-medium flex items-center gap-2">
                          ✅ <span>Phone Integration Ready</span>
                        </p>
                        <p className="text-xs mt-1 opacity-80">
                          QR contains: <code className="bg-white px-1 rounded">tel:{qrResult.originalData}</code>
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-600">Created:</span>
                      <span className="text-gray-800 text-xs">
                        {new Date(qrResult.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleDownload}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG
                    </button>
                    
                    <button
                      onClick={handleCopyToClipboard}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Data
                    </button>

                    {navigator.share && (
                      <button
                        onClick={handleShare}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="qr-preview text-center text-gray-400 py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                    <div className="w-10 h-10 border-2 border-gray-300 border-dashed rounded-lg"></div>
                  </div>
                  <h4 className="font-medium text-gray-600 mb-1">QR Code Preview</h4>
                  <p className="text-sm">Your generated QR code will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;