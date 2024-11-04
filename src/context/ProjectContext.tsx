import React, { createContext, useContext, useState } from 'react';

/**
 * Type definition for the Project context
 * 
 * @interface ProjectContextType
 * @property {number} refreshTrigger - Counter that increments to trigger refreshes
 * @property {() => void} triggerRefresh - Function to increment the refresh counter
 */
type ProjectContextType = {
  refreshTrigger: number;
  triggerRefresh: () => void;
};

/**
 * Context for managing project-wide refresh state
 * Initial value is undefined and will be set by ProjectProvider
 */
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/**
 * Provider component for the Project context
 * 
 * Manages a refresh counter that can be used to trigger refreshes across the app.
 * Wrap a section of the app/the whole app with this provider to enable refresh functionality.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to the context
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ProjectProvider>
 *       <ComponentExample />
 *     </ProjectProvider>
 *   );
 * }
 * ```
 */
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ProjectContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Custom hook to access the Project context
 * 
 * Provides access to the refresh trigger value and function to trigger refreshes.
 * Must be used within a ProjectProvider component.
 * 
 * @returns {ProjectContextType} The project context value
 * @throws {Error} If used outside of a ProjectProvider
 * 
 * @example
 * ```tsx
 * function ComponentExample() {
 *   const { refreshTrigger, triggerRefresh } = useProjectContext();
 *   
 *   useEffect(() => {
 *     // Perform refresh when refreshTrigger changes
 *   }, [refreshTrigger]);
 *   
 *   return (
 *     <button onClick={triggerRefresh}>
 *       Refresh Data
 *     </button>
 *   );
 * }
 * ```
 */
export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}