import React, { useState, useEffect } from 'react';
import { getReportAnalytics } from '../services/opsService';

export default function Reports() {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    getReportAnalytics().then(setReportData).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">System Metrics Intelligence</h1>
        <p className="text-sm font-medium text-[#64748B] mt-0.5">High-fidelity aggregate fleet performance telemetry metrics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50">
          <h3 className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider mb-2">Aggregate Workshop Investment</h3>
          <div className="text-4xl font-extrabold text-[#0F172A]">${reportData?.maintenanceTotal || 0}</div>
          <div className="text-xs font-semibold text-slate-400 mt-1">Invested across {reportData?.maintenanceCount || 0} routine workshop orders.</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50">
          <h3 className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider mb-4">Cost Distribution Chart</h3>
          <div className="space-y-3">
            {reportData?.expenseBreakdown?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">{item._id}</span>
                <span className="font-bold text-[#0F172A]">${item.total}</span>
              </div>
            ))}
            {(!reportData?.expenseBreakdown || reportData.expenseBreakdown.length === 0) && (
              <div className="text-xs font-semibold text-slate-400 py-4 text-center">No structural logs generated yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}