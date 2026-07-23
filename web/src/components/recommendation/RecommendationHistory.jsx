import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  History,
  LoaderCircle,
  Sprout,
} from "lucide-react";

import DashboardLayout from "../../layouts/dashboard/DashboardLayout";
import RecommendationHistoryTable from "../../components/recommendation/RecommendationHistoryTable";

import { getRecommendationHistory } from "../../services/recommendationService";
import { getApiErrorMessage } from "../../utils/apiError";

function extractRecommendations(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.recommendations)) {
    return response.recommendations;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

function RecommendationHistory() {
  const [recommendations, setRecommendations] =
    useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);

        const response =
          await getRecommendationHistory();

        setRecommendations(
          extractRecommendations(response)
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to load recommendation history."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-7">
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-green-50 via-white to-white px-6 py-7 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  <History size={18} />
                  Recommendation Records
                </div>

                <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900">
                  Crop Recommendation History
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                  Review crops previously recommended for
                  your farms, seasons, and cultivation years.
                </p>
              </div>

              <Link
                to="/recommendation"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
              >
                <ArrowLeft size={18} />
                New Recommendation
              </Link>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="text-center">
              <LoaderCircle
                size={34}
                className="mx-auto animate-spin text-green-700"
              />

              <p className="mt-4 text-sm font-medium text-gray-600">
                Loading recommendation history...
              </p>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <RecommendationHistoryTable
            recommendations={recommendations}
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <Sprout size={27} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No recommendations yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Generate your first crop recommendation to
              begin building recommendation history.
            </p>

            <Link
              to="/recommendation"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
            >
              <Sprout size={18} />
              Generate Recommendation
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default RecommendationHistory;