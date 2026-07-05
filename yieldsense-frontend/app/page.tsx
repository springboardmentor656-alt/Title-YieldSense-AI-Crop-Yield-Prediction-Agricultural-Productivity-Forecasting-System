import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">

      <h1 className="text-5xl font-bold text-green-700 mb-4">
        YieldSense AI
      </h1>

      <p className="text-gray-700 mb-10 text-xl">
        AI-Powered Crop Yield Prediction System
      </p>

      <div className="flex flex-col gap-4 w-80">

        <Link href="/login">
          <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
            Login Page
          </button>
        </Link>

        <Link href="/farm-profile">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
            Farm Profile
          </button>
        </Link>

        <Link href="/dashboard">
          <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700">
            Dashboard
          </button>
        </Link>

      </div>

    </div>
  );
}