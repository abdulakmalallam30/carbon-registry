import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import introVideo from '../intro 1.mp4'

const Home = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const features = [
    {
      title: 'Project Registration',
      description: 'Register blue carbon projects with comprehensive documentation and verification processes.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Carbon Credit Tracking',
      description: 'Monitor and track carbon credits throughout their lifecycle with real-time data and analytics.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Transparent Monitoring',
      description: 'Ensure transparency and accountability with blockchain-based verification and satellite monitoring.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen relative">
      {/* Video Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
        >
          <source src={introVideo} type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl uppercase whitespace-nowrap"
            style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900', letterSpacing: '0.02em', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
            variants={itemVariants}
          >
            BLUE CARBON REGISTRY
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-white mb-8 font-black drop-shadow-lg"
            style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}
            variants={itemVariants}
          >
            A transparent digital system to:
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
            variants={itemVariants}
          >
            <motion.div
              className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-2xl font-black text-white drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>
                REGISTER
              </h3>
              <p className="text-sm text-cyan-300 mt-2 font-bold">Blue Carbon Ecosystem</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-sky-500/20 to-blue-500/10 backdrop-blur-sm border border-sky-500/30 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-2xl font-black text-white drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>
                MONITOR
              </h3>
              <p className="text-sm text-sky-300 mt-2 font-bold">Blue Carbon Ecosystem</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-2xl font-black text-white drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>
                VERIFY
              </h3>
              <p className="text-sm text-blue-300 mt-2 font-bold">Blue Carbon Ecosystem</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white font-black rounded-xl shadow-xl shadow-blue-500/40 hover:shadow-blue-500/70 transition-all"
              style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Registry
            </motion.button>

            <Link to="/about">
              <motion.button
                className="px-8 py-4 border-2 border-blue-400 text-white font-black rounded-xl hover:bg-blue-500/20 hover:border-blue-300 transition-all backdrop-blur-sm"
                style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* What is Blue Carbon Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-center mb-6 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 bg-clip-text text-transparent drop-shadow-xl" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>
              What is Blue Carbon?
            </h2>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 sm:p-12">
              <p className="text-lg text-white leading-relaxed text-center max-w-4xl mx-auto drop-shadow-md" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '800' }}>
                Blue carbon refers to carbon captured by ocean and coastal ecosystems, particularly 
                <span className="text-cyan-400 font-black"> mangroves</span>, 
                <span className="text-sky-400 font-black"> seagrasses</span>, and 
                <span className="text-blue-400 font-black"> salt marshes</span>. 
                These ecosystems are among the most effective carbon sinks on Earth, capable of storing 
                carbon for thousands of years in their sediments. Despite covering less than 2% of the 
                ocean floor, they account for roughly half of all carbon sequestered in ocean sediments.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-5xl font-black text-cyan-400 mb-2 drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>5-10×</div>
                  <div className="text-gray-100 text-sm font-bold">More carbon storage than terrestrial forests</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-5xl font-black text-sky-400 mb-2 drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>50%</div>
                  <div className="text-gray-100 text-sm font-bold">Of ocean carbon buried in sediments</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-5xl font-black text-blue-400 mb-2 drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>1000s</div>
                  <div className="text-gray-100 text-sm font-bold">Years of carbon storage capacity</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why a Registry Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-center mb-6 bg-gradient-to-r from-blue-400 via-indigo-500 to-cyan-600 bg-clip-text text-transparent drop-shadow-xl" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>
              Why a Registry?
            </h2>

            <p className="text-lg text-white text-center mb-12 max-w-3xl mx-auto font-bold drop-shadow-md" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '800' }}>
              The Blue Carbon Registry ensures integrity and trust in carbon credit markets through:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="h-full bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 group-hover:border-cyan-500/40 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>Transparency</h3>
                  <p className="text-gray-100 leading-relaxed font-bold" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '700' }}>
                    All project data, verification processes, and carbon credit transactions are recorded 
                    and accessible, ensuring complete transparency for stakeholders and investors.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="h-full bg-gradient-to-br from-sky-500/10 to-transparent backdrop-blur-sm border border-sky-500/20 rounded-xl p-8 group-hover:border-sky-500/40 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>Traceability</h3>
                  <p className="text-gray-100 leading-relaxed font-bold" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '700' }}>
                    Track carbon credits from creation to retirement, maintaining a complete audit trail 
                    that prevents double-counting and fraudulent claims.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="h-full bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-sm border border-indigo-500/20 rounded-xl p-8 group-hover:border-indigo-500/40 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>Verification</h3>
                  <p className="text-gray-100 leading-relaxed font-bold" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '700' }}>
                    Rigorous verification processes ensure that carbon credits represent real, measurable, 
                    and additional carbon sequestration from blue carbon ecosystems.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 mb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-center mb-6 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-xl" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>
              Key Features
            </h2>

            <p className="text-lg text-white text-center mb-12 max-w-3xl mx-auto font-bold drop-shadow-md" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '800' }}>
              Our platform provides comprehensive tools for managing blue carbon projects
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="group"
                >
                  <div className="h-full bg-gradient-to-br from-blue-500/10 to-sky-500/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 text-center group-hover:border-sky-500/40 group-hover:shadow-xl group-hover:shadow-blue-500/10 transition-all">
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-sky-500/20 rounded-2xl mb-6 text-sky-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '900' }}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-100 leading-relaxed font-bold" style={{ fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif', fontWeight: '700' }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  )
}

export default Home
