import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const verified = localStorage.getItem("otpVerified") === "true";
  const expiry = parseInt(localStorage.getItem("otpExpiry"), 10);
  const now = Date.now();

  if (!verified || !expiry || now > expiry) {
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("otpExpiry");
    return <Navigate to="/" replace />;
  }

  return children;
}
