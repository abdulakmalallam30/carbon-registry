import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-blue-deep/90 backdrop-blur-lg shadow-lg shadow-teal-500/10'
          : 'bg-transparent'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-ocean-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
                Blue Carbon Registry
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <motion.div
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive('/')
                    ? 'text-teal-300'
                    : 'text-gray-300 hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
                {isActive('/') && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-ocean-500"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </Link>

            <Link to="/about">
              <motion.div
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive('/about')
                    ? 'text-teal-300'
                    : 'text-gray-300 hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About
                {isActive('/about') && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-ocean-500"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </Link>

            <Link to="/projects">
              <motion.div
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive('/projects')
                    ? 'text-teal-300'
                    : 'text-gray-300 hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Projects
                {isActive('/projects') && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-ocean-500"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </Link>

            <Link to="/dashboard">
              <motion.div
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive('/dashboard')
                    ? 'text-teal-300'
                    : 'text-gray-300 hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dashboard
                {isActive('/dashboard') && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-ocean-500"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
