import React, { useState, useEffect } from 'react';
import { getAllDrivers, createNewDriver } from '../services/driverService';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contact: '', safetyScore: '100', status: 'Available'
  });

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await getAllDrivers();
      setDrivers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch drivers');
    } finally { 
      setLoading(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createNewDriver({
        ...formData,
        safetyScore: Number(formData.safetyScore)
      });
      setFormData({ name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contact: '', safetyScore: '100', status: 'Available' });
      fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add driver');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans">
      <div className="w-full lg:w-1/3 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50 h-fit">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Onboard Driver</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">License #</label>
              <input type="text" required value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} placeholder="DL-54321" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Class</label>
              <input type="text" required value={formData.licenseCategory} onChange={(e) => setFormData({...formData, licenseCategory: e.target.value})} placeholder="Class A CDL" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">License Expiry</label>
            <input type="date" required value={formData.licenseExpiryDate} onChange={(e) => setFormData({...formData, licenseExpiryDate: e.target.value})} className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Contact</label>
              <input type="text" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} placeholder="555-0199" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Safety Score</label>
              <input type="number" required value={formData.safetyScore} onChange={(e) => setFormData({...formData, safetyScore: e.target.value})} placeholder="100" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2">
            Save Driver Profile
          </button>
        </form>
      </div>

      <div className="flex-1 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Driver Registry</h2>
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-slate-400">Loading operators...</div>
        ) : drivers.length === 0 ? (
          <div className="py-12 text-center text-sm font-medium text-slate-400">No operators logged on platform database yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Operator Name</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">License ID</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Safety Rating</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {drivers.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-bold text-[#0F172A]">{d.name}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[#475569]">{d.licenseNumber}</div>
                      <div className="text-[11px] text-slate-400 font-medium">Exp: {new Date(d.licenseExpiryDate).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3 font-semibold text-emerald-600">{d.safetyScore}/100</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                        d.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}