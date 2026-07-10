import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import { loginUser } from "../services/authService";
import "./../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);
      const response = await loginUser(formData);

      localStorage.setItem("token", response.access_token);

      alert("Login Successful ✅");

      navigate("/dashboard");
    } catch (error) {
  console.log(error);
  console.log(error.response);

  alert(error.response?.data?.detail || "Login Failed");
}
  };

  return (
    <div className="login-container">

      <div className="login-card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <div className="input-box">
            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p>
          Don't have an account? <span>Register</span>
        </p>

      </div>
    </div>
  );
}
export default Login;