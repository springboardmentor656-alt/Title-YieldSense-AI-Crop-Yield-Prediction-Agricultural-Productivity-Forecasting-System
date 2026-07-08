import { FaEnvelope, FaLock } from "react-icons/fa";
import "./../styles/Login.css";

function Login() {
  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Login</h1>
        <label>Email</label>
        <div className="input-box">
            <FaEnvelope className="input-icon" />
            <input
            type="email"
            placeholder="Enter Email"
            />
            </div>
            <label>Password</label>
            <div className="input-box">
                <FaLock className="input-icon" />
                <input
                type="password"
                placeholder="Enter Password"
                />
                </div>

        <button>Login</button>

        <p>
          Don't have an account? <span>Register</span>
        </p>

      </div>

    </div>
  );
}

export default Login;