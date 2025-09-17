import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle login-first flow for protected actions
 * @returns {Function} requireAuth - Function that checks authentication before executing action
 */
export const useRequireAuth = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (action, redirectPath = '/login') => {
    if (!currentUser) {
      // Store the intended action in sessionStorage to execute after login
      if (typeof action === 'function') {
        try {
          sessionStorage.setItem('pendingAction', 'true');
        } catch (error) {
          console.error('Error storing pending action:', error);
        }
      }
      navigate(redirectPath);
      return false;
    }

    // User is authenticated, execute the action
    if (typeof action === 'function') {
      try {
        action();
      } catch (error) {
        console.error('Error executing action:', error);
      }
    }
    return true;
  };

  return requireAuth;
};

/**
 * Utility function to execute pending actions after login
 */
export const executePendingAction = () => {
  try {
    const hasPendingAction = sessionStorage.getItem('pendingAction');
    if (hasPendingAction) {
      sessionStorage.removeItem('pendingAction');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error executing pending action:', error);
    return false;
  }
};

/**
 * Higher-order component to wrap buttons with login-first flow
 */
export const withAuthRequired = (WrappedComponent) => {
  return function WithAuthRequired(props) {
    const requireAuth = useRequireAuth();

    const handleClick = (originalOnClick) => {
      return (e) => {
        e.preventDefault();
        requireAuth(() => {
          if (typeof originalOnClick === 'function') {
            originalOnClick(e);
          }
        });
      };
    };

    return (
      <WrappedComponent
        {...props}
        onClick={handleClick(props.onClick)}
      />
    );
  };
};
