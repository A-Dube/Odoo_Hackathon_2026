import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4 font-sans select-none">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-sm mb-3 overflow-hidden">
          <img 
          src="/Logo.png" 
          alt="TransitOps Logo" 
          className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">TransitOps</h1>
        <p className="text-xs text-[#64748B] tracking-wide mt-1 font-medium">Operational Intelligence</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xl shadow-slate-100/50">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                Password
              </label>
              <a href="#forgot" className="text-xs font-semibold text-[#475569] hover:underline">
                Forgot Password?
              </a>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] transition-colors tracking-widest"
            />
          </div>

          <div className="flex items-center">
            <input 
              id="remember" 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 border-[#E2E8F0] rounded text-[#0F172A] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2.5 text-xs font-medium text-[#64748B] cursor-pointer">
              Remember me on this device
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors mt-2"
          >
            Login
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
          <p className="text-xs font-medium text-[#64748B]">
            Need an account? <Link to="/signup" className="text-[#475569] font-semibold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-[10px] text-[#94A3B8] font-mono tracking-wider">
        System v2.4.1 (Stable)
      </div>
    </div>
  );
};

export default Login;