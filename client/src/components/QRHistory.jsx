import React, { useState, useEffect } from 'react';
import { Download, Trash2, Eye, Calendar, Link, Mail, Phone } from 'lucide-react';
import { qrCodeService } from '../services/api';
import { downloadQRCode } from '../utils/validation';

const QRHistory = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState('');

  const itemsPerPage = 9;

  useEffect(() => {
    // Test API connection first
    testAPIConnection();
    fetchQRHistory();
  }, [currentPage]);

  const testAPIConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/qr/test');
      const data = await response.json();
      console.log('API Connection Test:', data);
    } catch (error) {
      console.error('API Connection Test Failed:', error);
    }
  };

  const fetchQRHistory = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Fetching QR history, page:', currentPage, 'limit:', itemsPerPage);
      const result = await qrCodeService.getQRCodeHistory(currentPage, itemsPerPage);
      
      console.log('QR History API response:', result);
      
      if (result.success) {
        console.log('QR Codes received:', result.data?.qrCodes);
        setQrCodes(result.data?.qrCodes || []);
        setPagination(result.data?.pagination || null);
      } else {
        console.error('API returned error:', result.error);
        setError(result.error || 'Failed to fetch QR history');
      }
    } catch (err) {
      console.error('Fetch QR history error:', err);
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    setDeleteLoading(id);

    try {
      const result = await qrCodeService.deleteQRCode(id);
      
      if (result.success) {
        // Remove from local state
        setQrCodes(prev => prev.filter(qr => qr.id !== id));
        
        // Close modal if the deleted item was being viewed
        if (selectedQR && selectedQR.id === id) {
          setShowModal(false);
          setSelectedQR(null);
        }
      } else {
        alert(result.error || 'Failed to delete QR code');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setDeleteLoading('');
    }
  };

  const handleDownload = (qrCode) => {
    const filename = `qr-${qrCode.type}-${Date.now()}.png`;
    downloadQRCode(qrCode.qrCodeImage, filename);
  };

  const handleView = (qrCode) => {
    setSelectedQR(qrCode);
    setShowModal(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'url':
        return <Link className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded"></div>;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'url':
        return 'bg-blue-100 text-blue-800';
      case 'email':
        return 'bg-green-100 text-green-800';
      case 'phone':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatData = (data, type) => {
    if (type === 'url' && data.length > 30) {
      return data.substring(0, 30) + '...';
    }
    if (type === 'email' && data.length > 25) {
      return data.substring(0, 25) + '...';
    }
    return data;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="card">
          <div className="p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-gray-600 font-medium">Loading QR history...</span>
              <span className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="card">
          <div className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <span className="text-2xl text-red-500">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading QR History</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchQRHistory}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="card fade-in">
        {/* Header */}
        <div className="card-header">
          <h1 className="text-2xl font-semibold mb-2">QR Code History</h1>
          <p className="text-gray-100 text-sm">View and manage your generated QR codes</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {qrCodes.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="w-12 h-12 border-2 border-gray-300 border-dashed rounded-xl"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No QR codes found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start by generating your first QR code using the Generator tab. Your created QR codes will appear here for easy access and management.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto text-left">
                <p className="text-sm font-medium text-gray-700 mb-2">📋 Debug Information:</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>API Base URL: <code className="bg-white px-1 rounded">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}</code></p>
                  <p>Current Page: {currentPage} | Items Per Page: {itemsPerPage}</p>
                </div>
                <button
                  onClick={fetchQRHistory}
                  className="mt-3 btn-secondary text-sm w-full"
                >
                  🔄 Refresh History
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* QR Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {qrCodes.map((qrCode) => (
                  <div key={qrCode.id} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
                    {/* QR Image */}
                    <div className="aspect-square bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
                      <img
                        src={qrCode.qrCodeImage}
                        alt="QR Code"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(qrCode.type)}`}>
                        {getTypeIcon(qrCode.type)}
                        {qrCode.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(qrCode.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Data */}
                    <p className="text-sm text-gray-700 mb-4 break-all">
                      {formatData(qrCode.originalData, qrCode.type)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(qrCode)}
                        className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(qrCode)}
                        className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(qrCode.id)}
                        disabled={deleteLoading === qrCode.id}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === qrCode.id ? (
                          <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="px-3 py-2 text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">QR Code Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-4">
              <img
                src={selectedQR.qrCodeImage}
                alt="QR Code"
                className="mx-auto max-w-full h-auto"
                style={{ maxWidth: '250px' }}
              />
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedQR.type)}`}>
                  {getTypeIcon(selectedQR.type)}
                  {selectedQR.type.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Data:</span>
                <p className="mt-1 text-gray-600 break-all">{selectedQR.originalData}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">{new Date(selectedQR.createdAt).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => handleDownload(selectedQR)}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => handleDelete(selectedQR.id)}
                disabled={deleteLoading === selectedQR.id}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                {deleteLoading === selectedQR.id ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRHistory;