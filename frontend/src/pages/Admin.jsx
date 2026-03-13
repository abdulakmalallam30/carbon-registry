import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [verifyData, setVerifyData] = useState({ projectId: '' });
  const [creditData, setCreditData] = useState({
    projectId: '',
    amount: '',
    to: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'true') {
      navigate('/admin-login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const handleVerifyChange = (e) => {
    setVerifyData({
      ...verifyData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreditChange = (e) => {
    setCreditData({
      ...creditData,
      [e.target.name]: e.target.value
    });
  };

  const verifyProject = async () => {
    if (!verifyData.projectId) {
      setMessage('Please enter a project ID');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/verify-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: verifyData.projectId })
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`✓ Project verified! Tx Hash: ${data.txHash}`);
        setVerifyData({ projectId: '' });
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const issueCredit = async () => {
    if (!creditData.projectId || !creditData.amount || !creditData.to) {
      setMessage('Please fill in all credit fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/issue-credit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: creditData.projectId,
          amount: creditData.amount,
          to: creditData.to
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`✓ Credit issued! Tx Hash: ${data.txHash}`);
        setCreditData({ projectId: '', amount: '', to: '' });
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 pt-28 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">ADMIN PANEL</h1>
            <p className="text-gray-400">Logged in as: <span className="text-cyan-400">{localStorage.getItem('adminEmail')}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-red-400 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-8 ${message.includes('✓') ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Verify Project Section */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Verify Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Project ID
                </label>
                <input
                  type="number"
                  name="projectId"
                  value={verifyData.projectId}
                  onChange={handleVerifyChange}
                  placeholder="Enter project ID"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/70 text-white placeholder-gray-500"
                />
              </div>

              <button
                onClick={verifyProject}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-500 text-white font-bold rounded-lg transition"
              >
                {loading ? 'Processing...' : 'Verify Project'}
              </button>
            </div>
          </div>

          {/* Issue Credit Section */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Issue Carbon Credit</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Project ID
                </label>
                <input
                  type="number"
                  name="projectId"
                  value={creditData.projectId}
                  onChange={handleCreditChange}
                  placeholder="Enter project ID"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/70 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Amount (tonnes CO2)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={creditData.amount}
                  onChange={handleCreditChange}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/70 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Investor Wallet Address
                </label>
                <input
                  type="text"
                  name="to"
                  value={creditData.to}
                  onChange={handleCreditChange}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/70 text-white placeholder-gray-500 text-sm"
                />
              </div>

              <button
                onClick={issueCredit}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-500 text-white font-bold rounded-lg transition"
              >
                {loading ? 'Processing...' : 'Issue Credit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
