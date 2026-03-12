import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LiquidEther from '../components/LiquidEther'

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
      {/* Liquid Ether Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={0}
          cursorSize={0}
          isViscous={true}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={1.5}
          takeoverDuration={0}
          autoResumeDelay={0}
          autoRampDuration={0}
          color0="#5227FF"
          color1="#FF9FFC"
          color2="#B19EEF"
        />
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
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-300 via-ocean-300 to-blue-300 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Blue Carbon Registry
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-300 mb-4 font-light"
            variants={itemVariants}
          >
            A transparent digital system to register, monitor, and verify blue carbon ecosystem projects.
          </motion.p>

          <motion.p
            className="text-lg text-teal-300 mb-12 font-medium"
            variants={itemVariants}
          >
            Protecting coastal ecosystems through technology and transparency.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-ocean-600 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Registry
            </motion.button>

            <Link to="/about">
              <motion.button
                className="px-8 py-4 border-2 border-teal-400 text-teal-300 font-semibold rounded-lg hover:bg-teal-500/10 transition-all"
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
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
              What is Blue Carbon?
            </h2>
            
            <div className="bg-gradient-to-br from-teal-500/5 to-ocean-500/5 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-8 sm:p-12">
              <p className="text-lg text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
                Blue carbon refers to carbon captured by ocean and coastal ecosystems, particularly 
                <span className="text-teal-300 font-semibold"> mangroves</span>, 
                <span className="text-teal-300 font-semibold"> seagrasses</span>, and 
                <span className="text-teal-300 font-semibold"> salt marshes</span>. 
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
                  <div className="text-5xl font-bold text-teal-300 mb-2">5-10×</div>
                  <div className="text-gray-400 text-sm">More carbon storage than terrestrial forests</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-5xl font-bold text-teal-300 mb-2">50%</div>
                  <div className="text-gray-400 text-sm">Of ocean carbon buried in sediments</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-5xl font-bold text-teal-300 mb-2">1000s</div>
                  <div className="text-gray-400 text-sm">Years of carbon storage capacity</div>
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
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
              Why a Registry?
            </h2>

            <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl mx-auto">
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
                <div className="h-full bg-gradient-to-br from-teal-500/10 to-transparent backdrop-blur-sm border border-teal-500/20 rounded-xl p-8 group-hover:border-teal-500/40 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-ocean-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Transparency</h3>
                  <p className="text-gray-400 leading-relaxed">
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
                <div className="h-full bg-gradient-to-br from-ocean-500/10 to-transparent backdrop-blur-sm border border-ocean-500/20 rounded-xl p-8 group-hover:border-ocean-500/40 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-ocean-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-ocean-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Traceability</h3>
                  <p className="text-gray-400 leading-relaxed">
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
                <div className="h-full bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 group-hover:border-blue-500/40 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Verification</h3>
                  <p className="text-gray-400 leading-relaxed">
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
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
              Key Features
            </h2>

            <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl mx-auto">
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
                  <div className="h-full bg-gradient-to-br from-teal-500/5 to-ocean-500/5 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-8 text-center group-hover:border-teal-500/40 group-hover:shadow-xl group-hover:shadow-teal-500/10 transition-all">
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500/20 to-ocean-500/20 rounded-2xl mb-6 text-teal-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed">
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
