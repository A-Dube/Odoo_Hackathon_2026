import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Fleet Manager');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4 font-sans select-none">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-[#0F172A] text-white rounded-xl flex items-center justify-center shadow-sm mb-3">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
            <path d="M19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
            <path d="M13 6h3a2 2 0 0 1 2 2v7"/>
            <path d="M5 15V8a2 2 0 0 1 2-2h10"/>
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">TransitOps</h1>
        <p className="text-xs text-[#64748B] tracking-wide mt-1 font-medium">Operational Intelligence</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xl shadow-slate-100/50">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">Create Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1.5">
              Full Name
            </label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94A3B8]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@transitops.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1.5">
              Role Designation
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#0F172A] transition-colors cursor-pointer"
            >
              <option value="Fleet Manager">Fleet Manager</option>
              <option value="Driver">Driver</option>
              <option value="Safety Officer">Safety Officer</option>
              <option value="Financial Analyst">Financial Analyst</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] transition-colors tracking-widest"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors mt-4"
          >
            Register Account
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
          <p className="text-xs font-medium text-[#64748B]">
            Already have an account? <Link to="/login" className="text-[#475569] font-semibold hover:underline">Sign In Instead</Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-[10px] text-[#94A3B8] font-mono tracking-wider">
        System v2.4.1 (Stable)
      </div>
    </div>
  );
};

export default Signup;