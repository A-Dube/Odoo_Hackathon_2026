import React, { useState, useEffect } from 'react';
import { getAllVehicles, createNewVehicle, deleteVehicleById } from '../services/vehicleService';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    registrationNumber: '', model: '', vehicleType: '', maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available'
  });

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getAllVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createNewVehicle({
        ...formData,
        maxLoadCapacity: Number(formData.maxLoadCapacity),
        odometer: Number(formData.odometer),
        acquisitionCost: Number(formData.acquisitionCost)
      });
      setFormData({ registrationNumber: '', model: '', vehicleType: '', maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available' });
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register vehicle');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans">
      <div className="w-full lg:w-1/3 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50 h-fit">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Register Vehicle</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Plate Number</label>
            <input type="text" required value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} placeholder="e.g. NY-9921-FX" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Model Make</label>
            <input type="text" required value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} placeholder="Freightliner Cascadia" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Type</label>
              <input type="text" required value={formData.vehicleType} onChange={(e) => setFormData({...formData, vehicleType: e.target.value})} placeholder="Semi-Truck" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Max Load (kg)</label>
              <input type="number" required value={formData.maxLoadCapacity} onChange={(e) => setFormData({...formData, maxLoadCapacity: e.target.value})} placeholder="20000" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Odometer (mi)</label>
              <input type="number" required value={formData.odometer} onChange={(e) => setFormData({...formData, odometer: e.target.value})} placeholder="45000" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">Cost ($)</label>
              <input type="number" required value={formData.acquisitionCost} onChange={(e) => setFormData({...formData, acquisitionCost: e.target.value})} placeholder="125000" className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A]" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors pt-2">
            Save Vehicle Asset
          </button>
        </form>
      </div>

      <div className="flex-1 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Fleet Registry</h2>
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-slate-400">Loading fleet records...</div>
        ) : vehicles.length === 0 ? (
          <div className="py-12 text-center text-sm font-medium text-slate-400">No vehicle units registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Plate & Model</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Type</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Load Cap</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#0F172A] uppercase">{v.registrationNumber}</div>
                      <div className="text-xs text-slate-400 font-medium">{v.model}</div>
                    </td>
                    <td className="p-3 font-medium text-[#475569]">{v.vehicleType}</td>
                    <td className="p-3 font-semibold text-[#0F172A]">{v.maxLoadCapacity.toLocaleString()} kg</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                        v.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>{v.status}</span>
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