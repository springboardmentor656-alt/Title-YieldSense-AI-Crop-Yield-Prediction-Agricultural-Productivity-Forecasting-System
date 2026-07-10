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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createFarm } from "../services/farmService";

function FarmOnboarding() {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  farm_name: "",
  location: "",
  latitude: "",
  longitude: "",
  ph: "",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  rainfall: "",
  humidity: "",
  temperature: "",
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
    await createFarm({
      farm_name: formData.farm_name,
      location: formData.location,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      ph: Number(formData.ph),
      nitrogen: Number(formData.nitrogen),
      phosphorus: Number(formData.phosphorus),
      potassium: Number(formData.potassium),
      rainfall: Number(formData.rainfall),
      humidity: Number(formData.humidity),
      temperature: Number(formData.temperature),
    });

    alert("Farm Details Saved Successfully 🌾");

    navigate("/dashboard");

  } catch (error) {
    console.log(error);

    alert("Failed to Save Farm Details ❌");
  }
};

  return (
    <div className="farm-container">
      <div className="farm-card">

        <h1>Farm Onboarding</h1>

        <p className="subtitle">
          Enter your farm details for accurate AI crop yield prediction.
        </p>

        <form className="form-content" onSubmit={handleSubmit}>

          <label>Farm Name</label>
          <div className="input-box">
            <FaLeaf className="input-icon" />
            <input
              type="text"
              name="farm_name"
              placeholder="Enter Farm Name"
              value={formData.farm_name}
              onChange={handleChange}
              required
           />
          </div>

          <label>Location</label>
          <div className="input-box">
            <FaMapMarkerAlt className="input-icon" />
            <input
  type="text"
  name="location"
  placeholder="Enter Location"
  value={formData.location}
  onChange={handleChange}
  required
/>
          </div>

          <div className="row">

            <div className="column">
              <label>Latitude</label>
              <div className="input-box">
                <FaLocationArrow className="input-icon" />
                <input
  type="number"
  name="latitude"
  placeholder="Latitude"
  value={formData.latitude}
  onChange={handleChange}
  required
/>
              </div>
            </div>

            <div className="column">
              <label>Longitude</label>
              <div className="input-box">
                <FaGlobe className="input-icon" />
                <input
  type="number"
  name="longitude"
  placeholder="Longitude"
  value={formData.longitude}
  onChange={handleChange}
  required
/>
              </div>
            </div>

          </div>

          <label>pH Value</label>
          <div className="input-box">
            <FaFlask className="input-icon" />
            <input
  type="number"
  name="ph"
  placeholder="Enter pH Value"
  value={formData.ph}
  onChange={handleChange}
  required
/>
          </div>

          <label>Nitrogen (N)</label>
          <div className="input-box">
            <FaSeedling className="input-icon" />
            <input
  type="number"
  name="nitrogen"
  placeholder="Enter Nitrogen"
  value={formData.nitrogen}
  onChange={handleChange}
  required
/>
          </div>

          <label>Phosphorus (P)</label>
          <div className="input-box">
            <FaSeedling className="input-icon" />
            <input
  type="number"
  name="phosphorus"
  placeholder="Enter Phosphorus"
  value={formData.phosphorus}
  onChange={handleChange}
  required
/>
          </div>

          <label>Potassium (K)</label>
          <div className="input-box">
            <FaSeedling className="input-icon" />
            <input
  type="number"
  name="potassium"
  placeholder="Enter Potassium"
  value={formData.potassium}
  onChange={handleChange}
  required
/>
          </div>

          <label>Rainfall (mm)</label>
          <div className="input-box">
            <FaCloudRain className="input-icon" />
            <input
  type="number"
  name="rainfall"
  placeholder="Enter Rainfall"
  value={formData.rainfall}
  onChange={handleChange}
  required
/>
          </div>

          <label>Humidity (%)</label>
          <div className="input-box">
            <FaTint className="input-icon" />
            <input
  type="number"
  name="humidity"
  placeholder="Enter Humidity"
  value={formData.humidity}
  onChange={handleChange}
  required
/>
          </div>

          <label>Temperature (°C)</label>
          <div className="input-box">
            <FaTemperatureHigh className="input-icon" />
            <input
  type="number"
  name="temperature"
  placeholder="Enter Temperature"
  value={formData.temperature}
  onChange={handleChange}
  required
/>
          </div>

          <button type="submit">
            Submit Details
          </button>
        
        </form>
        </div>
        </div>
  );
}

export default FarmOnboarding;