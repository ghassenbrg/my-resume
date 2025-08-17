import React from "react";
import { motion } from "framer-motion";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaBuilding } from "react-icons/fa";

const Experience = ({ darkMode, cvData }) => {
  const { experience } = cvData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const achievementVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section
      id="experience"
      className={`py-20 ${
        darkMode ? "bg-darkBg text-white" : "bg-lightBg text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Professional{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Experience
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            A journey through my professional growth, showcasing key achievements and technical contributions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-accent-500 to-success-500 rounded-full" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experience.map((job, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex items-start ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full border-4 border-white shadow-lg z-10" />

                {/* Content Card */}
                <motion.div
                  className={`ml-16 md:ml-0 md:w-5/12 ${
                    index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                  }`}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`relative p-6 rounded-2xl shadow-xl ${
                    darkMode
                      ? "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50"
                      : "bg-white border border-gray-200/50 hover:border-gray-300/50"
                  } transition-all duration-300`}>
                    
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Company and Position */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FaBuilding className="text-primary-500" size={18} />
                            <h3 className="text-xl font-bold text-primary-600">
                              {job.company}
                            </h3>
                          </div>
                          <h4 className={`text-lg font-semibold mb-1 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {job.position}
                          </h4>
                        </div>
                        
                        {/* Current job indicator */}
                        {index === 0 && (
                          <span className="px-3 py-1 bg-gradient-to-r from-success-500 to-success-600 text-white text-xs font-medium rounded-full animate-pulse">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Location and Period */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-accent-500" size={14} />
                          <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                            {job.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-accent-500" size={14} />
                          <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                            {job.period}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-base leading-relaxed mb-6 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>
                        {job.description}
                      </p>

                      {/* Achievements */}
                      <div className="space-y-3">
                        <h5 className={`font-semibold flex items-center gap-2 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          <FaCheckCircle className="text-success-500" size={16} />
                          Key Achievements
                        </h5>
                        <ul className="space-y-2">
                          {job.achievements.map((achievement, achievementIndex) => (
                            <motion.li
                              key={achievementIndex}
                              variants={achievementVariants}
                              className={`flex items-start gap-3 text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="leading-relaxed">{achievement}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Hover effect line */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl" />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Summary */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`inline-flex items-center gap-8 px-8 py-6 rounded-2xl ${
            darkMode
              ? "bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200/50"
          } shadow-lg`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500">
                {experience.length}
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Companies
              </div>
            </div>
            <div className="w-px h-12 bg-gray-400/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-success-500">
                {experience.reduce((total, job) => total + job.achievements.length, 0)}
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Key Achievements
              </div>
            </div>
            <div className="w-px h-12 bg-gray-400/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-success-500">
                5+
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Years Experience
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
