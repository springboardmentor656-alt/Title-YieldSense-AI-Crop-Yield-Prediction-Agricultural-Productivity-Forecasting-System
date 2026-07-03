"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication and route directly to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      <div className="z-10 w-full max-w-md p-8 glass-dark rounded-3xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h2>
        
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input type="email" defaultValue="farmer@example.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="farmer@example.com" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input type="password" defaultValue="farmer123" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="••••••••" required />
          </div>

          <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all">
            Sign In
          </button>
        </form>
        
        <p className="text-center text-slate-400 mt-6">
          Don't have an account? <Link href="/register" className="text-green-400 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
