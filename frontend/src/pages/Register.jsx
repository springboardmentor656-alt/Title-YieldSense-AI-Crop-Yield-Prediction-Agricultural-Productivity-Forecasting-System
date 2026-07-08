import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./../styles/Register.css";

function Register() {
  return (
    <div className="register-container">

      <div className="register-card">

        <h1>Register</h1>

        <label>Full Name</label>
        <div className="input-box">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Enter your full name"
          />
        </div>

        <label>Email</label>
        <div className="input-box">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <label>Password</label>
        <div className="input-box">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <label>Confirm Password</label>
        <div className="input-box">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Confirm your password"
          />
        </div>

        <button>Register</button>

        <p>
          Already have an account? <span>Login</span>
        </p>

      </div>

    </div>
  );
}

export default Register;