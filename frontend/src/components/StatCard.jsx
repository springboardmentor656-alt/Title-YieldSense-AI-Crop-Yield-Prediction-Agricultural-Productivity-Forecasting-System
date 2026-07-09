import "../styles/StatCard.css";

function StatCard({ icon, title, value, description }) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <h2>{value}</h2>

      <p>{description}</p>

    </div>
  );
}

export default StatCard;