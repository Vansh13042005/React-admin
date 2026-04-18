import React, { useState } from 'react';
import { Menu, Moon, Sun, Bell, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ title, onMenuToggle }) => {
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
      <div className="flex items-center justify-between p-6">
        {/* Left Side - Menu & Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle} 
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        {/* Right Side - Search, Theme, Notifications */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden sm:flex relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                bg-gray-100 dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 
                rounded-lg 
                pl-10 pr-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:text-white
                placeholder-gray-500
                transition-all
              "
            />
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors dark:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <button 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative dark:text-white"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;