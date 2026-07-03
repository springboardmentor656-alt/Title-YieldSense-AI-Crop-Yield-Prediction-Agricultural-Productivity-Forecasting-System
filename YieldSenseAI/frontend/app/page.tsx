import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <main className="z-10 text-center space-y-8 p-8 max-w-4xl mx-auto glass-dark rounded-3xl">
        <h1 className="text-6xl font-extrabold tracking-tight">
          Welcome to <span className="text-gradient">YieldSense AI</span>
        </h1>
        
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The next generation of precision agriculture. Predict crop yields, analyze weather patterns, and optimize your farm's productivity using advanced AI forecasting models.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/login" className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-green-500/30">
            Login to Dashboard
          </Link>
          <Link href="/register" className="px-8 py-4 rounded-full glass text-white font-bold text-lg hover:bg-white/20 transition-all">
            Create an Account
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-green-400 mb-2">Yield Prediction</h3>
            <p className="text-slate-400">AI models forecasting harvests accurately.</p>
          </div>
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-blue-400 mb-2">Weather Insights</h3>
            <p className="text-slate-400">Deep integration with historical weather data.</p>
          </div>
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-purple-400 mb-2">Soil Analysis</h3>
            <p className="text-slate-400">Actionable recommendations for crop planning.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
