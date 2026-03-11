import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, getCredits, issueCredit, getAccounts, verifyProject } from '../services/api'

const Dashboard = () => {
    const [projectsCount, setProjectsCount] = useState(0)
    const [creditsIssued, setCreditsIssued] = useState(0)
    const [creditsRetired, setCreditsRetired] = useState(0)
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)
    const [allProjects, setAllProjects] = useState([])
    const [accounts, setAccounts] = useState([])
    const [showAccounts, setShowAccounts] = useState(false)

    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
    const [issueForm, setIssueForm] = useState({ projectId: '', amount: '', to: '' })
    const [isIssuing, setIsIssuing] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

useEffect(() => {
        fetchDashboardData()
        fetchAccounts()
    }, [])

    const fetchAccounts = async () => {
        const accts = await getAccounts()
        setAccounts(accts)
    }

    const fetchDashboardData = async () => {
        setLoading(true)
        const [projects, credits] = await Promise.all([getProjects(), getCredits()])

        setAllProjects(projects)
        setProjectsCount(projects.length)

        let issued = BigInt(0)
        let retired = BigInt(0)
        let activity = []

        credits.forEach(c => {
            const amt = BigInt(c.amount)
            issued += amt
            if (c.retired) retired += amt

            const proj = projects.find(p => String(p.id) === String(c.projectId))
            const projName = proj ? proj.name : `Project ${c.projectId}`

            // Reconstruct activity table
            activity.push({
                creditId: `CRD-${String(c.id).padStart(3, '0')}`,
                projectLabel: `PRJ-${String(c.projectId).padStart(3, '0')} (${projName})`,
                action: c.retired ? 'Retired' : 'Issued',
                amount: `${amt.toString()} tCO₂e`,
                date: 'Recently',
                status: 'completed'
            })
        })

        setCreditsIssued(issued.toString())
        setCreditsRetired(retired.toString())
        setRecentActivity(activity.reverse().slice(0, 5)) // Get latest 5
        setLoading(false)
    }

