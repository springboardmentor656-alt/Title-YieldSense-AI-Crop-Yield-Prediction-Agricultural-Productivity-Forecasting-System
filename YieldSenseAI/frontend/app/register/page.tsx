"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate user creation and route back to login
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-green-500/20 rounded-full blur-3xl"></div>
      
      <div className="z-10 w-full max-w-md p-8 glass-dark rounded-3xl">
        <h2 className="text-3xl font-bold text-center text-gradient mb-6">Create Account</h2>
        
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input type="email" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="farmer@example.com" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input type="password" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="••••••••" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Role</label>
            <select className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors">
              <option>Farmer</option>
              <option>Administrator</option>
              <option>Agri Consultant</option>
              <option>Researcher</option>
              <option>Agriculture Department</option>
            </select>
          </div>

          <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all">
            Sign Up
          </button>
        </form>
        
        <p className="text-center text-slate-400 mt-6">
          Already have an account? <Link href="/login" className="text-green-400 hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
