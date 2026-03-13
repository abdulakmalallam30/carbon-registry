import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// HARDCODED ADMIN CREDENTIALS - DO NOT CHANGE
const ADMIN_CREDENTIALS = {
  email: 'admin@blucarbon.com',
  password: 'Admin123!'
};

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
  
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/admin');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate against hardcoded credentials only
    if (formData.email === ADMIN_CREDENTIALS.email && formData.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminEmail', formData.email);
      setIsLoggedIn(true);
      navigate('/admin');
    } else {
      setError('Invalid admin credentials');
      setFormData({ email: '', password: '' });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden pt-28 sm:pt-32 pb-10">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Admin Badge */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-red-500/20 border border-red-500/50 rounded-full mb-4">
            <p className="text-red-400 text-sm font-semibold">ADMIN PORTAL</p>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Restricted Access</h1>
          <p className="text-gray-400">Admin credentials required</p>
        </div>

        {/* Login Form Card */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/70 text-white placeholder-gray-500 transition"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/70 text-white placeholder-gray-500 transition"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-500 text-white font-bold rounded-lg transition transform hover:scale-105 active:scale-95"
            >
              {loading ? 'Signing in...' : 'Admin Login'}
            </button>
          </form>

          {/* Info Message */}
          <p className="text-center text-gray-400 text-xs mt-6">
            This portal is restricted to authorized administrators only.
          </p>
        </div>

        {/* Back to Home Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          <a href="/" className="text-cyan-400 hover:text-cyan-300 transition">
            ← Back to home
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
