import React, { useState } from 'react';

const Dashboard = () => {
  // Filter States
  const [vehicleType, setVehicleType] = useState('All Vehicle Types');
  const [status, setStatus] = useState('All Statuses');
  const [region, setRegion] = useState('All Regions');

  const metrics = [
    { title: 'Active Vehicles', value: '142', change: '↗ 4%', color: 'border-blue-500', iconBg: 'bg-blue-50 text-blue-600' },
    { title: 'Available Vehicles', value: '28', change: '', color: 'border-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
    { title: 'In Maintenance', value: '12', change: '↘ 2%', color: 'border-rose-500', iconBg: 'bg-rose-50 text-rose-600' },
    { title: 'Active Trips', value: '84', change: '', color: 'border-indigo-500', iconBg: 'bg-indigo-50 text-indigo-600' },
    { title: 'Pending Trips', value: '15', change: '', color: 'border-slate-500', iconBg: 'bg-slate-50 text-slate-600' },
    { title: 'Drivers On Duty', value: '92', change: '', color: 'border-cyan-500', iconBg: 'bg-cyan-50 text-cyan-600' },
    { title: 'Fleet Utilization', value: '88%', change: '', color: 'border-amber-500', iconBg: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6 max-w-(screen-2xl) mx-auto">
      {/* Header Actions Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-[#64748B] mt-0.5">Real-time metrics and fleet status intelligence.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={vehicleType} 
            onChange={(e) => setVehicleType(e.target.value)}
            className="bg-white border border-[#E2E8F0] text-sm text-[#475569] font-medium px-3 py-2 rounded-lg focus:outline-none focus:border-[#0F172A] cursor-pointer"
          >
            <option>All Vehicle Types</option>
            <option>Heavy Hauler</option>
            <option>Regional Van</option>
          </select>

          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white border border-[#E2E8F0] text-sm text-[#475569] font-medium px-3 py-2 rounded-lg focus:outline-none focus:border-[#0F172A] cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
          </select>

          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            className="bg-white border border-[#E2E8F0] text-sm text-[#475569] font-medium px-3 py-2 rounded-lg focus:outline-none focus:border-[#0F172A] cursor-pointer"
          >
            <option>All Regions</option>
            <option>North Hub</option>
            <option>South Facility</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((card, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-xl border border-[#E2E8F0] border-l-4 ${card.color} p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider">{card.title}</p>
              {card.change && (
                <span className={`text-xs font-semibold ${card.change.includes('↗') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {card.change}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Fleet Utilization Trend</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Historical utilization overview data.</p>
          </div>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-md">
            Last 30 Days
          </span>
        </div>

        <div className="relative w-full h-64 mt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path 
              d="M 0 160 Q 150 140 250 110 T 500 90 T 750 65 T 1000 30 L 1000 200 L 0 200 Z" 
              fill="url(#trendGradient)"
              opacity="0.1"
            />
            <path 
              d="M 0 160 Q 150 140 250 110 T 500 90 T 750 65 T 1000 30" 
              fill="none" 
              stroke="#0F172A" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            <circle cx="250" cy="110" r="5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="500" cy="90" r="5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="750" cy="65" r="5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="1000" cy="30" r="5" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2" />

            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute top-0 left-0 text-[10px] font-bold text-slate-400 bg-white/80 px-1 rounded">100%</div>
          <div className="absolute top-[50%] left-0 text-[10px] font-bold text-slate-400 bg-white/80 px-1 rounded">50%</div>
          <div className="absolute bottom-6 left-0 text-[10px] font-bold text-slate-400 bg-white/80 px-1 rounded">0%</div>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2 pt-4 border-t border-[#F1F5F9] mt-2">
          <span>Day 1</span>
          <span>Day 7</span>
          <span>Day 14</span>
          <span>Day 21</span>
          <span>Day 30</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;