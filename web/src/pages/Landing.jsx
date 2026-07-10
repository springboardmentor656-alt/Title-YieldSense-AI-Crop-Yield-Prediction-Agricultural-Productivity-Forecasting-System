import { Link } from "react-router-dom";
import { Leaf, BarChart3, CloudSun } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2 text-2xl font-bold text-green-800">
          <Leaf />
          YieldSense AI
        </div>

        <div className="flex gap-3">
          <Link to="/login">
            <button className="rounded-lg border border-green-700 px-4 py-2 text-green-700 hover:bg-green-100">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800">
              Create Account
            </button>
          </Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <h1 className="max-w-4xl text-5xl font-bold leading-tight text-gray-900">
          AI-Powered Crop Yield Prediction & Agricultural Forecasting
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Help farmers estimate crop production, understand weather impact,
          analyze soil data, and make better farming decisions.
        </p>

        <div className="mt-8 flex gap-4">
          <Link to="/register">
            <button className="rounded-xl bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800">
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button className="rounded-xl border border-green-700 px-6 py-3 font-medium text-green-700 hover:bg-green-100">
              Login
            </button>
          </Link>
        </div>

        <div className="mt-16 grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <BarChart3 className="mx-auto text-green-700" size={40} />
            <h3 className="mt-4 text-xl font-semibold">Yield Forecasting</h3>
            <p className="mt-2 text-gray-600">
              Predict future crop productivity using data-driven insights.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <CloudSun className="mx-auto text-green-700" size={40} />
            <h3 className="mt-4 text-xl font-semibold">Weather Analysis</h3>
            <p className="mt-2 text-gray-600">
              Understand rainfall, temperature, and climate impact.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <Leaf className="mx-auto text-green-700" size={40} />
            <h3 className="mt-4 text-xl font-semibold">Soil Insights</h3>
            <p className="mt-2 text-gray-600">
              Analyze soil quality and support better crop planning.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;