"use client";
import React, { useState } from 'react';

export default function AdministratorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([
    { id: 1, email: 'farmer@yieldsense.ai', role: 'Farmer', status: 'Active' },
    { id: 2, email: 'consultant@yieldsense.ai', role: 'Agri Consultant', status: 'Active' },
    { id: 3, email: 'director@gov.in', role: 'Agriculture Department', status: 'Active' },
    { id: 4, email: 'researcher@academic.edu', role: 'Researcher', status: 'Active' },
  ]);

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-gradient mb-12">YieldSense AI</h2>
        <nav className="flex flex-col gap-4">
          <button onClick={() => setActiveTab('dashboard')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            System Admin
          </button>
          <button onClick={() => setActiveTab('users')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'users' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            User Management
          </button>
          <button onClick={() => setActiveTab('schema')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'schema' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            DB Schema Status
          </button>
          <button onClick={() => setActiveTab('logs')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            System Logs
          </button>
          <a href="/login" className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto text-left">
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-3xl font-bold">
              {activeTab === 'dashboard' && "Admin Console"}
              {activeTab === 'users' && "User Management Directory"}
              {activeTab === 'schema' && "Database Schema Audits"}
              {activeTab === 'logs' && "Real-time Service Logs"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === 'dashboard' && "Manage infrastructure, user roles, database audits, and security metrics."}
              {activeTab === 'users' && "Monitor registered accounts, change roles, and flag profiles."}
              {activeTab === 'schema' && "Inspect SQL tables, keys, mapping files, and status loops."}
              {activeTab === 'logs' && "High-frequency runtime records and server activity audit stream."}
            </p>
          </div>
          <div className="flex items-center gap-4 glass px-4 py-2 rounded-full">
            <span className="text-slate-300 font-medium">Welcome, Admin</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-400 to-pink-500"></div>
          </div>
        </header>

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Total Registered Users</h3>
                <p className="text-3xl font-bold text-red-400 mt-2">{users.length} <span className="text-lg text-slate-500 font-normal">Active</span></p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">DB Connection Status</h3>
                <p className="text-3xl font-bold text-green-400 mt-2">Healthy <span className="text-lg text-slate-500 font-normal">SQLite/Postgres</span></p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">API Server Latency</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">14 <span className="text-lg text-slate-500 font-normal">ms</span></p>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-3xl h-80 flex flex-col justify-between border border-white/5">
              <h3 className="text-lg font-bold">System Log Audits (Latest)</h3>
              <div className="text-xs font-mono text-slate-400 bg-black/40 p-4 rounded-xl space-y-2 overflow-y-auto h-48">
                <p>[2026-07-09 14:02:11] INFO: Database tables created/verified successfully.</p>
                <p>[2026-07-09 14:10:45] INFO: User register request submitted to `/api/v1/auth/register`.</p>
                <p>[2026-07-09 14:12:00] INFO: JWT Session token generated for email: farmer@yieldsense.ai</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users */}
        {activeTab === 'users' && (
          <div className="glass p-8 rounded-3xl border border-white/5 relative z-10 overflow-x-auto">
            <h3 className="text-xl font-bold mb-6">User Accounts Registry</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="py-4">Email</th>
                  <th className="py-4">Role</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4 font-medium">{user.email}</td>
                    <td className="py-4 text-blue-400">{user.role}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => toggleUserStatus(user.id)} className="text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-lg transition-all">
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Schema */}
        {activeTab === 'schema' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h4 className="font-bold text-red-400 border-b border-white/10 pb-2 mb-4">Table: users</h4>
              <ul className="text-sm font-mono space-y-2 text-slate-400">
                <li><span className="text-white">id:</span> INT (PK)</li>
                <li><span className="text-white">email:</span> VARCHAR(255)</li>
                <li><span className="text-white">password_hash:</span> VARCHAR(255)</li>
                <li><span className="text-white">role:</span> VARCHAR(50)</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h4 className="font-bold text-red-400 border-b border-white/10 pb-2 mb-4">Table: farms</h4>
              <ul className="text-sm font-mono space-y-2 text-slate-400">
                <li><span className="text-white">id:</span> INT (PK)</li>
                <li><span className="text-white">user_id:</span> INT (FK $\rightarrow$ users)</li>
                <li><span className="text-white">farm_name:</span> VARCHAR(100)</li>
                <li><span className="text-white">latitude:</span> NUMERIC(9,6)</li>
                <li><span className="text-white">longitude:</span> NUMERIC(9,6)</li>
                <li><span className="text-white">soil_ph:</span> NUMERIC(3,2)</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h4 className="font-bold text-red-400 border-b border-white/10 pb-2 mb-4">Table: crops</h4>
              <ul className="text-sm font-mono space-y-2 text-slate-400">
                <li><span className="text-white">id:</span> INT (PK)</li>
                <li><span className="text-white">farm_id:</span> INT (FK $\rightarrow$ farms)</li>
                <li><span className="text-white">crop_name:</span> VARCHAR(100)</li>
                <li><span className="text-white">hectares_planted:</span> NUMERIC(10,2)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Logs */}
        {activeTab === 'logs' && (
          <div className="glass p-8 rounded-3xl border border-white/5 relative z-10">
            <h3 className="text-xl font-bold mb-6">Service Logs Console</h3>
            <div className="text-xs font-mono text-slate-400 bg-black/50 p-6 rounded-2xl space-y-3 h-[400px] overflow-y-auto border border-white/10">
              <p className="text-slate-500">[2026-07-09 14:02:11] INFO: Initializing application tables in database...</p>
              <p className="text-green-400">[2026-07-09 14:02:12] SUCCESS: PostgreSQL engines online. SQLite cached checks passed.</p>
              <p className="text-slate-500">[2026-07-09 14:10:45] INFO: Incoming request headers checked for role permissions.</p>
              <p className="text-green-400">[2026-07-09 14:12:00] SUCCESS: Token successfully signed with key signature.</p>
              <p className="text-amber-400">[2026-07-09 14:15:30] WARNING: Network timeout querying API servers. Restoring mock data array.</p>
              <p className="text-red-400">[2026-07-09 14:16:05] ERROR: Invalid authentication credentials at /api/v1/auth/token.</p>
              <p className="text-slate-500">[2026-07-09 14:20:00] INFO: Garbage collection executed. Memory footprint: 42MB.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
