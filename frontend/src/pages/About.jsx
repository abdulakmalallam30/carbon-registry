import { motion } from 'framer-motion'

const About = () => {
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

  const ecosystems = [
    {
      name: 'Mangroves',
      description: 'Coastal forests that thrive in saltwater, storing up to 4 times more carbon per hectare than terrestrial forests.',
      benefits: ['Storm protection', 'Habitat for marine life', 'Water filtration']
    },
    {
      name: 'Seagrasses',
      description: 'Underwater flowering plants that can store carbon 35 times faster than tropical rainforests.',
      benefits: ['Oxygen production', 'Nursery for fish', 'Sediment stabilization']
    },
    {
      name: 'Salt Marshes',
      description: 'Coastal wetlands that are incredibly efficient at capturing and storing atmospheric carbon.',
      benefits: ['Coastal erosion control', 'Water quality improvement', 'Wildlife habitat']
    }
  ]

  const technologies = [
    {
      title: 'MRV Systems',
      description: 'Measurement, Reporting, and Verification',
      details: 'Advanced monitoring systems track carbon sequestration rates, ecosystem health, and project performance in real-time.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Blockchain Verification',
      description: 'Immutable record keeping',
      details: 'Blockchain technology ensures transparency, prevents double-counting, and provides an immutable audit trail for all transactions.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Satellite Monitoring',
      description: 'Remote sensing and analysis',
      details: 'Satellite imagery and remote sensing technologies provide continuous monitoring of ecosystem health and carbon storage capacity.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-300 via-ocean-300 to-blue-300 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            About Blue Carbon Registry
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Building trust and transparency in carbon credit markets for marine ecosystems
          </motion.p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-br from-teal-500/10 to-ocean-500/10 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              The Blue Carbon Registry is dedicated to building trust and integrity in carbon credit 
              markets specifically designed for marine and coastal ecosystems. Our mission is to provide 
              a transparent, verifiable, and accessible platform that connects project developers, 
              investors, and environmental stakeholders.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe that protecting our blue carbon ecosystems is critical to combating climate 
              change, and we're committed to ensuring that every carbon credit represents real, 
              measurable impact. Through cutting-edge technology and rigorous verification standards, 
              we're creating a marketplace built on trust and environmental integrity.
            </p>
          </div>
        </motion.section>

        {/* Why Blue Carbon Matters Section */}
        <motion.section
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
            Why Blue Carbon Matters
          </h2>
          <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Blue carbon ecosystems are vital to our planet's health and climate regulation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ecosystems.map((ecosystem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-teal-500/5 to-transparent backdrop-blur-sm border border-teal-500/20 rounded-xl p-6 group-hover:border-teal-500/40 transition-all">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {ecosystem.name}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {ecosystem.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-teal-300 mb-2">Key Benefits:</p>
                    {ecosystem.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-400 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Climate Impact Stats */}
          <motion.div
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-teal-300 mb-2">20%</div>
              <div className="text-sm text-gray-400">Global mangrove loss since 1980</div>
            </div>
            <div className="bg-gradient-to-br from-ocean-500/10 to-transparent border border-ocean-500/20 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-ocean-300 mb-2">30%</div>
              <div className="text-sm text-gray-400">Seagrass decline worldwide</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-300 mb-2">1.02 Gt</div>
              <div className="text-sm text-gray-400">CO₂ released annually from degradation</div>
            </div>
            <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-teal-300 mb-2">$50B+</div>
              <div className="text-sm text-gray-400">Annual ecosystem services value</div>
            </div>
          </motion.div>
        </motion.section>

        {/* Technology Section */}
        <motion.section
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
            Our Technology
          </h2>
          <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Leveraging cutting-edge technology to ensure accuracy, transparency, and trust
          </p>

          <div className="space-y-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-teal-500/5 to-ocean-500/5 backdrop-blur-sm border border-teal-500/20 rounded-xl p-8 group-hover:border-teal-500/40 transition-all">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <motion.div
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-ocean-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {tech.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {tech.title}
                      </h3>
                      <p className="text-teal-300 font-medium mb-3">
                        {tech.description}
                      </p>
                      <p className="text-gray-400 leading-relaxed">
                        {tech.details}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-br from-teal-500/10 to-ocean-500/10 backdrop-blur-sm border border-teal-500/30 rounded-2xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join Us in Protecting Our Oceans
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Together, we can create a sustainable future by preserving and restoring 
              critical blue carbon ecosystems while supporting climate action.
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-ocean-600 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default About
