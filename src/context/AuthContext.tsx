'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthUser, LoginCredentials, RegisterCredentials } from '@/types';
// Removed localStorage-based auth functions - now using HTTP-only cookies

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGOUT' };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false, // Start with false to avoid unnecessary loading states
    isAuthenticated: false,
  });

  useEffect(() => {
    // Only check auth on protected routes or when explicitly needed
    const currentPath = window.location.pathname;
    const protectedPaths = ['/profile', '/admin'];
    const needsAuth = protectedPaths.some(path => currentPath.startsWith(path));
    
    if (needsAuth) {
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user is authenticated via HTTP-only cookie
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const { user } = await response.json();
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          token: 'cookie-auth', // HTTP-only cookie auth
          role: user.role,
        };
        dispatch({ type: 'SET_USER', payload: authUser });
      } else {
        // 401 is expected for non-authenticated users - not an error
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      // Only log unexpected errors (network issues, etc.)
      if (error instanceof Error && error.message !== 'Failed to fetch') {
        console.error('Auth check error:', error);
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          name: `${data.user.firstName} ${data.user.lastName}`,
          token: 'cookie-auth', // HTTP-only cookie auth
          role: data.user.role,
        };

        dispatch({ type: 'LOGIN_SUCCESS', payload: authUser });
        return { success: true };
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          name: `${data.user.firstName} ${data.user.lastName}`,
          token: 'cookie-auth', // HTTP-only cookie auth
          role: data.user.role,
        };

        dispatch({ type: 'LOGIN_SUCCESS', payload: authUser });
        return { success: true };
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    loading: state.isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}