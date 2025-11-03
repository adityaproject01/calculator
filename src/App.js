import React from "react";
// import { Routes, Route } from "react-router-dom";
import Calculator from "./Component/Calculator"; // Calculator component
// import OtpPage from "./Component/OtpPage";
// import ProtectedRoute from "./Component/ProtectedRoute";

export default function App() {
  return (
    <Calculator/>
    // <Routes>
    //     <Route path="/" element={<OtpPage />} />
    //     <Route
    //       path="/calculator"
    //       element={
    //         <ProtectedRoute>
    //           <Calculator />
    //         </ProtectedRoute>
    //       }
    //     />
    //   </Routes>
  );
}
