import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    let paddedBase64 = base64;
    if (pad === 2) paddedBase64 += '==';
    else if (pad === 3) paddedBase64 += '=';
    
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      if (decoded) {
        return { userId: decoded.userId, username: decoded.username };
      }
    }
    return null;
  });

  const login = (newToken) => {
    // TODO: Practice Task - Complete the login function
    // 1. Save the newToken to localStorage under 'token'.
    // 2. Update the token state using setToken.
    // 3. Decode the token using decodeToken(newToken).
    // 4. If valid, set the user state to { userId: decoded.userId, username: decoded.username }.
    //    Otherwise, set the user state to null.
    
    // Partial code structure:
    const decoded = decodeToken(newToken);
    if (decoded) {
      // Set local storage, token state, and user state here
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    // TODO: Practice Task - Complete the logout function
    // 1. Remove the 'token' item from localStorage.
    // 2. Set both token and user state to null.
    
    // Partial code structure:
    setUser(null);
  };

  // Keep state sync in case of local storage changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken !== token) {
        if (savedToken) {
          setToken(savedToken);
          const decoded = decodeToken(savedToken);
          if (decoded) {
            setUser({ userId: decoded.userId, username: decoded.username });
          } else {
            setUser(null);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
