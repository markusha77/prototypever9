import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectForm from './components/profile/ProjectForm';
import ProjectList from './components/profile/ProjectList';
import ProfilePage from './components/profile/ProfilePage';
// Import other components as needed

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/projects/new" element={<ProjectForm />} />
      <Route path="/projects/edit/:projectId" element={<ProjectForm />} />
      <Route path="/profile" element={<ProfilePage />} />
      {/* Add other routes as needed */}
      <Route path="*" element={<ProjectList />} /> {/* Default route */}
    </Routes>
  );
};

export default App;
