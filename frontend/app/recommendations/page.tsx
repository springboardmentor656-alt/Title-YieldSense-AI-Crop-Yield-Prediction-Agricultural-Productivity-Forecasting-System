"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecommendationsPage() {
  const router = useRouter();

  const [crop, setCrop] = useState("");
  const [soilPH, setSoilPH] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const recommendations = [
    {
      title: "🌱 Crop Recommendation",
      text:
        crop === ""
          ? "Enter crop details to receive AI recommendations."
          : `For ${crop}, maintain balanced nutrients and monitor plant health regularly.`,
    },
    {
      title: "💧 Irrigation",
      text:
        Number(rainfall) < 50
          ? "Rainfall is low. Increase irrigation frequency."
          : "Current rainfall is sufficient. Avoid overwatering.",
    },
    {
      title: "🧪 Soil Health",
      text:
        Number(soilPH) < 6.5
          ? "Soil is acidic. Apply agricultural lime."
          : Number(soilPH) > 7.5
          ? "Soil is alkaline. Apply gypsum or organic compost."
          : "Soil pH is optimal for most crops.",
    },
    {
      title: "🐛 Pest Control",
      text: "Inspect crops every week and use integrated pest management (IPM) techniques.",
    },
    {
      title: "🌾 Fertilizer",
      text: "Apply nitrogen during vegetative growth and phosphorus before flowering.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            ← Dashboard
          </button>
          <span className="text-2xl">💡</span>
          <span className="text-xl font-bold">AI Recommendations</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
            Enter Farm Information
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-green-700 uppercase tracking-wide mb-1.5">
                  Crop Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wheat"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-green-700 uppercase tracking-wide mb-1.5">
                  Soil pH
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="6.5"
                  value={soilPH}
                  onChange={(e) => setSoilPH(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-green-700 uppercase tracking-wide mb-1.5">
                  Rainfall (mm)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="850"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition shadow-sm"
            >
              💡 Get Recommendations →
            </button>
          </form>
        </div>

        {/* Recommendation Cards */}
        {!submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="text-6xl mb-5">💡</div>
            <div className="text-lg font-bold text-gray-700 mb-2">Ready to Recommend</div>
            <div className="text-sm text-gray-400">
              Fill in the farm information above and click "Get Recommendations"
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-green-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
