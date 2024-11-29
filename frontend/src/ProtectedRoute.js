import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, token }) {
    // If the user is not logged in, redirect to the login page
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;
