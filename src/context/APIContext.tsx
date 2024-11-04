import React, { createContext, useContext } from 'react';
import { APIClient } from '../api/client';

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Mjk5MDYifQ.uv2euB3WMOZ18RKDS-ChV3JHQ00mf30Qqd-pREK-xGo";

interface APIContextType {
  apiClient: APIClient;
}

const APIContext = createContext<APIContextType | undefined>(undefined);

export function APIProvider({ children }: { children: React.ReactNode }) {
  const apiClient = new APIClient(JWT);

  return (
    <APIContext.Provider value={{ apiClient }}>
      {children}
    </APIContext.Provider>
  );
}

export function useAPI() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error('useAPI must be used within an APIProvider');
  }
  return context;
}