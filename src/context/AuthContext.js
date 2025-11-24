// src/context/AuthContext.js
/**
 * Auth Context
 * Provides authentication state and methods to the entire app
 * Handles Firebase initialization gracefully with demo mode fallback
 */

import React, { createContext, useEffect, useState } from 'react';
import authService from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      try {
        if (user) {
          console.log('✅ Auth state changed:', {
            uid: user.uid,
            isDemo: user.isDemo || false,
            email: user.email || 'N/A'
          });
          setCurrentUser(user);
          setError(null);
        } else {
          console.warn('⚠️ No user signed in. Attempting anonymous login...');
          // Try to log in anonymously
          authService.loginAnonymously().then((user) => {
            setCurrentUser(user);
          });
        }
      } catch (err) {
        console.error('❌ Auth state error:', err.message);
        setError(err.message);
        // Still set a demo user on error
        setCurrentUser(authService.createDemoUser(err.message));
      } finally {
        setLoading(false);
      }
    });

    return () => {
      // Cleanup subscription
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    logout: authService.signOut.bind(authService),
    loginAnonymously: authService.loginAnonymously.bind(authService),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * Usage: const { currentUser, loading } = useAuth();
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
