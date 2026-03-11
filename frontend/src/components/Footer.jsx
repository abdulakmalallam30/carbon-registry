import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="relative z-10 bg-gradient-to-b from-transparent to-blue-deep/50 backdrop-blur-sm border-t border-teal-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-teal-300 mb-4">
              Blue Carbon Registry
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A transparent digital system to register, monitor, and verify blue carbon ecosystem projects. 
              Protecting coastal ecosystems through technology and transparency.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-teal-300 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-teal-300 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-teal-300 transition-colors text-sm"
                >
                  About
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-teal-300 mb-4">
              Get Involved
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join us in protecting our ocean ecosystems and building a sustainable future 
              through transparent carbon credit verification.
            </p>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-12 pt-8 border-t border-teal-500/20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Blue Carbon Registry. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
