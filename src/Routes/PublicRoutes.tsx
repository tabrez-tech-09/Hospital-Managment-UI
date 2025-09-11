import React, { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoutes: React.FC<PublicRouteProps> = ({ children }) => {
  // ✅ Redux se JWT token aur user info lao
  const token = useSelector((state: any) => state.jwt);
  const user = useSelector((state: any) => state.user);

  // ✅ Agar token hai → role ke hisaab se redirect
  if (token && user?.role) {
    if (user.role === "ADMIN") {
      return <Navigate to="/AdminDashBoard" replace />;
    } else if (user.role === "PATIENT") {
      return <Navigate to="/patient/dashboard" replace />;
    } else if (user.role === "DOCTOR") {
      return <Navigate to="/doctor/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />; // fallback
    }
  }

  // ✅ Agar token nahi hai → normal public route allow karo
  return children;
};

export default PublicRoutes;

