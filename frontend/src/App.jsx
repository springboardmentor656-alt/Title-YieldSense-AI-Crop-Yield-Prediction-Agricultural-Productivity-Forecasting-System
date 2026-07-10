import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmOnboarding from "./pages/FarmOnboarding";
import Dashboard from "./pages/Dashboard";

function App() {

  const token = localStorage.getItem("token");

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/farm-onboarding"
          element={
            token ? <FarmOnboarding /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/dashboard"
          element={
            token ? <Dashboard /> : <Navigate to="/login" />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;