import React from "react";
import { Routes, Route } from "react-router-dom";
import Calculator from "./Component/Calculator"; // Calculator component
import OtpPage from "./Component/OtpPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OtpPage />} />
      <Route path="/calculator" element={<Calculator />} />
    </Routes>
  );
}
