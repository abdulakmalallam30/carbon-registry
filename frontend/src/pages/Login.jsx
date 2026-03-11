import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, USER_ROLES } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';

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
    {
      value: USER_ROLES.ADMIN,
      label: 'Administrator',
      description: 'Verify projects and issue carbon credits',
      icon: '👨‍💼',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌿 Carbon Registry
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Role Selection (only shown for registration) */}
            {!isLogin && (
              <div className="md:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Select Your Role</h2>
                <div className="space-y-4">
                  {roleOptions.map((role) => (
                    <div
                      key={role.value}
                      onClick={() => handleRoleSelect(role.value)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedRole === role.value
                          ? 'bg-white text-gray-800 shadow-lg transform scale-105'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-3xl">{role.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {role.label}
                          </h3>
                          <p
                            className={`text-sm ${
                              selectedRole === role.value
                                ? 'text-gray-600'
                                : 'text-white/90'
                            }`}
                          >
                            {role.description}
                          </p>
                        </div>
                        {selectedRole === role.value && (
                          <span className="text-green-600 text-xl">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right Side - Form */}
            <div className={`${!isLogin ? 'md:w-1/2' : 'w-full'} p-8`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>

              {isLogin && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Quick Access for Testing:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {roleOptions.map((role) => (
                      <div
                        key={role.value}
                        className="text-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-2xl block mb-1">{role.icon}</span>
                        <span className="text-gray-600">{role.label.split('/')[0].trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Secure authentication powered by Firebase 🔒
        </p>
      </div>
    </div>
  );
};

export default Login;
