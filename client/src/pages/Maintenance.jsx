import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Maintenance() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({ vehicle: '', serviceType: 'Routine Inspection', cost: '', odometerAtService: '', notes: '' });

  const getHeaders = () => ({
    headers: { Authorization: user?.token ? `Bearer ${user.token}` : '' }
  });

  const loadData = async () => {
    if (!user) return;
    try {
      const [vRes, mRes] = await Promise.all([
        axios.get('http://localhost:5000/api/vehicles', getHeaders()),
        axios.get('http://localhost:5000/api/ops/maintenance', getHeaders())
      ]);
      setVehicles(vRes.data || []);
      setLogs(mRes.data || []);
    } catch (err) {
      console.error('Failed to load fleet data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/ops/maintenance', {
        ...formData,
        cost: Number(formData.cost),
        odometerAtService: Number(formData.odometerAtService)
      }, getHeaders());
      setFormData({ vehicle: '', serviceType: 'Routine Inspection', cost: '', odometerAtService: '', notes: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans">
      <div className="w-full lg:w-1/3 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50 h-fit">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Log Vehicle Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Select Fleet Unit</label>
            <select required value={formData.vehicle} onChange={(e) => setFormData({...formData, vehicle: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none">
              <option value="">-- Choose Unit --</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} - {v.model}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Service Action Category</label>
            <select value={formData.serviceType} onChange={(e) => setFormData({...formData, serviceType: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none">
              {['Routine Inspection', 'Oil Change', 'Brake Repair', 'Tire Replacement', 'Engine Tune-up'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Cost ($)</label>
              <input type="number" required value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} placeholder="450" className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Odometer Reading</label>
              <input type="number" required value={formData.odometerAtService} onChange={(e) => setFormData({...formData, odometerAtService: e.target.value})} placeholder="48500" className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Technician Log Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="System checks verified..." className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" rows="2" />
          </div>
          <button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2">Commit Service Record</button>
        </form>
      </div>
      <div className="flex-1 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Historical Maintenance History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase">Vehicle</th>
                <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase">Service Type</th>
                <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase">Cost</th>
                <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase">Mileage (mi)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l._id} className="border-b border-slate-100 text-xs hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-[#0F172A]">{l.vehicle?.registrationNumber || 'Deleted'}</td>
                  <td className="p-3 font-semibold text-slate-600">{l.serviceType}</td>
                  <td className="p-3 font-bold text-emerald-600">${l.cost}</td>
                  <td className="p-3 font-medium text-slate-400">{l.odometerAtService} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}