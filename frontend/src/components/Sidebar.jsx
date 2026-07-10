import {
  FaTachometerAlt,
  FaLeaf,
  FaCloudSun,
  FaRobot,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import "../styles/Sidebar.css";
import logo from "../assets/YieldSense AI.png";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">

      <div className="sidebar-top">

        <img src={logo} alt="logo" className="logo" />

        <h2>YieldSense AI</h2>

      </div>

      <ul className="menu">

        <li className="active"
  onClick={() => navigate("/dashboard")}
   >
          <FaTachometerAlt />
          Dashboard
        </li>

        <li onClick={() => navigate("/farm-onboarding")}>
          <FaLeaf />
          Farm Onboarding
        </li>

        <li>
          <FaCloudSun />
          Weather
        </li>

        <li>
          <FaRobot />
          AI Prediction
        </li>

        <li>
          <FaChartBar />
          Reports
        </li>

        <li>
          <FaCog />
          Settings
        </li>

      </ul>

      <div className="sidebar-bottom">

        <button className="profile-btn">
          <FaUser />
          Profile
        </button>

        <button className="logout-btn"
        className="logout-btn"
  onClick={() => {

    localStorage.removeItem("token");

    navigate("/login");

  }}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;