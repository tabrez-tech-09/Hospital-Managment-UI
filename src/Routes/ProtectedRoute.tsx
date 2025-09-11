import React, { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // ✅ Redux se JWT token lao
  const token = useSelector((state: any) => state.jwt);

  // ✅ Agar token hai → matlab user already logged in → home pe bhej do
  if (token) {
     return children;
  }

  // ✅ Agar token nahi hai → normal public route allow karo
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;