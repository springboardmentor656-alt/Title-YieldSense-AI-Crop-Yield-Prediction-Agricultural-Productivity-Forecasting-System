import {
  FaLeaf,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaGlobe,
  FaFlask,
  FaSeedling,
  FaCloudRain,
  FaTint,
  FaTemperatureHigh,
} from "react-icons/fa";
import "./../styles/FarmOnboarding.css";

function FarmOnboarding() {
  return (
    <div className="farm-container">
      <div className="farm-card">

        <h1>Farm Onboarding</h1>

        <p className="subtitle">
          Enter your farm details for accurate AI crop yield prediction.
        </p>

        <div className="form-content">

          <label>Farm Name</label>
          <div className="input-box">
            <FaLeaf className="input-icon" />
            <input
              type="text"
              placeholder="Enter Farm Name"
            />
          </div>

          <label>Location</label>
          <div className="input-box">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              placeholder="Enter Location"
            />
          </div>

          <div className="row">

            <div className="column">
              <label>Latitude</label>
              <div className="input-box">
                <FaLocationArrow className="input-icon" />
                <input
                  type="number"
                  placeholder="Latitude"
                />
              </div>
            </div>

            <div className="column">
              <label>Longitude</label>
              <div className="input-box">
                <FaGlobe className="input-icon" />
                <input
                  type="number"
                  placeholder="Longitude"
                />
              </div>
            </div>

          </div>

          <label>pH Value</label>
          <div className="input-box">
            <FaFlask className="input-icon" />
            <input
              type="number"
              placeholder="Enter pH Value"
            />
          </div>

          <label>Nitrogen (N)</label>
          <div className="input-box">
            <FaSeedling className="input-icon" />
            <input
              type="number"
              placeholder="Enter Nitrogen"
            />
          </div>

          <label>Phosphorus (P)</label>
          <div className="input-box">
            <FaSeedling className="input-icon" />
            <input
              type="number"
              placeholder="Enter Phosphorus"
            />
          </div>

          <label>Potassium (K)</label>
          <div className="input-box">
            <FaSeedling className="input-icon" />
            <input
              type="number"
              placeholder="Enter Potassium"
            />
          </div>

          <label>Rainfall (mm)</label>
          <div className="input-box">
            <FaCloudRain className="input-icon" />
            <input
              type="number"
              placeholder="Enter Rainfall"
            />
          </div>

          <label>Humidity (%)</label>
          <div className="input-box">
            <FaTint className="input-icon" />
            <input
              type="number"
              placeholder="Enter Humidity"
            />
          </div>

          <label>Temperature (°C)</label>
          <div className="input-box">
            <FaTemperatureHigh className="input-icon" />
            <input
              type="number"
              placeholder="Enter Temperature"
            />
          </div>

        </div>

        <button>Submit Details</button>

      </div>
    </div>
  );
}

export default FarmOnboarding;