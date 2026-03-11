import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, getCredits, issueCredit, getAccounts, verifyProject, registerProject, retireCredit } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const { currentUser, userRole, isNGO, isIndustry, isAdmin } = useAuth()
    const { currentUser, userRole, isNGO, isIndustry, isAdmin } = useAuth()
    const [projectsCount, setProjectsCount] = useState(0)
    const [creditsIssued, setCreditsIssued] = useState(0)
    const [creditsRetired, setCreditsRetired] = useState(0)
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)
    const [allProjects, setAllProjects] = useState([])
    const [allCredits, setAllCredits] = useState([])
    const [accounts, setAccounts] = useState([])
    const [showAccounts, setShowAccounts] = useState(false)

    // Register Project Modal (NGO & Admin)
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)

    // Issue Credit Modal (Admin only)
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
    const [issueForm, setIssueForm] = useState({ projectId: '', amount: '', to: '' })
    const [isIssuing, setIsIssuing] = useState(false)

    // Buy/Retire Credit Modal (Industry only)
    const [isRetireModalOpen, setIsRetireModalOpen] = useState(false)
    const [retireForm, setRetireForm] = useState({ creditId: '' })
    const [isRetiring, setIsRetiring] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

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
        setAllCredits(credits)
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
        setRecentActivity(activity.reverse().slice(0, 5))
        setLoading(false)
    }

    // Handle Register Project (NGO & Admin)
    const handleRegisterProject = async (e) => {
        e.preventDefault()
        if (!projectName.trim()) return

        setIsRegistering(true)
        setErrorMessage('')
        setSuccessMessage('')
        
        const result = await registerProject(projectName)
        if (result.success) {
            setSuccessMessage(`✅ Project "${projectName}" registered successfully!`)
            setProjectName('')
            setIsRegisterModalOpen(false)
            fetchDashboardData()
            setTimeout(() => setSuccessMessage(''), 3000)
        } else {
            setErrorMessage(result.error || 'Failed to register project')
        }
        setIsRegistering(false)
    }

    // Handle Issue Credit (Admin only)
    const handleIssueCredit = async (e) => {
        e.preventDefault()
        if (!issueForm.projectId || !issueForm.amount || !issueForm.to) return

        setIsIssuing(true)
        setErrorMessage('')
        setSuccessMessage('')
        
        const result = await issueCredit(issueForm.projectId, issueForm.amount, issueForm.to)
        if (result.success) {
            setSuccessMessage('✅ Credits issued successfully!')
            setIssueForm({ projectId: '', amount: '', to: '' })
            setIsIssueModalOpen(false)
            fetchDashboardData()
            setTimeout(() => setSuccessMessage(''), 3000)
        } else {
            setErrorMessage(result.error || 'Failed to issue credit. Make sure the project is verified.')
        }
        setIsIssuing(false)
    }

    // Handle Verify Project (Admin only)
    const handleVerifyProject = async (projectId) => {
        if (!window.confirm(`Are you sure you want to verify Project ID ${projectId}?`)) return
        
        setSuccessMessage('')
        setErrorMessage('')
        
        const result = await verifyProject(projectId)
        if (result.success) {
            setSuccessMessage('✅ Project verified successfully!')
            fetchDashboardData()
            setTimeout(() => setSuccessMessage(''), 3000)
        } else {
            setErrorMessage(`❌ Error: ${result.error}`)
            setTimeout(() => setErrorMessage(''), 3000)
        }
    }

    // Handle Retire/Buy Credit (Industry only)
    const handleRetireCredit = async (e) => {
        e.preventDefault()
        if (!retireForm.creditId) return

        setIsRetiring(true)
        setErrorMessage('')
        setSuccessMessage('')
        
        const result = await retireCredit(retireForm.creditId)
        if (result.success) {
            setSuccessMessage('✅ Credit purchased and retired successfully!')
            setRetireForm({ creditId: '' })
            setIsRetireModalOpen(false)
            fetchDashboardData()
            setTimeout(() => setSuccessMessage(''), 3000)
        } else {
            setErrorMessage(result.error || 'Failed to retire credit')
        }
        setIsRetiring(false)
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



    // Get role-specific welcome message
    const getRoleTitle = () => {
        if (isNGO) return 'NGO Dashboard'
        if (isIndustry) return 'Industry Dashboard'
        if (isAdmin) return 'Admin Dashboard'
        return 'Dashboard'
    }

    const getRoleDescription = () => {
        if (isNGO) return 'Register and manage your carbon offset projects'
        if (isIndustry) return 'Browse and purchase carbon credits'
        if (isAdmin) return 'Manage the entire Carbon Registry platform'
        return 'Carbon Registry Dashboard'
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Success/Error Messages */}
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-24 right-6 z-50 bg-teal-500/20 border border-teal-500/50 text-teal-300 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md"
                        >
                            {successMessage}
                        </motion.div>
                    )}
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-24 right-6 z-50 bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md"
                        >
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
                                {getRoleTitle()}
                            </h1>
                            <p className="text-xl text-gray-400">
                                {getRoleDescription()}
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center space-x-3 bg-teal-500/20 border border-teal-500/30 rounded-lg px-4 py-2">
                            <span className="text-3xl">
                                {isNGO && '🌱'}
                                {isIndustry && '🏭'}
                                {isAdmin && '👨‍💼'}
                            </span>
                            <div>
                                <p className="text-sm text-teal-300 font-medium">{currentUser?.displayName || currentUser?.email}</p>
                                <p className="text-xs text-gray-400">{userRole?.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
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

                {/* Role-based action buttons */}
                <div className="mb-8 flex gap-4 flex-wrap">
                    {(isNGO || isAdmin) && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-ocean-600 text-white font-semibold rounded-lg shadow-lg hover:from-teal-400 hover:to-ocean-500 transition-all"
                        >
                            🌱 Register New Project
                        </motion.button>
                    )}
                    {isAdmin && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsIssueModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-400 hover:to-pink-500 transition-all"
                        >
                            💎 Issue Credits
                        </motion.button>
                    )}
                    {isIndustry && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsRetireModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-400 hover:to-red-500 transition-all"
                        >
                            🛒 Purchase Credits
                        </motion.button>
                    )}
                </div>

                {/* Projects Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-blue-deep/40 backdrop-blur-md border border-ocean-500/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20"
                    >
                        <h2 className="text-2xl font-semibold text-white mb-6">
                            {isIndustry ? 'Available Projects' : 'Registered Projects'}
                        </h2>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {loading && (
                                <div className="text-center py-8 text-gray-400">Loading projects...</div>
                            )}
                            {!loading && allProjects.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    No projects found. {(isNGO || isAdmin) && 'Register one to get started!'}
                                </div>
                            )}
                            {allProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-ocean-900/30 border border-ocean-500/20 rounded-lg p-4 hover:border-teal-500/40 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-mono text-teal-400 font-bold">ID: {project.id}</span>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    project.verified 
                                                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                                                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                                }`}>
                                                    {project.verified ? '✓ Verified' : '⏳ Pending'}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                                            <p className="text-sm text-gray-400">Owner: {project.owner.substring(0, 10)}...{project.owner.substring(project.owner.length - 8)}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {isAdmin && !project.verified && (
                                                <button
                                                    onClick={() => handleVerifyProject(project.id)}
                                                    className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded transition-colors"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Credits Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-blue-deep/40 backdrop-blur-md border border-ocean-500/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20"
                    >
                        <h2 className="text-2xl font-semibold text-white mb-6">
                            {isIndustry ? 'Available Credits' : 'Issued Credits'}
                        </h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {loading && (
                                <div className="text-center py-8 text-gray-400">Loading credits...</div>
                            )}
                            {!loading && allCredits.filter(c => isIndustry ? !c.retired : true).length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    {isIndustry ? 'No credits available for purchase.' : 'No credits issued yet.'}
                                </div>
                            )}
                            {allCredits.filter(c => isIndustry ? !c.retired : true).map((credit) => {
                                const project = allProjects.find(p => String(p.id) === String(credit.projectId))
                                return (
                                    <div
                                        key={credit.id}
                                        className="bg-ocean-900/30 border border-ocean-500/20 rounded-lg p-4 hover:border-teal-500/40 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <span className="font-mono text-teal-400 font-bold text-sm">CRD-{String(credit.id).padStart(3, '0')}</span>
                                                {credit.retired && (
                                                    <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-xs">
                                                        Retired
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-2xl font-bold text-teal-300">{BigInt(credit.amount).toString()} tCO₂e</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-1">
                                            Project: {project ? project.name : `Unknown (ID: ${credit.projectId})`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Owner: {credit.owner.substring(0, 10)}...{credit.owner.substring(credit.owner.length - 8)}
                                        </p>
                                        {isIndustry && !credit.retired && (
                                            <button
                                                onClick={() => {
                                                    setRetireForm({ creditId: credit.id })
                                                    setIsRetireModalOpen(true)
                                                }}
                                                className="mt-3 w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors"
                                            >
                                                Purchase & Retire
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-blue-deep/40 backdrop-blur-md border border-ocean-500/20 rounded-2xl p-6 shadow-xl shadow-black/20"
                    >
                        <div className="text-teal-400 mb-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{projectsCount}</div>
                        <div className="text-gray-400 text-sm">Total Projects</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-blue-deep/40 backdrop-blur-md border border-ocean-500/20 rounded-2xl p-6 shadow-xl shadow-black/20"
                    >
                        <div className="text-teal-400 mb-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                            </svg>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{(BigInt(creditsIssued) - BigInt(creditsRetired)).toString()}</div>
                        <div className="text-gray-400 text-sm">Available Credits (tCO₂e)</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-blue-deep/40 backdrop-blur-md border border-ocean-500/20 rounded-2xl p-6 shadow-xl shadow-black/20"
                    >
                        <div className="text-teal-400 mb-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{creditsRetired.toString()}</div>
                        <div className="text-gray-400 text-sm">Credits Retired</div>
                    </motion.div>
                </div>
            </div>

            {/* Register Project Modal (NGO & Admin) */}
            <AnimatePresence>
                {isRegisterModalOpen && (
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
                                onClick={() => setIsRegisterModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Register New Project</h2>
                            
                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">{errorMessage}</p>
                                </div>
                            )}
                            
                            <form onSubmit={handleRegisterProject}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                        placeholder="e.g., Mangrove Restoration 2026"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter a descriptive name for your carbon offset project</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isRegistering}
                                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-ocean-600 text-white font-semibold rounded-lg shadow-lg hover:from-teal-400 hover:to-ocean-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRegistering ? 'Registering...' : 'Register Project'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Issue Credit Modal (Admin Only) */}
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

            {/* Retire/Purchase Credit Modal (Industry Only) */}
            <AnimatePresence>
                {isRetireModalOpen && (
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
                            className="bg-blue-deep border border-orange-500/30 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl shadow-orange-500/20 relative"
                        >
                            <button
                                onClick={() => setIsRetireModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Purchase & Retire Credit</h2>
                            
                            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                <p className="text-sm text-orange-300 mb-2">
                                    <strong>What does "Retire" mean?</strong>
                                </p>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Retiring a carbon credit means you are permanently removing it from circulation. 
                                    Once retired, it cannot be traded again and counts toward your company's carbon offset goals.
                                </p>
                            </div>

                            {/* Available Credits List */}
                            {allCredits.filter(c => !c.retired).length > 0 && (
                                <div className="mb-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                                    <p className="text-sm font-medium text-teal-300 mb-3">🛒 Available Credits for Purchase:</p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {allCredits.filter(c => !c.retired).map(c => {
                                            const proj = allProjects.find(p => String(p.id) === String(c.projectId))
                                            return (
                                                <div key={c.id} className="flex items-center justify-between text-xs bg-blue-deep/50 px-3 py-2 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-teal-400 font-bold">CRD-{String(c.id).padStart(3,'0')}</span>
                                                        <span className="text-gray-300">{BigInt(c.amount).toString()} tCO₂e</span>
                                                    </div>
                                                    <span className="text-gray-500 text-xs">{proj ? proj.name : `Project ${c.projectId}`}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            
                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">{errorMessage}</p>
                                </div>
                            )}
                            
                            <form onSubmit={handleRetireCredit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Credit to Purchase</label>
                                    <select
                                        required
                                        value={retireForm.creditId}
                                        onChange={(e) => setRetireForm({ creditId: e.target.value })}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                                    >
                                        <option value="">-- Choose a credit --</option>
                                        {allCredits.filter(c => !c.retired).map(credit => {
                                            const proj = allProjects.find(p => String(p.id) === String(credit.projectId))
                                            return (
                                                <option key={credit.id} value={credit.id}>
                                                    CRD-{String(credit.id).padStart(3, '0')} - {BigInt(credit.amount).toString()} tCO₂e ({proj ? proj.name : `Project ${credit.projectId}`})
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Only available (non-retired) credits can be purchased</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isRetiring}
                                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-400 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRetiring ? 'Processing...' : 'Confirm Purchase & Retire'}
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
