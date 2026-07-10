import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CloudRain,
  Database,
  MapPinned,
  ShieldCheck,
  Sprout,
  Upload,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import authApi from "../../api/authApi";
import { datasetService } from "../../services/datasetService";
import DashboardLayout from "../../layouts/dashboard/DashboardLayout";
import SummaryCard from "../../components/datasets/SummaryCard";
import { removeToken } from "../../utils/token";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [yieldSummary, setYieldSummary] = useState(null);
  const [soilSummary, setSoilSummary] = useState(null);
  const [weatherSummary, setWeatherSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          userResponse,
          yieldResult,
          soilResult,
          weatherResult,
        ] = await Promise.all([
          authApi.get("/me"),
          datasetService.getHistoricalYieldSummary(),
          datasetService.getSoilSummary(),
          datasetService.getWeatherSummary(),
        ]);

        setUser(userResponse.data);
        setYieldSummary(yieldResult);
        setSoilSummary(soilResult);
        setWeatherSummary(weatherResult);
      } catch (error) {
        if (error.response?.status === 401) {
          removeToken();
          navigate("/login");
          return;
        }

        toast.error(
          error.response?.data?.detail ||
            "Unable to load dashboard information"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const isAdmin = user?.role === "admin";

  return (
    <DashboardLayout>
      <section>
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              YieldSense AI
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Welcome, {user?.full_name || "User"}
            </h1>

            <p className="mt-2 text-gray-600">
              Manage historical crop yield, soil, and weather datasets.
            </p>
          </div>

          {user && (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <UserRound size={22} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {user.full_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <ShieldCheck size={17} className="text-green-700" />

                <span className="capitalize text-gray-700">
                  {user.role}
                </span>

                <span className="text-gray-400">•</span>

                <span className="text-green-700">
                  {user.is_verified ? "Verified" : "Not verified"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Historical Records"
            value={
              loading
                ? "Loading..."
                : yieldSummary?.total_records?.toLocaleString() || 0
            }
            subtitle="Crop yield dataset rows"
            icon={Database}
          />

          <SummaryCard
            title="Crop Types"
            value={
              loading ? "Loading..." : yieldSummary?.total_crops || 0
            }
            subtitle="Unique crops"
            icon={Sprout}
          />

          <SummaryCard
            title="Soil States"
            value={
              loading ? "Loading..." : soilSummary?.total_states || 0
            }
            subtitle="State soil references"
            icon={MapPinned}
          />

          <SummaryCard
            title="Weather Records"
            value={
              loading
                ? "Loading..."
                : weatherSummary?.total_records?.toLocaleString() || 0
            }
            subtitle="State and year records"
            icon={CloudRain}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            Data Collection Modules
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Open and review the datasets currently stored in PostgreSQL.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ModuleCard
              icon={Database}
              title="Historical Crop Yield"
              description="Review crop, year, season, state, area, production, rainfall, fertilizer, pesticide, and yield records."
              path="/datasets/historical-yield"
              buttonText="View Yield Data"
            />

            <ModuleCard
              icon={Sprout}
              title="State Soil Data"
              description="Review nitrogen, phosphorus, potassium, and pH reference values for each state."
              path="/datasets/soil"
              buttonText="View Soil Data"
            />

            <ModuleCard
              icon={CloudRain}
              title="State Weather Data"
              description="Review annual temperature, rainfall, and humidity information by state."
              path="/datasets/weather"
              buttonText="View Weather Data"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Dataset Coverage
            </h2>

            <div className="mt-5 space-y-4">
              <CoverageRow
                label="Historical years"
                value={
                  yieldSummary?.minimum_year &&
                  yieldSummary?.maximum_year
                    ? `${yieldSummary.minimum_year} – ${yieldSummary.maximum_year}`
                    : "No data"
                }
              />

              <CoverageRow
                label="Yield dataset states"
                value={yieldSummary?.total_states ?? 0}
              />

              <CoverageRow
                label="Weather years"
                value={
                  weatherSummary?.minimum_year &&
                  weatherSummary?.maximum_year
                    ? `${weatherSummary.minimum_year} – ${weatherSummary.maximum_year}`
                    : "No data"
                }
              />

              <CoverageRow
                label="Weather dataset states"
                value={weatherSummary?.total_states ?? 0}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <div className="mt-5 space-y-3">
              {isAdmin && (
                <Link
                  to="/datasets/upload"
                  className="flex items-center justify-between rounded-xl bg-green-700 px-5 py-4 font-semibold text-white transition hover:bg-green-800"
                >
                  <span className="flex items-center gap-3">
                    <Upload size={20} />
                    Upload Reference Datasets
                  </span>

                  <span>→</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center justify-between rounded-xl border border-gray-300 px-5 py-4 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <UserRound size={20} />
                  Manage Profile
                </span>

                <span>→</span>
              </Link>
            </div>

            {!isAdmin && user && (
              <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                Dataset uploading is restricted to administrators. Farmer
                accounts can view the imported reference data.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="font-bold text-blue-900">
            Current milestone status
          </h2>

          <p className="mt-2 text-sm leading-6 text-blue-800">
            Authentication and agricultural dataset management are active.
            Yield prediction, soil analysis, weather analysis, analytics,
            and recommendations will be added in their respective later
            milestones.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  description,
  path,
  buttonText,
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="w-fit rounded-xl bg-green-100 p-3 text-green-700">
        <Icon size={25} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
        {description}
      </p>

      <Link
        to={path}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800"
      >
        {buttonText}
      </Link>
    </div>
  );
}

function CoverageRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
      <span className="text-sm text-gray-600">{label}</span>

      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default Dashboard;