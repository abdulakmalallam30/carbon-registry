import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProjects, registerProject } from '../services/api'

const Projects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [newProjectName, setNewProjectName] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        const data = await getProjects()
        // Enrich the backend data with UI mockup fields to maintain the layout
        const enriched = data.map((p, idx) => ({
            id: `PRJ-${String(p.id).padStart(3, '0')}`,
            name: p.name,
            type: ["Mangrove", "Seagrass", "Salt Marsh"][idx % 3], // Mocked type
            location: ["Southeast Asia", "Mediterranean", "North America", "Latin America"][idx % 4], // Mock location
            area: `${(idx + 1) * 500} hectares`, // Mock area
            status: p.verified ? "Active" : "Registered",
            credits: "TBD", // To be fetched or calculated
            description: `A blue carbon project registered on the blockchian under account ${p.owner.slice(0, 6)}...${p.owner.slice(-4)}.`,
            imageGradient: ["from-teal-600 to-ocean-800", "from-ocean-500 to-blue-800", "from-blue-600 to-teal-800", "from-teal-500 to-blue-700"][idx % 4]
        }))
        setProjects(enriched)
        setLoading(false)
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        if (!newProjectName.trim()) return

        setIsRegistering(true)
        const result = await registerProject(newProjectName)
        if (result.success) {
            setNewProjectName('')
            setIsModalOpen(false)
            fetchProjects() // Refresh list
        } else {
            alert(`Error: ${result.error}`)
        }
        setIsRegistering(false)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
                        Registered Projects
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Explore verified blue carbon projects protecting coastal ecosystems and sequestering carbon worldwide.
                    </p>
                </motion.div>

                {/* Filters and Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-between items-center gap-4 mb-12"
                >
                    <div className="flex gap-4">
                        <button className="px-6 py-2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/50 hover:bg-teal-500/30 transition-colors">
                            All Projects
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-teal-500 to-ocean-600 text-white font-semibold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all hover:scale-105"
                        >
                            + Register Project
                        </button>
                    </div>
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8"
                >
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="bg-blue-deep/60 backdrop-blur-md border border-ocean-500/20 rounded-2xl overflow-hidden group shadow-xl shadow-black/20"
                        >
                            {/* Project Image Placeholder */}
                            <div className={`h-48 w-full bg-gradient-to-br ${project.imageGradient} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md ${project.status === 'Active' ? 'bg-teal-500/80 text-white' :
                                        project.status === 'Registered' ? 'bg-blue-500/80 text-white' :
                                            'bg-yellow-500/80 text-white'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/50 text-gray-300 backdrop-blur-md">
                                        {project.id}
                                    </span>
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="p-6 sm:p-8">
                                {/* Project ID Badge - Prominent */}
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="px-4 py-2 bg-teal-500/20 border-2 border-teal-400/50 rounded-lg">
                                        <div className="text-xs text-teal-300 font-medium mb-0.5">Project ID</div>
                                        <div className="text-xl font-bold font-mono text-white">{project.id.split('-')[1]}</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center text-teal-400 text-sm font-medium">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                            </svg>
                                            {project.type}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                                    {project.name}
                                </h3>

                                <p className="text-gray-400 mb-6 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-ocean-500/20">
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Location</div>
                                        <div className="text-gray-200 font-medium text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {project.location}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Area Protected</div>
                                        <div className="text-gray-200 font-medium text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                            {project.area}
                                        </div>
                                    </div>
                                    <div className="col-span-2 mt-2">
                                        <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Est. Sequestered</div>
                                        <div className="text-lg font-bold text-teal-400 flex items-center">
                                            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {project.credits}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        onClick={() => setSelectedProject(project)}
                                        className="w-full py-3 bg-gradient-to-r from-ocean-600 to-blue-700 hover:from-teal-500 hover:to-ocean-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-black/20 group-hover:shadow-teal-500/20"
                                    >
                                        View Project Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {projects.length === 0 && !loading && (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-gray-400 bg-blue-deep/30 rounded-2xl border border-ocean-500/20">
                            No projects found. Register the first blue carbon project!
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Register Project Modal */}
            <AnimatePresence>
                {isModalOpen && (
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
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Register New Project</h2>
                            <form onSubmit={handleRegister}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                        placeholder="Enter project name..."
                                    />
                                    <p className="text-xs text-teal-400/80 mt-2">
                                        This will immediately be recorded on the blockchain network. Gas fees will apply.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isRegistering}
                                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-ocean-600 text-white font-semibold rounded-lg shadow-lg hover:from-teal-400 hover:to-ocean-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRegistering ? 'Registering on Blockchain...' : 'Register Project'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
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
                            className="bg-blue-deep border border-teal-500/30 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl shadow-ocean-500/20 relative"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className={`h-32 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 rounded-t-2xl bg-gradient-to-br ${selectedProject.imageGradient} relative overflow-hidden flex items-end p-6 sm:p-8`}>
                                <div className="absolute inset-0 bg-black/30" />
                                <div className="relative z-10 w-full">
                                    <span className={`px-3 py-1 mr-3 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md ${selectedProject.status === 'Active' ? 'bg-teal-500/80 text-white' :
                                        selectedProject.status === 'Registered' ? 'bg-blue-500/80 text-white' :
                                            'bg-yellow-500/80 text-white'
                                        }`}>
                                        {selectedProject.status}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/50 text-gray-200 backdrop-blur-md">
                                        {selectedProject.id}
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h2>
                            <p className="text-gray-400 text-sm mb-6">{selectedProject.description}</p>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                <div>
                                    <span className="block text-gray-500 uppercase tracking-wider text-xs mb-1">Ecosystem Type</span>
                                    <span className="text-teal-300 font-medium">{selectedProject.type}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 uppercase tracking-wider text-xs mb-1">Region</span>
                                    <span className="text-gray-200">{selectedProject.location}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 uppercase tracking-wider text-xs mb-1">Protected Area</span>
                                    <span className="text-gray-200">{selectedProject.area}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 uppercase tracking-wider text-xs mb-1">Estimated Sequestered</span>
                                    <span className="text-teal-400 font-bold">{selectedProject.credits}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-ocean-500/30">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="w-full py-3 bg-ocean-800 text-white font-medium rounded-xl hover:bg-ocean-700 transition-colors"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Projects
