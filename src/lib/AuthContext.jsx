import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user] = useState({
    email: 'marshallarends361@gmail.com',
    first_name: 'Marshall',
    last_name: 'Arends',
    full_name: 'Marshall Arends',
    role: 'admin'
  });
  const [isAuthenticated] = useState(true);
  const [isLoadingAuth] = useState(false);
  const [isLoadingPublicSettings] = useState(false);
  const [authError] = useState(null);
  const [authChecked] = useState(true);
  const [appPublicSettings] = useState(null);

  const checkAppState = async () => {};
  const checkUserAuth = async () => {};
  const logout = () => { window.location.href = "/"; };
  const navigateToLogin = () => { window.location.href = "/login"; };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
