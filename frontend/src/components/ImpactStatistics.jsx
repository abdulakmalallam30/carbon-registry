import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const ImpactStatistics = ({ projects, transactions, userRole }) => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalAcres: 0,
        totalCredits: 0,
        co2Offset: 0,
        treesEquivalent: 0,
        projectsByStatus: {},
        projectsByLocation: {},
        creditsOverTime: [],
        topProjects: []
    })

    // CO2 Calculation Constants
    const CO2_PER_ACRE_PER_YEAR = 2.5 // tons of CO2 absorbed per acre per year
    const TREES_PER_ACRE = 435 // average trees per acre
    const CO2_PER_TREE_PER_YEAR = 48 // pounds of CO2 per tree per year

    useEffect(() => {
        calculateStatistics()
    }, [projects, transactions])

    const calculateStatistics = () => {
        if (!projects || projects.length === 0) {
            return
        }

        // Total projects
        const totalProjects = projects.length

        // Total acres
        const totalAcres = projects.reduce((sum, p) => {
            const metadata = p.metadata || {}
            return sum + (parseFloat(metadata.acres) || 0)
        }, 0)

        // Total credits
        const totalCredits = projects.reduce((sum, p) => {
            return sum + (parseFloat(p.creditsAvailable) || 0)
        }, 0)

        // CO2 offset calculation (acres × CO2 per acre)
        const co2Offset = totalAcres * CO2_PER_ACRE_PER_YEAR

        // Trees equivalent
        const treesEquivalent = totalAcres * TREES_PER_ACRE

        // Projects by status
        const projectsByStatus = projects.reduce((acc, p) => {
            const status = p.metadata?.status || 'pending'
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {})

        // Projects by location
        const projectsByLocation = projects.reduce((acc, p) => {
            const location = p.metadata?.location || 'Unknown'
            acc[location] = (acc[location] || 0) + 1
            return acc
        }, {})

        // Credits over time (from transactions)
        const creditsOverTime = generateCreditsOverTime(transactions)

        // Top projects by credits
        const topProjects = [...projects]
            .sort((a, b) => parseFloat(b.creditsAvailable || 0) - parseFloat(a.creditsAvailable || 0))
            .slice(0, 5)

        setStats({
            totalProjects,
            totalAcres,
            totalCredits,
            co2Offset,
            treesEquivalent,
            projectsByStatus,
            projectsByLocation,
            creditsOverTime,
            topProjects
        })
    }

    const generateCreditsOverTime = (transactions) => {
        if (!transactions || transactions.length === 0) return []

        const monthlyData = transactions
            .filter(t => t.type === 'issue')
            .reduce((acc, t) => {
                const date = new Date(t.timestamp)
                const month = `${date.getMonth() + 1}/${date.getFullYear()}`
                acc[month] = (acc[month] || 0) + parseFloat(t.amount || 0)
                return acc
            }, {})

        return Object.entries(monthlyData).map(([month, credits]) => ({
            month,
            credits
        }))
    }

    // Chart configurations
    const creditsLineChartData = {
        labels: stats.creditsOverTime.map(d => d.month),
        datasets: [
            {
                label: 'Credits Issued',
                data: stats.creditsOverTime.map(d => d.credits),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    }

    const topProjectsBarData = {
        labels: stats.topProjects.map(p => `Project #${p.id}`),
        datasets: [
            {
                label: 'Credits Available',
                data: stats.topProjects.map(p => parseFloat(p.creditsAvailable || 0)),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }
        ]
    }

    const statusDoughnutData = {
        labels: Object.keys(stats.projectsByStatus).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [
            {
                data: Object.values(stats.projectsByStatus),
                backgroundColor: [
                    'rgba(234, 179, 8, 0.8)',  // pending - yellow
                    'rgba(59, 130, 246, 0.8)', // under-review - blue
                    'rgba(34, 197, 94, 0.8)',  // verified - green
                    'rgba(239, 68, 68, 0.8)'   // rejected - red
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }
        ]
    }

    const locationBarData = {
        labels: Object.keys(stats.projectsByLocation).slice(0, 8),
        datasets: [
            {
                label: 'Projects',
                data: Object.values(stats.projectsByLocation).slice(0, 8),
                backgroundColor: 'rgba(147, 51, 234, 0.8)',
                borderColor: 'rgb(147, 51, 234)',
                borderWidth: 1
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#fff' }
            }
        },
        scales: {
            y: {
                ticks: { color: '#fff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#fff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#fff' }
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Hero Stats - Animated Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon="🌍"
                    title="Total CO₂ Offset"
                    value={stats.co2Offset}
                    suffix=" tons"
                    decimals={1}
                    color="from-green-500 to-emerald-600"
                />
                <StatCard
                    icon="🌳"
                    title="Trees Equivalent"
                    value={stats.treesEquivalent}
                    suffix=" trees"
                    decimals={0}
                    color="from-blue-500 to-cyan-600"
                />
                <StatCard
                    icon="🏞️"
                    title="Total Acres"
                    value={stats.totalAcres}
                    suffix=" acres"
                    decimals={1}
                    color="from-purple-500 to-pink-600"
                />
                <StatCard
                    icon="⭐"
                    title="Carbon Credits"
                    value={stats.totalCredits}
                    suffix=" credits"
                    decimals={0}
                    color="from-amber-500 to-orange-600"
                />
            </div>

            {/* Progress Bars for Global Goals */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl border border-gray-700"
            >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>🎯</span>
                    Global Carbon Goals Progress
                </h3>
                <div className="space-y-4">
                    <ProgressBar
                        label="Annual CO₂ Offset Target (1000 tons)"
                        current={stats.co2Offset}
                        target={1000}
                        color="green"
                    />
                    <ProgressBar
                        label="Plantation Area Goal (10,000 acres)"
                        current={stats.totalAcres}
                        target={10000}
                        color="blue"
                    />
                    <ProgressBar
                        label="Active Projects Milestone (100 projects)"
                        current={stats.totalProjects}
                        target={100}
                        color="purple"
                    />
                </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Credits Over Time */}
                {stats.creditsOverTime.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl border border-gray-700"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">📈 Credits Issued Over Time</h3>
                        <div className="h-64">
                            <Line data={creditsLineChartData} options={chartOptions} />
                        </div>
                    </motion.div>
                )}

                {/* Top Projects */}
                {stats.topProjects.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl border border-gray-700"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">🏆 Top Projects by Credits</h3>
                        <div className="h-64">
                            <Bar data={topProjectsBarData} options={chartOptions} />
                        </div>
                    </motion.div>
                )}

                {/* Project Status Distribution */}
                {Object.keys(stats.projectsByStatus).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl border border-gray-700"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">📊 Projects by Status</h3>
                        <div className="h-64">
                            <Doughnut data={statusDoughnutData} options={doughnutOptions} />
                        </div>
                    </motion.div>
                )}

                {/* Location Heatmap (Bar representation) */}
                {Object.keys(stats.projectsByLocation).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl border border-gray-700"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">🗺️ Projects by Location</h3>
                        <div className="h-64">
                            <Bar data={locationBarData} options={chartOptions} />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Impact Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 shadow-xl"
            >
                <h3 className="text-2xl font-bold text-white mb-3">🌱 Environmental Impact Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                    <div>
                        <p className="text-sm opacity-90">Equivalent to removing</p>
                        <p className="text-2xl font-bold">
                            {Math.round(stats.co2Offset / 4.6)} cars
                        </p>
                        <p className="text-xs opacity-75">off the road for a year</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Energy saved equivalent to</p>
                        <p className="text-2xl font-bold">
                            {Math.round(stats.co2Offset * 113)} kWh
                        </p>
                        <p className="text-xs opacity-75">of electricity</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Forest coverage</p>
                        <p className="text-2xl font-bold">
                            {(stats.totalAcres / 640).toFixed(2)} sq miles
                        </p>
                        <p className="text-xs opacity-75">of new forest land</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// Reusable Stat Card Component with Animated Counter
const StatCard = ({ icon, title, value, suffix, decimals, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-xl`}
        >
            <div className="text-4xl mb-2">{icon}</div>
            <h3 className="text-sm font-medium text-white opacity-90 mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white">
                <CountUp
                    end={value}
                    duration={2}
                    decimals={decimals}
                    separator=","
                    suffix={suffix}
                />
            </div>
        </motion.div>
    )
}

// Progress Bar Component
const ProgressBar = ({ label, current, target, color }) => {
    const percentage = Math.min((current / target) * 100, 100)
    const colorClasses = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500'
    }

    return (
        <div>
            <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>{label}</span>
                <span className="font-semibold">
                    {current.toFixed(1)} / {target} ({percentage.toFixed(1)}%)
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${colorClasses[color]} rounded-full relative`}
                >
                    {percentage > 10 && (
                        <span className="absolute right-2 top-0.5 text-xs text-white font-bold">
                            {percentage.toFixed(0)}%
                        </span>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default ImpactStatistics
