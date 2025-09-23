import React, { useState } from 'react';
import Navigation from './components/Navigation';
import QRGenerator from './components/QRGenerator';
import QRHistory from './components/QRHistory';
import './style.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <QRGenerator />;
      case 'history':
        return <QRHistory />;
      default:
        return <QRGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="py-8">
        {renderCurrentPage()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">Q</span>
              </div>
              <span className="font-semibold text-gray-900">QR Generator Pro</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Professional QR Code generation for businesses and individuals
            </p>
            <p className="text-xs text-gray-500">
              Built with React.js, Node.js, Express.js & MongoDB | © 2024 QR Generator Pro
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;