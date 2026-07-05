export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
          YieldSense AI
        </h1>

        <p className="text-center text-gray-500 mb-8">
          AI-Powered Crop Yield Prediction
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 border rounded-lg mb-6"
        />

        <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
          Login
        </button>

      </div>
    </div>
  );
}