import React, { useState, useEffect, useContext } from 'react';
import { getDashboardAnalytics } from '../services/dashboardService';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicleType, setVehicleType] = useState('All Vehicle Types');
  const [status, setStatus] = useState('All Statuses');
  const [region, setRegion] = useState('All Regions');
  const [stats, setStats] = useState(null);
  const [networkError, setNetworkError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        setNetworkError('');
        const data = await getDashboardAnalytics();
        setStats(data);
      } catch (err) {
        console.error('Analytics engine handshake broken', err);
        setNetworkError(err.response?.data?.message || err.message || 'Connection failed');
      }
    }
    fetchStats();
  }, [user]);

  const metrics = [
    { title: 'Active Vehicles', value: stats ? stats.activeVehicles : '--', change: '4%', isPositive: true, icon: <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
    { title: 'Available Vehicles', value: stats ? stats.availableVehicles : '--', change: null, icon: <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { title: 'In Maintenance', value: stats ? stats.inMaintenance : '--', change: '2%', isPositive: false, icon: <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg> },
    { title: 'Active Trips', value: stats ? stats.activeTrips : '--', change: null, icon: <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A1 1 0 0021 18.832V8.056a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 2" /></svg> },
    { title: 'Pending Trips', value: stats ? stats.pendingTrips : '--', change: null, icon: <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { title: 'Drivers On Duty', value: stats ? stats.driversOnDuty : '--', change: null, icon: <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { title: 'Fleet Utilization', value: stats ? stats.fleetUtilization : '--%', change: null, icon: <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg> },
  ];

  const chartPoints = [{ xPct: 35, yPct: 57.5 }, { xPct: 65, yPct: 45 }, { xPct: 85, yPct: 30 }, { xPct: 100, yPct: 20 }];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {networkError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100">
          Backend Link Error: {networkError}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-[#64748B] mt-0.5">Real-time metrics and fleet status.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="bg-white border border-[#E2E8F0] text-xs text-[#475569] font-bold px-4 py-2 rounded-lg focus:outline-none cursor-pointer"><option>All Vehicle Types</option></select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-white border border-[#E2E8F0] text-xs text-[#475569] font-bold px-4 py-2 rounded-lg focus:outline-none cursor-pointer"><option>All Statuses</option></select>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="bg-white border border-[#E2E8F0] text-xs text-[#475569] font-bold px-4 py-2 rounded-lg focus:outline-none cursor-pointer"><option>All Regions</option></select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((card, idx) => {
          const isSpecialGrid = card.title === 'Fleet Utilization';
          return (
            <div key={idx} className={`bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between h-[140px] relative overflow-hidden ${isSpecialGrid ? 'col-span-1 lg:col-span-2' : ''}`}>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider">{card.title}</span>
                <div className="w-8 h-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-center">{card.icon}</div>
              </div>
              <div className="mt-auto flex items-end justify-between">
                <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight leading-none">{card.value}</span>
                {card.change && (
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-0.5 ${card.isPositive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">{card.isPositive ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />}</svg>
                    {card.change}
                  </div>
                )}
              </div>
              {isSpecialGrid && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F172A] rounded-b-2xl"></div>}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-8">
          <div><h3 className="text-base font-bold text-[#0F172A]">Fleet Utilization Trend</h3></div>
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Last 30 Days</span>
        </div>
        <div className="relative w-full h-72 pl-10 pr-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F1F5F9" stopOpacity="0.8" /><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" /></linearGradient></defs>
            <path d="M 0 150 Q 200 140 350 115 T 650 90 T 850 60 T 1000 40 L 1000 200 L 0 200 Z" fill="url(#chartGradient)" />
            <path d="M 0 150 Q 200 140 350 115 T 650 90 T 850 60 T 1000 40" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {chartPoints.map((pt, i) => <div key={i} className="absolute w-[9px] h-[9px] rounded-full bg-[#0F172A] border-2 border-white shadow-sm -translate-x-1/2 -translate-y-1/2" style={{ left: `${pt.xPct}%`, top: `${pt.yPct}%` }} />)}
          <div className="absolute top-0 left-0 text-[10px] font-bold text-slate-400">100%</div>
          <div className="absolute top-[25%] left-0 text-[10px] font-bold text-slate-400">75%</div>
          <div className="absolute top-[50%] left-0 text-[10px] font-bold text-slate-400">50%</div>
          <div className="absolute top-[75%] left-0 text-[10px] font-bold text-slate-400">25%</div>
          <div className="absolute bottom-8 left-0 text-[10px] font-bold text-slate-400">0%</div>
        </div>
        <div className="flex justify-between items-center text-[11px] font-semibold text-[#64748B] pt-4 border-t border-[#F1F5F9] mt-2"><span>Day 1</span><span>Day 7</span><span>Day 14</span><span>Day 21</span><span>Day 30</span></div>
      </div>
    </div>
  );
};

export default Dashboard;