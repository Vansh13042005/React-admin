import React, { useState, useContext, createContext } from 'react';

const DataContext = createContext();

const initialData = {
  projects: [
    { id: 1, title: 'E-Commerce Platform', tech: ['React', 'Node.js', 'Stripe'], category: 'Full Stack', description: 'Full-featured e-commerce platform with payment integration', link: '#', github: '#', image: '🛒' },
    { id: 2, title: 'Task Management App', tech: ['React', 'Firebase', 'Tailwind'], category: 'Frontend', description: 'Collaborative task management tool', link: '#', github: '#', image: '✅' },
  ],
  skills: [
    { id: 1, name: 'React', category: 'Frontend', percentage: 95, icon: '⚛️' },
    { id: 2, name: 'JavaScript', category: 'Frontend', percentage: 90, icon: '📜' },
    { id: 3, name: 'Tailwind CSS', category: 'Frontend', percentage: 95, icon: '🎨' },
  ],
  experience: [
    { id: 1, company: 'TechNova Inc.', role: 'Senior Frontend Developer', duration: '2022 - Present', description: 'Leading React development' },
    { id: 2, company: 'Digital Studio Co.', role: 'Frontend Developer', duration: '2020 - 2022', description: 'Built responsive web applications' },
  ],
  messages: [
    { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Great portfolio! Interested in collaboration.', read: false, date: '2024-01-20' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', message: 'Love your work!', read: true, date: '2024-01-19' },
  ],
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialData.projects);
  const [skills, setSkills] = useState(initialData.skills);
  const [experience, setExperience] = useState(initialData.experience);
  const [messages, setMessages] = useState(initialData.messages);

  // Projects CRUD
  const addProject = (project) => {
    const newProject = { ...project, id: Math.max(...projects.map(p => p.id), 0) + 1 };
    setProjects([newProject, ...projects]);
    return true;
  };

  const updateProject = (id, updatedProject) => {
    setProjects(projects.map(p => p.id === id ? { ...updatedProject, id } : p));
    return true;
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    return true;
  };

  // Skills CRUD
  const addSkill = (skill) => {
    const newSkill = { ...skill, id: Math.max(...skills.map(s => s.id), 0) + 1 };
    setSkills([newSkill, ...skills]);
    return true;
  };

  const updateSkill = (id, updatedSkill) => {
    setSkills(skills.map(s => s.id === id ? { ...updatedSkill, id } : s));
    return true;
  };

  const deleteSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
    return true;
  };

  // Experience CRUD
  const addExperience = (exp) => {
    const newExp = { ...exp, id: Math.max(...experience.map(e => e.id), 0) + 1 };
    setExperience([newExp, ...experience]);
    return true;
  };

  const updateExperience = (id, updatedExp) => {
    setExperience(experience.map(e => e.id === id ? { ...updatedExp, id } : e));
    return true;
  };

  const deleteExperience = (id) => {
    setExperience(experience.filter(e => e.id !== id));
    return true;
  };

  // Messages operations
  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id));
    return true;
  };

  const markMessageAsRead = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
  };

  return (
    <DataContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      skills, addSkill, updateSkill, deleteSkill,
      experience, addExperience, updateExperience, deleteExperience,
      messages, deleteMessage, markMessageAsRead,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};