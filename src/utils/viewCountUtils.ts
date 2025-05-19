// Utility functions for tracking project view counts

// Get view count for a project
export const getProjectViewCount = (projectId: string): number => {
  try {
    const viewCounts = JSON.parse(localStorage.getItem('projectViewCounts') || '{}');
    return viewCounts[projectId] || 0;
  } catch (error) {
    console.error('Error getting view count:', error);
    return 0;
  }
};

// Increment view count for a project
export const incrementProjectViewCount = (projectId: string): void => {
  try {
    const viewCounts = JSON.parse(localStorage.getItem('projectViewCounts') || '{}');
    viewCounts[projectId] = (viewCounts[projectId] || 0) + 1;
    localStorage.setItem('projectViewCounts', JSON.stringify(viewCounts));
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
};
