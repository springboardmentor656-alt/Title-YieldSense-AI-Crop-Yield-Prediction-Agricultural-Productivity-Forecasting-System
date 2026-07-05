export default function FarmProfile() {
  return (
    <div className="min-h-screen bg-green-50 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Farm Profile
        </h1>

        <div className="grid grid-cols-2 gap-4">

          <input
            placeholder="Farm Name"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Location"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Crop Type"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Soil Type"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Land Area (Acres)"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Irrigation Type"
            className="border p-3 rounded-lg"
          />

        </div>

        <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">
          Save Farm Details
        </button>

      </div>
    </div>
  );
}