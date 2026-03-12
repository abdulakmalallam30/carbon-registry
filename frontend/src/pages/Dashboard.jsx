import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, getCredits, issueCredit, getAccounts, verifyProject, registerProject, retireCredit, searchProjectById, filterProjects, updateProjectStatus, getTransactions } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const { currentUser, userRole, isNGO, isIndustry, isAdmin } = useAuth()
    const [projectsCount, setProjectsCount] = useState(0)
    const [creditsIssued, setCreditsIssued] = useState(0)
    const [creditsRetired, setCreditsRetired] = useState(0)
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)
    const [allProjects, setAllProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const [allCredits, setAllCredits] = useState([])
    const [accounts, setAccounts] = useState([])
    const [showAccounts, setShowAccounts] = useState(false)

    // Search functionality (Industry)
    const [searchId, setSearchId] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    // Register Project Modal (NGO & Admin)
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [projectForm, setProjectForm] = useState({
        name: '',
        description: '',
        location: '',
        acres: ''
    })
    const [isRegistering, setIsRegistering] = useState(false)

    // Issue Credit Modal (Admin only)
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
    const [issueForm, setIssueForm] = useState({ projectId: '', amount: '', to: '' })
    const [isIssuing, setIsIssuing] = useState(false)

    // Buy/Retire Credit Modal (Industry only)
    const [isRetireModalOpen, setIsRetireModalOpen] = useState(false)
    const [retireForm, setRetireForm] = useState({ creditId: '' })
    const [isRetiring, setIsRetiring] = useState(false)

    // Advanced Filtering & Sorting
    const [filters, setFilters] = useState({
        location: '',
        minAcres: '',
        maxAcres: '',
        status: [],
        hasCredits: false,
        sortBy: 'newest',
        sortOrder: 'desc'
    })
    const [showFilters, setShowFilters] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)

    // Status Management (Admin only)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

    // Transaction History
    const [transactions, setTransactions] = useState([])
    const [showTransactions, setShowTransactions] = useState(false)
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)

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
        setFilteredProjects(projects)
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

    // Apply Advanced Filters
    const handleApplyFilters = async () => {
        setIsFiltering(true)
        const filtered = await filterProjects(filters)
        setFilteredProjects(filtered)
        setIsFiltering(false)
    }

    // Clear all filters
    const handleClearFilters = async () => {
        setFilters({
            location: '',
            minAcres: '',
            maxAcres: '',
            status: [],
            hasCredits: false,
            sortBy: 'newest',
            sortOrder: 'desc'
        })
        setFilteredProjects(allProjects)
    }

    // Handle Status Update (Admin only)
    const handleUpdateStatus = async (e) => {
        e.preventDefault()
        if (!selectedProject || !newStatus) return

        setIsUpdatingStatus(true)
        setErrorMessage('')
        setSuccessMessage('')

        const result = await updateProjectStatus(selectedProject.id, newStatus, rejectionReason)
        if (result.success) {
            setSuccessMessage(`✅ Project status updated to ${newStatus}!`)
            setStatusModalOpen(false)
            setSelectedProject(null)
            setNewStatus('')
            setRejectionReason('')
            fetchDashboardData()
            setTimeout(() => setSuccessMessage(''), 3000)
        } else {
            setErrorMessage(result.error || 'Failed to update status')
        }
        setIsUpdatingStatus(false)
    }

    // Load Transaction History
    const handleLoadTransactions = async () => {
        setIsLoadingTransactions(true)
        const txs = await getTransactions()
        setTransactions(txs)
        setShowTransactions(true)
        setIsLoadingTransactions(false)
    }

    // Export Transactions to CSV
    const handleExportTransactions = () => {
        if (transactions.length === 0) {
            alert('No transactions to export')
            return
        }

        const headers = ['Type', 'Project ID', 'Project Name', 'Credit ID', 'Amount', 'From', 'To', 'TX Hash', 'Timestamp', 'Rejection Reason']
        const rows = transactions.map(tx => [
            tx.type,
            tx.projectId || '',
            tx.projectName || '',
            tx.creditId || '',
            tx.amount || '',
            tx.from || '',
            tx.to || '',
            tx.txHash || '',
            tx.timestamp,
            tx.rejectionReason || ''
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `carbon-registry-transactions-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    // Get status badge color
    const getStatusBadge = (status) => {
        const badges = {
            'pending': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', icon: '⏳', label: 'Pending' },
            'under-review': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', icon: '🔍', label: 'Under Review' },
            'verified': { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30', icon: '✓', label: 'Verified' },
            'rejected': { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', icon: '✗', label: 'Rejected' }
        }
        return badges[status] || badges['pending']
    }

    // Handle Register Project (NGO & Admin)
    const handleRegisterProject = async (e) => {
        e.preventDefault()
        if (!projectForm.name.trim()) return

        setIsRegistering(true)
        setErrorMessage('')
        setSuccessMessage('')
        
        const result = await registerProject(
            projectForm.name,
            projectForm.description,
            projectForm.location,
            projectForm.acres
        )
        if (result.success) {
            setSuccessMessage(`✅ Project "${projectForm.name}" registered successfully!`)
            setProjectForm({ name: '', description: '', location: '', acres: '' })
            setIsRegisterModalOpen(false)
            fetchDashboardData()
            setTimeout(() => setSuccessMessage(''), 3000)
        } else {
            setErrorMessage(result.error || 'Failed to register project')
        }
        setIsRegistering(false)
    }

    // Handle Search by Project ID (Industry)
    const handleSearchProject = async () => {
        if (!searchId.trim()) {
            setFilteredProjects(allProjects)
            return
        }

        setIsSearching(true)
        const project = await searchProjectById(searchId)
        
        if (project) {
            setFilteredProjects([project])
        } else {
            setFilteredProjects([])
            setErrorMessage('Project not found')
            setTimeout(() => setErrorMessage(''), 3000)
        }
        setIsSearching(false)
    }

    // Clear search
    const handleClearSearch = () => {
        setSearchId('')
        setFilteredProjects(allProjects)
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

                {/* Advanced Filters Panel */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-blue-deep/40 backdrop-blur-md border border-ocean-500/20 rounded-2xl overflow-hidden"
                >
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-teal-500/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="font-semibold">Advanced Filters & Sorting</span>
                        </div>
                        <svg className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-ocean-500/20"
                            >
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Location Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">📍 Location</label>
                                            <input
                                                type="text"
                                                value={filters.location}
                                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                                placeholder="e.g., Sundarbans, Delhi"
                                                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                            />
                                        </div>

                                        {/* Min Acres */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">🌾 Min Acres</label>
                                            <input
                                                type="number"
                                                value={filters.minAcres}
                                                onChange={(e) => setFilters({ ...filters, minAcres: e.target.value })}
                                                placeholder="e.g., 10"
                                                min="0"
                                                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                            />
                                        </div>

                                        {/* Max Acres */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">🌾 Max Acres</label>
                                            <input
                                                type="number"
                                                value={filters.maxAcres}
                                                onChange={(e) => setFilters({ ...filters, maxAcres: e.target.value })}
                                                placeholder="e.g., 1000"
                                                min="0"
                                                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                            />
                                        </div>

                                        {/* Sort By */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">🔀 Sort By</label>
                                            <select
                                                value={filters.sortBy}
                                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                                className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                            >
                                                <option value="newest">Newest First</option>
                                                <option value="oldest">Oldest First</option>
                                                <option value="credits">Most Credits</option>
                                                <option value="acres">Largest Area</option>
                                                <option value="name">Name (A-Z)</option>
                                            </select>
                                        </div>

                                        {/* Status Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">📊 Status</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['pending', 'under-review', 'verified', 'rejected'].map(status => (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        onClick={() => {
                                                            const newStatuses = filters.status.includes(status)
                                                                ? filters.status.filter(s => s !== status)
                                                                : [...filters.status, status]
                                                            setFilters({ ...filters, status: newStatuses })
                                                        }}
                                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                                            filters.status.includes(status)
                                                                ? 'bg-teal-500 text-white'
                                                                : 'bg-ocean-900/50 text-gray-400 hover:bg-ocean-800/50'
                                                        }`}
                                                    >
                                                        {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Has Credits Checkbox */}
                                        <div className="flex items-center">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.hasCredits}
                                                    onChange={(e) => setFilters({ ...filters, hasCredits: e.target.checked })}
                                                    className="w-4 h-4 rounded border-ocean-500/30 bg-ocean-900/50 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                                                />
                                                <span className="text-sm text-gray-300">💎 Has Available Credits</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={handleApplyFilters}
                                            disabled={isFiltering}
                                            className="flex-1 px-6 py-2 bg-gradient-to-r from-teal-500 to-ocean-600 text-white font-semibold rounded-lg hover:from-teal-400 hover:to-ocean-500 transition-all disabled:opacity-50"
                                        >
                                            {isFiltering ? 'Applying...' : '🔍 Apply Filters'}
                                        </button>
                                        <button
                                            onClick={handleClearFilters}
                                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Transaction History Button */}
                {isAdmin && (
                    <div className="mb-8 flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLoadTransactions}
                            disabled={isLoadingTransactions}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-400 hover:to-pink-500 transition-all disabled:opacity-50"
                        >
                            {isLoadingTransactions ? 'Loading...' : '📜 View Transaction History'}
                        </motion.button>
                        {transactions.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleExportTransactions}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-400 hover:to-emerald-500 transition-all"
                            >
                                📥 Export to CSV
                            </motion.button>
                        )}
                    </div>
                )}

                {/* Transaction History Panel */}
                <AnimatePresence>
                    {showTransactions && transactions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 bg-blue-deep/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-white">Transaction History</h2>
                                <button
                                    onClick={() => setShowTransactions(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {transactions.map((tx, idx) => (
                                    <div key={idx} className="bg-ocean-900/30 border border-ocean-500/20 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                    tx.type === 'register' ? 'bg-blue-500/20 text-blue-300' :
                                                    tx.type === 'verify' ? 'bg-teal-500/20 text-teal-300' :
                                                    tx.type === 'reject' ? 'bg-red-500/20 text-red-300' :
                                                    tx.type === 'issue' ? 'bg-purple-500/20 text-purple-300' :
                                                    'bg-orange-500/20 text-orange-300'
                                                }`}>
                                                    {tx.type.toUpperCase()}
                                                </span>
                                                <div>
                                                    <p className="text-white font-medium">{tx.projectName}</p>
                                                    <p className="text-xs text-gray-400">Project ID: {tx.projectId}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
                                        </div>
                                        {tx.amount && (
                                            <p className="text-sm text-teal-300 mb-1">Amount: {tx.amount} tCO₂e</p>
                                        )}
                                        {tx.creditId && (
                                            <p className="text-sm text-gray-400 mb-1">Credit ID: {tx.creditId}</p>
                                        )}
                                        {tx.txHash && (
                                            <p className="text-xs text-gray-500 font-mono mb-1">TX: {tx.txHash.substring(0, 20)}...{tx.txHash.substring(tx.txHash.length - 10)}</p>
                                        )}
                                        {tx.rejectionReason && (
                                            <p className="text-sm text-red-300 mt-2 p-2 bg-red-500/10 rounded">Reason: {tx.rejectionReason}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

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

                        {/* Search Bar for Industries */}
                        {isIndustry && (
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearchProject()}
                                        placeholder="Search by Project ID..."
                                        className="flex-1 px-4 py-2 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                    />
                                    <button
                                        onClick={handleSearchProject}
                                        disabled={isSearching}
                                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isSearching ? '...' : '🔍'}
                                    </button>
                                    {searchId && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {loading && (
                                <div className="text-center py-8 text-gray-400">Loading projects...</div>
                            )}
                            {!loading && filteredProjects.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    {searchId ? 'No project found with that ID.' : 'No projects found.'} {(isNGO || isAdmin) && !searchId && 'Register one to get started!'}
                                </div>
                            )}
                            {filteredProjects.map((project) => {
                                const statusBadge = getStatusBadge(project.status || 'pending')
                                return (
                                    <div
                                        key={project.id}
                                        className="bg-ocean-900/30 border border-ocean-500/20 rounded-lg p-4 hover:border-teal-500/40 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <span className="font-mono text-teal-400 font-bold">ID: {project.id}</span>
                                                    
                                                    {/* Status Badge */}
                                                    <span className={`px-2 py-1 rounded text-xs ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}`}>
                                                        {statusBadge.icon} {statusBadge.label}
                                                    </span>

                                                    {/* Legacy Verified Badge */}
                                                    {project.verified && (
                                                        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                                                            ⛓️ On-Chain Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                                                
                                                {/* Project Details */}
                                                {project.description && (
                                                    <p className="text-sm text-gray-300 mb-2 leading-relaxed">{project.description}</p>
                                                )}
                                                <div className="space-y-1 text-xs text-gray-400">
                                                    {project.location && (
                                                        <div className="flex items-center gap-1">
                                                            <span>📍</span>
                                                            <span>Location: {project.location}</span>
                                                        </div>
                                                    )}
                                                    {project.acres > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <span>🌾</span>
                                                            <span>Area: {project.acres} acres</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <span>👤</span>
                                                        <span>Owner: {project.owner.substring(0, 10)}...{project.owner.substring(project.owner.length - 8)}</span>
                                                    </div>
                                                    {project.availableCredits !== undefined && BigInt(project.availableCredits) > 0 && (
                                                        <div className="flex items-center gap-1 text-teal-400 font-semibold">
                                                            <span>💎</span>
                                                            <span>Available Credits: {project.availableCredits} tCO₂e</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Rejection Reason */}
                                                {project.status === 'rejected' && project.rejectionReason && (
                                                    <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                                                        <strong>Rejection Reason:</strong> {project.rejectionReason}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Admin Controls */}
                                            <div className="flex flex-col gap-2 ml-3">
                                                {isAdmin && (
                                                    <>
                                                        {/* Verify Button (for blockchain verification) */}
                                                        {!project.verified && project.status === 'verified' && (
                                                            <button
                                                                onClick={() => handleVerifyProject(project.id)}
                                                                className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white text-xs rounded transition-colors whitespace-nowrap"
                                                                title="Verify on blockchain"
                                                            >
                                                                ⛓️ Verify
                                                            </button>
                                                        )}
                                                        
                                                        {/* Status Management Button */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProject(project)
                                                                setNewStatus(project.status || 'pending')
                                                                setStatusModalOpen(true)
                                                            }}
                                                            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition-colors whitespace-nowrap"
                                                            title="Change project status"
                                                        >
                                                            📊 Status
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
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
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={projectForm.name}
                                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                        placeholder="e.g., Mangrove Restoration 2026"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={projectForm.description}
                                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                                        placeholder="Describe your carbon offset project..."
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                                    <input
                                        type="text"
                                        required
                                        value={projectForm.location}
                                        onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                        placeholder="e.g., Sundarbans, West Bengal"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Area (Acres) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0.01"
                                        step="0.01"
                                        value={projectForm.acres}
                                        onChange={(e) => setProjectForm({ ...projectForm, acres: e.target.value })}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                        placeholder="e.g., 100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Total land area for plantation</p>
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

            {/* Status Management Modal (Admin Only) */}
            <AnimatePresence>
                {statusModalOpen && selectedProject && (
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
                            className="bg-blue-deep border border-purple-500/30 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl shadow-purple-500/20 relative"
                        >
                            <button
                                onClick={() => {
                                    setStatusModalOpen(false)
                                    setSelectedProject(null)
                                    setNewStatus('')
                                    setRejectionReason('')
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Update Project Status</h2>
                            
                            <div className="mb-6 p-4 bg-ocean-900/50 rounded-lg">
                                <p className="text-sm text-gray-400 mb-1">Project:</p>
                                <p className="text-white font-semibold">{selectedProject.name}</p>
                                <p className="text-xs text-gray-500">ID: {selectedProject.id}</p>
                            </div>

                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">{errorMessage}</p>
                                </div>
                            )}
                            
                            <form onSubmit={handleUpdateStatus}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">New Status</label>
                                    <select
                                        required
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                                    >
                                        <option value="pending">⏳ Pending</option>
                                        <option value="under-review">🔍 Under Review</option>
                                        <option value="verified">✓ Verified</option>
                                        <option value="rejected">✗ Rejected</option>
                                    </select>
                                </div>

                                {newStatus === 'rejected' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Rejection Reason *</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none"
                                            placeholder="Explain why this project is being rejected..."
                                        />
                                    </div>
                                )}

                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
                                    <p className="text-xs text-yellow-300">
                                        <strong>Note:</strong> Changing status to "Verified" here updates the workflow status. 
                                        You still need to click "⛓️ Verify" to verify the project on the blockchain.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdatingStatus}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-400 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdatingStatus ? 'Updating...' : 'Update Status'}
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
