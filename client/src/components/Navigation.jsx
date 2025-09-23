import React from 'react';
import { QrCode, History, Home } from 'lucide-react';

const Navigation = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', label: 'Generator', icon: QrCode },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold text-gray-900">QR Generator</span>
              <p className="text-xs text-gray-500 -mt-1">Professional QR Code Tools</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;