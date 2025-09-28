import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Team } from '@/data/mockData'; // Assuming you have this type defined
import apiFetch from '@/lib/api';

interface AuthContextType {
  currentTeam: Team | null;
  token: string | null;
  isLoading: boolean;
  login: (teamName: string, password: string) => Promise<void>;
  logout: () => void;
  refetchTeam: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setCurrentTeam(null);
    setToken(null);
    localStorage.removeItem('authToken');
  }, []);

  const fetchTeamData = useCallback(async () => {
    // Only fetch if a token exists
    if (localStorage.getItem('authToken')) {
      try {
        const teamData = await apiFetch('/teams/me');
        setCurrentTeam(teamData);
      } catch (error) {
        console.error("Session expired or invalid. Logging out.");
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  // --- SIMPLIFIED LOGIN FUNCTION ---
  const login = async (teamName: string, password: string) => {
    const data = await apiFetch('/teams/login', {
        method: 'POST',
        // `apiFetch` now handles the headers and body type correctly
        body: new URLSearchParams({ username: teamName, password }),
    });
    
    // The error handling is now done inside apiFetch, so we only handle success here.
    const newToken = data.access_token;
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    await fetchTeamData(); // Fetch user data after getting the new token
  };

  const refetchTeam = async () => {
    setIsLoading(true);
    await fetchTeamData();
  };
  
  return (
    <AuthContext.Provider value={{ currentTeam, token, isLoading, login, logout, refetchTeam }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};