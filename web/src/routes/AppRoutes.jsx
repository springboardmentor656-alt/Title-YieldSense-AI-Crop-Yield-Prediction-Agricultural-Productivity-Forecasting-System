import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import SendOTP from "../pages/auth/SendOTP";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import DatasetUpload from "../pages/datasets/DatasetUpload";
import HistoricalYieldData from "../pages/datasets/HistoricalYieldData";
import SoilData from "../pages/datasets/SoilData";
import WeatherData from "../pages/datasets/WeatherData";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/send-otp" element={<SendOTP />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/datasets/upload"
        element={
            <ProtectedRoute>
            <DatasetUpload />
            </ProtectedRoute>
        }
        />

        <Route
        path="/datasets/historical-yield"
        element={
            <ProtectedRoute>
            <HistoricalYieldData />
            </ProtectedRoute>
        }
        />

        <Route
        path="/datasets/soil"
        element={
            <ProtectedRoute>
            <SoilData />
            </ProtectedRoute>
        }
        />

        <Route
        path="/datasets/weather"
        element={
            <ProtectedRoute>
            <WeatherData />
            </ProtectedRoute>
        }
        />
    </Routes>
  );
}

export default AppRoutes;