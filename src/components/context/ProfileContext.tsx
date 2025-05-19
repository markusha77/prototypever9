import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../../types';

// Define the Profile type
interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  website: string;
  github: string;
  twitter: string;
  telegram: string;
  slack: string;
  discord: string;
  linkedin: string;
  skills: string[];
  projects: Project[];
}

// Create a default profile
const defaultProfile: Profile = {
  name: 'Alex Johnson',
  title: 'Full-stack Developer',
  bio: 'Full-stack developer with a passion for AI and productivity tools. Working at the intersection of machine learning and user experience.',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
  location: 'San Francisco, CA',
  email: 'alex@example.com',
  website: 'https://alexjohnson.dev',
  github: 'alexjohnson',
  twitter: 'alexjohnson',
  telegram: '',
  slack: '',
  discord: '',
  linkedin: 'alexjohnson',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
  projects: []
};

// Create the context
interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfileData: Profile) => void;
  addProject: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (projectId: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Create the provider component
interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  // Initialize with data from localStorage or default values
  const [profile, setProfile] = useState<Profile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  // Function to update the profile
  const updateProfile = (newProfileData: Profile) => {
    setProfile(newProfileData);
  };

  // Function to add a new project
  const addProject = (project: Project) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      projects: [...prevProfile.projects, project]
    }));
  };

  // Function to update an existing project
  const updateProject = (updatedProject: Project) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      projects: prevProfile.projects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    }));
  };

  // Function to delete a project
  const deleteProject = (projectId: string) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      projects: prevProfile.projects.filter(project => project.id !== projectId)
    }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, addProject, updateProject, deleteProject }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Create a hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
