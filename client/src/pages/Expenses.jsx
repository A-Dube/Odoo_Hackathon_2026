import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Expenses() {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({ vehicle: '', category: 'Fuel', amount: '', fuelGallons: '' });

  const getHeaders = () => ({
    headers: { Authorization: user?.token ? `Bearer ${user.token}` : '' }
  });

  const loadData = async () => {
    if (!user) return;
    try {
      const [vRes, eRes] = await Promise.all([
        axios.get('http://localhost:5000/api/vehicles', getHeaders()),
        axios.get('http://localhost:5000/api/ops/expenses', getHeaders())
      ]);
      setVehicles(vRes.data || []);
      setExpenses(eRes.data || []);
    } catch (err) {
      console.error('Failed to load cost ledger data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/ops/expenses', {
        ...formData,
        amount: Number(formData.amount),
        fuelGallons: formData.category === 'Fuel' ? Number(formData.fuelGallons) : undefined
      }, getHeaders());
      setFormData({ vehicle: '', category: 'Fuel', amount: '', fuelGallons: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans">
      <div className="w-full lg:w-1/3 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50 h-fit">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Record Expense Voucher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Select Fleet Unit</label>
            <select required value={formData.vehicle} onChange={(e) => setFormData({...formData, vehicle: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none">
              <option value="">-- Choose Unit --</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} - {v.model}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Expense Type Ledger</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none">
              {['Fuel', 'Toll', 'Insurance', 'Permit', 'Miscellaneous'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Amount ($)</label>
            <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="120" className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" />
          </div>
          {formData.category === 'Fuel' && (
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Fuel Quantity (Gallons)</label>
              <input type="number" required value={formData.fuelGallons} onChange={(e) => setFormData({...formData, fuelGallons: e.target.value})} placeholder="40" className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" />
            </div>
          )}
          <button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2">Post Financial Entry</button>
        </form>
      </div>
      <div className="flex-1 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Financial Cost Registry</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase">Vehicle</th>
                <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase">Ledger Class</th>
                <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase">Total Cost</th>
                <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase">Fuel Volume</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e._id} className="border-b border-slate-100 text-xs hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-[#0F172A]">{e.vehicle?.registrationNumber || 'Deleted'}</td>
                  <td className="p-3 font-semibold text-slate-600">{e.category}</td>
                  <td className="p-3 font-bold text-rose-600">${e.amount}</td>
                  <td className="p-3 font-medium text-slate-400">{e.fuelGallons ? `${e.fuelGallons} Gal` : '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}