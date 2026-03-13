import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, USER_ROLES } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.NGO);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  // Redirect if already logged in
  if (currentUser) {
    navigate('/dashboard');
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await loginUser(formData.email, formData.password);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error);
        }
      } else {
        // Register
        if (!formData.displayName.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const result = await registerUser(
          formData.email,
          formData.password,
          formData.displayName,
          selectedRole
        );
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: USER_ROLES.NGO,
      label: 'NGO / Project Owner',
      description: 'Register plantation projects and environmental initiatives',
      icon: '🌱',
    },
    {
      value: USER_ROLES.INDUSTRY,
      label: 'Industry / Buyer',
      description: 'Purchase carbon credits to offset emissions',
      icon: '🏭',
    },
  ];

  const inputClass =
    'w-full px-4 py-3 bg-slate-900/55 border border-cyan-300/25 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-300/50 transition-all';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#1a4e78_0%,#0d2945_30%,#081629_70%,#050d1a_100%)] pt-28 sm:pt-32 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="login-wave login-wave-1" />
      <div className="login-wave login-wave-2" />
      <div className="login-wave login-wave-3" />

      {[...Array(14)].map((_, i) => (
        <span
          key={i}
          className="login-bubble"
          style={{
            left: `${(i * 7) % 100}%`,
            animationDelay: `${(i % 6) * 0.8}s`,
            animationDuration: `${10 + (i % 5) * 2}s`,
            width: `${10 + (i % 4) * 6}px`,
            height: `${10 + (i % 4) * 6}px`
          }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <div className="text-white">
          <p className="inline-flex items-center gap-2 text-cyan-200/90 border border-cyan-300/30 bg-cyan-500/10 rounded-full px-4 py-1 mb-5 text-sm">
            <span>{t('login.badge')}</span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
            {t('login.title')}
          </h1>
          <p className="text-slate-200/90 max-w-xl mb-6" />

          <div className="grid sm:grid-cols-3 gap-3">
            {roleOptions.map((role) => (
              <div key={role.value} className="rounded-xl border border-cyan-300/20 bg-slate-900/35 backdrop-blur-md p-3">
                <div className="text-2xl mb-1">{role.icon}</div>
                <div className="text-sm font-semibold text-white">{role.label.split('/')[0].trim()}</div>
                <div className="text-xs text-cyan-100/80 mt-1">{role.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-300/25 bg-slate-950/45 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.45)] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              {isLogin ? t('login.signIn') : t('login.createAccount')}
            </h2>
            <p className="text-cyan-100/80 text-sm">
              {isLogin ? t('login.accessSecure') : t('login.joinRole')}
            </p>
          </div>

          {!isLogin && (
            <div className="space-y-3 mb-6">
              <p className="text-sm font-semibold text-cyan-100">{t('login.chooseRole')}</p>
              {roleOptions.map((role) => (
                <button
                  type="button"
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedRole === role.value
                      ? 'border-cyan-300 bg-cyan-500/20 text-white'
                      : 'border-cyan-300/20 bg-slate-900/35 text-cyan-100 hover:bg-slate-800/45'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{role.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{role.label}</div>
                      <div className="text-xs opacity-90">{role.description}</div>
                    </div>
                    {selectedRole === role.value && <span className="text-cyan-100">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-2">{t('login.fullName')}</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder={t('login.enterName')}
                  className={inputClass}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-cyan-100 mb-2">{t('login.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-100 mb-2">{t('login.password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('login.enterPassword')}
                className={inputClass}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-400/40 text-red-100 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/40"
            >
              {loading ? t('login.loading') : isLogin ? t('login.signIn') : t('login.createAccount')}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-cyan-200 hover:text-cyan-100 font-medium"
            >
              {isLogin
                ? t('login.noAccount')
                : t('login.haveAccount')}
            </button>
          </div>

          <p className="text-center text-cyan-100/70 text-xs mt-6" />
        </div>
      </div>
    </div>
  );
};

export default Login;
