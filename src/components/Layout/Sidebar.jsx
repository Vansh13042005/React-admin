import React from 'react';
import {
  X, LogOut, BarChart3, FileText, Zap, Lock,
  MessageSquare, Settings, BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'experience', label: 'Experience', icon: Lock },
    { id: 'education', label: 'Education', icon: BookOpen }, // ✅ ADD THIS
    { id: 'resume', label: 'Resume', icon: BookOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },

  ];

  const handleNavigate = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-30"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:static left-0 top-0 h-screen w-64
        bg-[#0b0f1a]
        border-r border-white/10
        transform transition-all duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                CMS
              </h1>
              <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
            </div>

            <button onClick={onClose} className="md:hidden text-gray-400">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300 group
                  ${isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          {user && (
            <>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {(user.name || 'A')[0]}
                </div>

                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                  text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;