import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { logoutUser, USER_ROLES } from '../firebase/auth'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, userRole, isNGO, isIndustry, isAdmin } = useAuth()
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    setShowUserMenu(false)
    navigate('/login')
  }

  const getRoleIcon = () => {
    if (isNGO) return '🌱'
    if (isIndustry) return '🏭'
    if (isAdmin) return '👨‍💼'
    return '👤'
  }

  const getRoleLabel = () => {
    if (isNGO) return t('nav.role.ngo')
    if (isIndustry) return t('nav.role.industry')
    if (isAdmin) return t('nav.role.admin')
    return t('nav.role.user')
  }

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
              className="flex items-center space-x-3 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 backdrop-blur-lg border-2 border-cyan-400/30 rounded-xl px-4 py-2 shadow-lg"
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
          <div className="flex items-center space-x-4 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 backdrop-blur-lg border-2 border-cyan-400/30 rounded-xl px-6 py-3 shadow-lg">
            <Link to="/">
              <motion.div
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive('/')
                    ? 'text-teal-300'
                    : 'text-gray-300 hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('nav.home')}
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
                {t('nav.about')}
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

            {currentUser && (
              <>
                <Link to="/projects">
                  <motion.div
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive('/projects')
                        ? 'text-teal-300'
                        : 'text-gray-300 hover:text-white'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('nav.projects')}
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
                    {t('nav.dashboard')}
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
              </>
            )}

            {/* Auth Section */}
            {currentUser ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-teal-500/20 to-ocean-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-teal-400/30 hover:border-teal-400/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">{getRoleIcon()}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">
                      {currentUser.displayName || currentUser.email}
                    </div>
                    <div className="text-xs text-teal-300">{getRoleLabel()}</div>
                  </div>
                </motion.button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-xl border border-teal-400/30 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-300">{t('nav.signedInAs')}</p>
                      <p className="text-sm font-medium text-white truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      {t('nav.signOut')}
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <motion.button
                    className="bg-gradient-to-r from-teal-500 to-ocean-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('nav.signIn')}
                  </motion.button>
                </Link>
                <Link to="/admin-login">
                  <motion.button
                    className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Admin
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
