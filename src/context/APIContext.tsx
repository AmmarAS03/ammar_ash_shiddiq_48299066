import React, { createContext, useContext } from 'react';
import { APIClient } from '../api/client';

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Mjk5MDYifQ.uv2euB3WMOZ18RKDS-ChV3JHQ00mf30Qqd-pREK-xGo";

interface APIContextType {
  apiClient: APIClient;
}

/**
 * Context for managing API client instance
 * Initial value is undefined and will be set by APIProvider
 */
const APIContext = createContext<APIContextType | undefined>(undefined);

/**
 * Provider component for the API context
 * 
 * Creates an instance of APIClient with JWT authentication and provides it to child components.
 * Wrap the app or a section of the app with this provider to enable API functionality.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to the API context
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <APIProvider>
 *       <ComponentExample />
 *     </APIProvider>
 *   );
 * }
 * ```
 */
export function APIProvider({ children }: { children: React.ReactNode }) {
  const apiClient = new APIClient(JWT);

  return (
    <APIContext.Provider value={{ apiClient }}>
      {children}
    </APIContext.Provider>
  );
}

/**
 * Custom hook to access the API context
 * 
 * Provides access to the APIClient instance for making API requests.
 * Must be used within an APIProvider component.
 * 
 * @returns {APIContextType} The API context value containing the apiClient
 * @throws {Error} If used outside of an APIProvider
 * 
 * @example
 * ```tsx
 * function ComponentExample() {
 *   const { apiClient } = useAPI();
 *   
 *   const fetchData = async () => {
 *     try {
 *       const data = await apiClient.someApiMethod();
 *       // Handle the data
 *     } catch (error) {
 *       // Handle any errors
 *     }
 *   };
 *   
 *   return (
 *     // component JSX
 *   );
 * }
 * ```
 */
export function useAPI() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error('useAPI must be used within an APIProvider');
  }
  return context;
}