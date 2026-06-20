import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};
