import "../styles/WeatherChart.css";

function WeatherChart() {
  return (
    <div className="weather-chart">

      <h2>🌦 7-Day Weather Forecast</h2>

      <div className="chart">

        <div className="bar" style={{ height: "120px" }}>
          <span>30°</span>
          <p>Mon</p>
        </div>

        <div className="bar" style={{ height: "150px" }}>
          <span>31°</span>
          <p>Tue</p>
        </div>

        <div className="bar" style={{ height: "100px" }}>
          <span>29°</span>
          <p>Wed</p>
        </div>

        <div className="bar" style={{ height: "170px" }}>
          <span>32°</span>
          <p>Thu</p>
        </div>

        <div className="bar" style={{ height: "190px" }}>
          <span>33°</span>
          <p>Fri</p>
        </div>

        <div className="bar" style={{ height: "145px" }}>
          <span>31°</span>
          <p>Sat</p>
        </div>

        <div className="bar" style={{ height: "120px" }}>
          <span>30°</span>
          <p>Sun</p>
        </div>

      </div>

    </div>
  );
}

export default WeatherChart;