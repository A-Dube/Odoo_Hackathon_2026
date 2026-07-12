import React, { useState, useEffect } from 'react';
import { getAllTrips, createNewTrip, dispatchTripAction, completeTripAction, cancelTripAction } from '../services/tripService';
import { getAllVehicles } from '../services/vehicleService';
import { getAllDrivers } from '../services/driverService';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        getAllTrips(), getAllVehicles(), getAllDrivers()
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData.filter(v => v.status === 'Available'));
      setDrivers(driversData.filter(d => d.status === 'Available'));
    } catch (err) {
      setError('Failed to sync logistical data layers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createNewTrip({
        ...formData,
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance)
      });
      setFormData({ source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to map logistical routing');
    }
  };

  const handleAction = async (id, actionFn) => {
    try {
      await actionFn(id);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'State validation change blocked');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans">
      <div className="w-full lg:w-1/3 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50 h-fit">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Create Trip</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Source</label>
              <input type="text" required value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} placeholder="Chicago Hub" className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Destination</label>
              <input type="text" required value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} placeholder="Dallas Fac" className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Select Available Vehicle</label>
            <select required value={formData.vehicle} onChange={(e) => setFormData({...formData, vehicle: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none">
              <option value="">-- Choose Unit --</option>
              {vehicles.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} ({v.maxLoadCapacity}kg Cap)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Select Available Driver</label>
            <select required value={formData.driver} onChange={(e) => setFormData({...formData, driver: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none">
              <option value="">-- Choose Operator --</option>
              {drivers.map(d => <option key={d._id} value={d._id}>{d.name} (Score: {d.safetyScore})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Weight (kg)</label>
              <input type="number" required value={formData.cargoWeight} onChange={(e) => setFormData({...formData, cargoWeight: e.target.value})} placeholder="15000" className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase mb-1">Distance (mi)</label>
              <input type="number" required value={formData.plannedDistance} onChange={(e) => setFormData({...formData, plannedDistance: e.target.value})} placeholder="920" className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2">
            Save Trip Manifest
          </button>
        </form>
      </div>

      <div className="flex-1 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden">
        <h2 className="text-xl font-bold text-[#0F172A] mb-5">Active Dispatch Logs</h2>
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-slate-400">Loading trip manifests...</div>
        ) : trips.length === 0 ? (
          <div className="py-12 text-center text-sm font-medium text-slate-400">No routing files created on data engine yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Route Details</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Assigned Assets</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                  <th className="p-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {trips.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#0F172A]">{t.source} ➔ {t.destination}</div>
                      <div className="text-xs text-slate-400 font-medium">{t.plannedDistance} mi | {t.cargoWeight} kg</div>
                    </td>
                    <td className="p-3 text-xs">
                      <div className="font-semibold text-slate-700">Unit: {t.vehicle?.registrationNumber || 'Deleted'}</div>
                      <div className="text-slate-400 font-medium">Driver: {t.driver?.name || 'Deleted'}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                        t.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                        t.status === 'Dispatched' ? 'bg-blue-50 text-blue-700' :
                        t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>{t.status}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {t.status === 'Draft' && (
                          <button onClick={() => handleAction(t._id, dispatchTripAction)} className="px-2 py-1 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-700">
                            Dispatch
                          </button>
                        )}
                        {t.status === 'Dispatched' && (
                          <button onClick={() => handleAction(t._id, completeTripAction)} className="px-2 py-1 bg-emerald-600 text-white font-bold text-xs rounded hover:bg-emerald-700">
                            Complete
                          </button>
                        )}
                        {(t.status === 'Draft' || t.status === 'Dispatched') && (
                          <button onClick={() => handleAction(t._id, cancelTripAction)} className="px-2 py-1 border border-red-200 text-red-600 font-bold text-xs rounded hover:bg-red-50">
                            Cancel
                          </button>
                        )}
                      </div>
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