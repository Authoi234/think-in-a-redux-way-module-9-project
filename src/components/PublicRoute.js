import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const isLoggedIn = useAuth();

    return !isLoggedIn ? children : <Navigate to="/inbox" />;
};

export default PublicRoute;