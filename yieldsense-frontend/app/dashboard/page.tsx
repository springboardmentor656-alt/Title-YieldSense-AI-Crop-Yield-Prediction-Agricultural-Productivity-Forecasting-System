export default function Dashboard() {
  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-purple-700 mb-6">
        Dashboard
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <p className="text-lg mb-4">
          🌾 Total Farms: 25
        </p>

        <p className="text-lg mb-4">
          📈 Average Yield: 4.8 Tons/Hectare
        </p>

        <p className="text-lg">
          🤖 AI Prediction Accuracy: 92%
        </p>
      </div>
    </div>
  );
}