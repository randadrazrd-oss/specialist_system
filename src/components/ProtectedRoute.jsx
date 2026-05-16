import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userProfile, userRole, loading } = useAuth();

  console.log('[ProtectedRoute] loading:', loading, 'currentUser:', currentUser?.uid ?? 'null', 'userRole:', userRole, 'allowedRoles:', allowedRoles);

  // Still initialising auth — render nothing until we know who the user is
  if (loading) return null;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Profile not fetched yet — wait instead of redirecting
    if (!userProfile) return null;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
