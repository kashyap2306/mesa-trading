import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDarkMode } from '../contexts/DarkModeContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireDashboard = false }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();

  useEffect(() => {
    const checkUserAccess = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Check user role and status
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role || 'user');
        }

        // Check premium status from premiumRequests collection
        const premiumDoc = await getDoc(doc(db, 'premiumRequests', currentUser.uid));
        if (premiumDoc.exists()) {
          const premiumData = premiumDoc.data();
          setUserStatus(premiumData.status || 'inactive');
        } else {
          setUserStatus('inactive');
        }
      } catch (error) {
        console.error('Error checking user access:', error);
        setUserStatus('inactive');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkUserAccess();
    }
  }, [currentUser, authLoading]);

  if (authLoading || loading) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={theme.text.muted}>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check admin access
  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Check dashboard access - only allow if status is 'active'
  if (requireDashboard && userStatus !== 'active') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;