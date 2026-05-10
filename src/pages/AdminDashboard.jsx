// src/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import ToastContainer from '../context/ToastContext';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import ProjectsPage from './Projects';
import SkillsPage from './Skills';
import ExperiencePage from './Experience';
import ResumePage from './ResumePage';
import MessagesPage from './Messages';
import SettingsPage from './Settings';
import EducationPage from './Education';
import FeedbackPage from './Feedbackpage';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  // ✅ feedback entry added
  const pageConfig = {
    dashboard:  { title: 'Dashboard',            component: Dashboard },
    projects:   { title: 'Projects',             component: ProjectsPage },
    skills:     { title: 'Skills',               component: SkillsPage },
    experience: { title: 'Experience & Education', component: ExperiencePage },
    education:  { title: 'Education',            component: EducationPage },
    resume:     { title: 'Resume',               component: ResumePage },
    messages:   { title: 'Messages',             component: MessagesPage },
    feedback:   { title: 'Feedback',             component: FeedbackPage }, // ✅ NEW
    settings:   { title: 'Settings',             component: SettingsPage },
  };

  const currentConfig   = pageConfig[currentPage];
  const CurrentComponent = currentConfig?.component || Dashboard;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={currentConfig?.title || 'Dashboard'}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto p-6">
          <CurrentComponent />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;