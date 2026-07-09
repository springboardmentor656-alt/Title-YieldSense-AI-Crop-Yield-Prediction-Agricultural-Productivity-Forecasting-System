import { FaBell, FaUserCircle } from "react-icons/fa";
import "../styles/Header.css";

function Header() {
  return (
    <div className="header">

      <div className="header-left">
        <h1>Good Morning, Bhargavi 👋</h1>
        <p>Here's your farm summary for today.</p>
      </div>

      <div className="header-right">

        <button className="notification-btn">
          <FaBell />
        </button>

        <div className="profile">

          <FaUserCircle className="profile-icon" />

          <div>
            <h3>Farmer</h3>
            <p>Profile</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Header;