const handleIssueCredit = async (e) => {
        e.preventDefault()
        if (!issueForm.projectId || !issueForm.amount || !issueForm.to) return

        setIsIssuing(true)
        setErrorMessage('')
        const result = await issueCredit(issueForm.projectId, issueForm.amount, issueForm.to)
        if (result.success) {
            setIssueForm({ projectId: '', amount: '', to: '' })
            setIsIssueModalOpen(false)
            setErrorMessage('')
            fetchDashboardData()
            alert('✅ Credits issued successfully! Check Recent Activity.')
        } else {
            setErrorMessage(result.error || 'Failed to issue credit. Make sure the project is verified.')
        }
        setIsIssuing(false)
    }

    const handleVerifyProject = async (projectId) => {
        if (!window.confirm(`Are you sure you want to verify Project ID ${projectId}?`)) return
        
        const result = await verifyProject(projectId)
        if (result.success) {
            alert('✅ Project verified successfully!')
            fetchDashboardData()
        } else {
            alert(`❌ Error: ${result.error}`)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    }

    const stats = [
        {
            title: 'Total Projects',
            value: projectsCount,
            trend: 'Active on blockchain',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            title: 'Available Credits (tCO₂e)',
            value: (BigInt(creditsIssued) - BigInt(creditsRetired)).toString(),
            trend: 'Ready for offset',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
            )
        },
        {
            title: 'Credits Retired',
            value: creditsRetired.toString(),
            trend: 'Permanently removed',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: 'Total Credits Issued',
            value: creditsIssued.toString(),
            trend: 'Lifetime total',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ]



    return (
        <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
                        System Dashboard
                    </h1>
                    <p className="text-xl text-gray-400">
                        Real-time overview of the Blue Carbon Registry
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-gradient-to-br from-teal-500/10 to-ocean-500/10 backdrop-blur-md border border-teal-500/20 rounded-2xl p-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                {stat.icon}
                            </div>
                            <div className="text-teal-400 mb-4">{stat.icon}</div>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-gray-400 text-sm font-medium mb-2">{stat.title}</div>
                            <div className="text-teal-300 text-xs flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {stat.trend}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts and Tables Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Activity Table */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-2 bg-blue-deep/40 backdrop-blur-md border border-ocean-500/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
                            <button
                                onClick={() => setIsIssueModalOpen(true)}
                                className="px-4 py-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/50 hover:bg-teal-500/40 transition-colors text-sm font-medium"
                            >
                                + Issue Credits
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-ocean-500/30 text-gray-400 text-sm">
                                        <th className="pb-3 font-medium">Credit ID</th>
                                        <th className="pb-3 font-medium">Project</th>
                                        <th className="pb-3 font-medium">Action</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {recentActivity.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-400 border-b border-ocean-500/10">No recent activity found.</td>
                                        </tr>
                                    )}
                                    {recentActivity.map((activity, i) => (
                                        <tr key={i} className="border-b border-ocean-500/10 hover:bg-ocean-500/5 transition-colors">
                                            <td className="py-4 text-teal-400 font-mono text-xs">{activity.creditId}</td>
                                            <td className="py-4 text-gray-200 font-medium">{activity.projectLabel}</td>
                                            <td className="py-4 text-gray-400">{activity.action}</td>
                                            <td className="py-4 text-teal-300 font-mono">{activity.amount}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${activity.status === 'completed'
                                                    ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                                    }`}>
                                                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Registry Distribution / Progress */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-blue-deep/40 backdrop-blur-md border border-ocean-500/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20"
                    >
                        <h2 className="text-2xl font-semibold text-white mb-6">Ecosystem Distribution</h2>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300 font-medium">Mangroves</span>
                                    <span className="text-teal-400">55%</span>
                                </div>
                                <div className="h-2 w-full bg-ocean-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '55%' }}
                                        transition={{ duration: 1, delay: 0.8 }}
                                        className="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300 font-medium">Seagrasses</span>
                                    <span className="text-ocean-400">30%</span>
                                </div>
                                <div className="h-2 w-full bg-ocean-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '30%' }}
                                        transition={{ duration: 1, delay: 0.9 }}
                                        className="h-full bg-gradient-to-r from-ocean-500 to-ocean-300 rounded-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300 font-medium">Salt Marshes</span>
                                    <span className="text-blue-400">15%</span>
                                </div>
                                <div className="h-2 w-full bg-ocean-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '15%' }}
                                        transition={{ duration: 1, delay: 1.0 }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-teal-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Mangrove conservation projects currently hold the highest registry volume due to their
                                    exceptional carbon storage density in coastal sediments.
                                </p>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

            {/* Issue Credit Modal */}
            <AnimatePresence>
                {isIssueModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-blue-deep border border-teal-500/30 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl shadow-teal-500/20 relative"
                        >
                            <button
                                onClick={() => setIsIssueModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Issue Credits</h2>
                            
                            {/* Available Projects List */}
                            {allProjects.length > 0 && (
                                <div className="mb-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                                    <p className="text-sm font-medium text-teal-300 mb-3">📋 Available Projects:</p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {allProjects.map(p => (
                                            <div key={p.id} className="flex items-center justify-between text-xs bg-blue-deep/50 px-3 py-2 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-teal-400 font-bold">ID: {p.id}</span>
                                                    <span className="text-gray-300">{p.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${p.verified ? 'bg-teal-500/20 text-teal-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                                        {p.verified ? '✓ Verified' : 'Pending'}
                                                    </span>
                                                    {!p.verified && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleVerifyProject(p.id)}
                                                            className="px-2 py-0.5 bg-teal-500 hover:bg-teal-600 text-white text-xs rounded transition-colors"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Ganache Accounts Helper */}
                            {accounts.length > 0 && (
                                <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setShowAccounts(!showAccounts)}
                                        className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2 hover:text-purple-200 transition-colors"
                                    >
                                        <span>🔑 {showAccounts ? 'Hide' : 'Show'} Available Ganache Accounts</span>
                                        <svg className={`w-4 h-4 transition-transform ${showAccounts ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {showAccounts && (
                                        <div className="space-y-1 max-h-32 overflow-y-auto mt-2">
                                            {accounts.map((addr, i) => (
                                                <div key={addr} className="flex items-center justify-between text-xs bg-blue-deep/50 px-3 py-2 rounded-lg">
                                                    <span className="text-gray-400">Account {i}:</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIssueForm({ ...issueForm, to: addr })
                                                            navigator.clipboard.writeText(addr)
                                                        }}
                                                        className="font-mono text-purple-300 text-xs hover:text-purple-200 transition-colors"
                                                        title="Click to use this address"
                                                    >
                                                        {addr}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">❌ {errorMessage}</p>
                                </div>
                            )}
                            
                            <form onSubmit={handleIssueCredit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Project</label>
                                    <select
                                        required
                                        value={issueForm.projectId}
                                        onChange={(e) => setIssueForm({ ...issueForm, projectId: e.target.value })}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                    >
                                        <option value="">-- Choose a project --</option>
                                        {allProjects.filter(p => p.verified).map(p => (
                                            <option key={p.id} value={p.id}>
                                                ID {p.id} - {p.name} {p.verified ? '✓' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Only verified projects can issue credits</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount (tCO₂e)</label>
                                    <input
                                        type="number"
                                        required
                                        value={issueForm.amount}
                                        onChange={(e) => setIssueForm({ ...issueForm, amount: e.target.value })}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                        placeholder="Enter credit amount..."
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={issueForm.to}
                                        onChange={(e) => setIssueForm({ ...issueForm, to: e.target.value })}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all font-mono text-sm"
                                        placeholder="0x..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">💡 Tip: Get addresses from Ganache accounts</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isIssuing}
                                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-ocean-600 text-white font-semibold rounded-lg shadow-lg hover:from-teal-400 hover:to-ocean-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isIssuing ? 'Issuing Credits...' : 'Issue Credits to Blockchain'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Dashboard
