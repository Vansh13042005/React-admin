import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateUser({
        name: formData.name,
        email: formData.email,
      });
      addToast('Profile updated successfully', 'success');
    } catch (error) {
      addToast('Error updating profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      addToast('Please fill in all password fields', 'error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    if (formData.newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate password change
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      addToast('Password changed successfully', 'success');
    } catch (error) {
      addToast('Error changing password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Settings */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Profile Settings
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="text-6xl">{user?.avatar}</div>
            <div>
              <Button size="sm" type="button">
                Change Avatar
              </Button>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Recommended size: 200x200px
              </p>
            </div>
          </div>

          {/* Name */}
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your full name"
          />

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            <Save size={18} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>

      {/* Security */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Security
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <Input
            label="Current Password"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            placeholder="Enter your current password"
          />

          {/* New Password */}
          <Input
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="Enter new password"
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>

      {/* Preferences */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Preferences
        </h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Currently: <span className="font-semibold">{isDark ? 'ON' : 'OFF'}</span>
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`
              relative w-14 h-8 rounded-full transition-colors
              ${isDark ? 'bg-blue-600' : 'bg-gray-300'}
            `}
            aria-label="Toggle dark mode"
          >
            <div
              className={`
                absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform
                ${isDark ? 'translate-x-6' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        {/* Other Preferences */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            More preferences coming soon! You'll be able to customize notifications, email settings, and more.
          </p>
        </div>
      </Card>

      {/* Account Info */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Account Information
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Account Type
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Member Since
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.joinDate}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Permanently delete your account and all associated data
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;