import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ManageStudents from "./components/ManageStudents";
import VaccinationDrives from "./components/VaccinationDrives";
import Reports from "./components/Reports";

const isAuthenticated = () => {
  console.log(localStorage.getItem("token"))
  return localStorage.getItem("token") === "XYZ-token";
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/manage-students" element={<ManageStudents />} />
      <Route path="/vaccination-drives" element={<VaccinationDrives />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}
