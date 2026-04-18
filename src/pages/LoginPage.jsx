import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const LoginPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);

if (res.success) {
  setError("");
} else {
  setError(res.message || "Invalid credentials");
}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Login Card */}
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CMS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Portfolio Admin Dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@portfolio.com"
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
            required
            disabled={isLoading}
          />

          <Button 
            type="submit" 
            className="w-full justify-center"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Demo credentials are pre-filled above
          </p>
        </form>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-800 dark:text-blue-400">
            <strong>Email:</strong> admin@portfolio.com
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-400">
            <strong>Password:</strong> admin123
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;