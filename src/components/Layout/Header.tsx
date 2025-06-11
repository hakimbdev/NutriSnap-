import React from 'react';
import { Camera, User, TrendingUp } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'camera', icon: Camera, label: 'Snap' },
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N+</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">NutriSnap+</h1>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`p-2 rounded-lg transition-colors ${
                  currentView === id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                aria-label={label}
              >
                <Icon size={20} />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;