"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Tractor,
  CloudSun,
  ChartColumnIncreasing,
} from "lucide-react";

export default function LandingPage() {

  return (

    <div className="relative min-h-screen">

      {/* Background Image */}

      <Image
        src="/images/OIP.jpg"
        alt="Farm"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen text-white px-8">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >

          <p className="uppercase tracking-[6px] text-green-300 font-semibold">

            Smart Agriculture

          </p>

          <h1 className="text-6xl lg:text-7xl font-extrabold mt-4">

            YieldSense AI

          </h1>

          <p className="mt-8 text-xl text-gray-200 leading-8">

            AI-Powered Crop Yield Prediction &
            Agricultural Productivity Forecasting Platform.

            <br />

            Empowering farmers with intelligent weather insights,
            farm management and data-driven decision making.

          </p>

          {/* Buttons */}

          <div className="flex gap-6 justify-center mt-12">

            <Link
              href="/register"
              className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="px-8 py-4 rounded-xl border-2 border-white hover:bg-white hover:text-black transition font-semibold"
            >
              Login
            </Link>

          </div>

        </motion.div>

        {/* Feature Cards */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full"
        >

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">

            <Tractor
              size={42}
              className="text-green-400"
            />

            <h2 className="text-2xl font-bold mt-5">

              Farm Management

            </h2>

            <p className="mt-4 text-gray-200">

              Manage all your farms in one
              centralized dashboard.

            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">

            <CloudSun
              size={42}
              className="text-yellow-300"
            />

            <h2 className="text-2xl font-bold mt-5">

              Live Weather

            </h2>

            <p className="mt-4 text-gray-200">

              Real-time weather monitoring
              for smarter farming decisions.

            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">

            <ChartColumnIncreasing
              size={42}
              className="text-blue-400"
            />

            <h2 className="text-2xl font-bold mt-5">

              AI Predictions

            </h2>

            <p className="mt-4 text-gray-200">

              Predict crop yield using
              machine learning algorithms.

            </p>

          </div>

        </motion.div>

      </div>

    </div>

  );

}