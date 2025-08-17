import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaUniversity, FaCalendarAlt, FaMapMarkerAlt, FaCertificate, FaExternalLinkAlt } from "react-icons/fa";

const Education = ({ darkMode, cvData }) => {
  const { education, certifications } = cvData;

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="education"
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
            Education &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Certifications
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            My academic journey and professional certifications that demonstrate continuous learning and expertise
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={itemVariants}
              className="text-center mb-8"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center`}>
                <FaGraduationCap size={32} className="text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                Academic Background
              </h3>
              <p className={`text-base ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Engineering and Computer Science degrees
              </p>
            </motion.div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`group relative overflow-hidden rounded-xl p-6 ${
                    darkMode
                      ? "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50"
                      : "bg-white border border-gray-200/50 hover:border-gray-300/50"
                  } shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Degree */}
                    <h4 className={`text-lg font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {edu.degree}
                    </h4>

                    {/* Institution */}
                    <div className="flex items-center gap-2 mb-3">
                      <FaUniversity className="text-primary-500" size={16} />
                      <span className={`font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        {edu.institution}
                      </span>
                    </div>

                    {/* Location and Period */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-accent-500" size={14} />
                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                          {edu.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-accent-500" size={14} />
                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                          {edu.period}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={itemVariants}
              className="text-center mb-8"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent-500 to-success-500 flex items-center justify-center`}>
                <FaCertificate size={32} className="text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                Professional Certifications
              </h3>
              <p className={`text-base ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Industry-recognized credentials
              </p>
            </motion.div>

            <div className="space-y-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`group relative overflow-hidden rounded-xl p-6 ${
                    darkMode
                      ? "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50"
                      : "bg-white border border-gray-200/50 hover:border-gray-300/50"
                  } shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-success-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Certification Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold mb-2 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          {cert.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <FaUniversity className="text-accent-500" size={14} />
                          <span className={`text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            {cert.issuer}
                          </span>
                        </div>
                      </div>
                      
                      {/* Certification Badge */}
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-success-500 to-success-600 flex items-center justify-center">
                        <FaCertificate size={20} className="text-white" />
                      </div>
                    </div>

                    {/* Date and Link */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-accent-500" size={14} />
                        <span className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {cert.date}
                        </span>
                      </div>
                      
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            darkMode
                              ? "bg-primary-600 text-white hover:bg-primary-700"
                              : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                          } hover:scale-105`}
                        >
                          <FaExternalLinkAlt size={12} />
                          Verify
                        </a>
                      )}
                    </div>

                    {/* Certification Image */}
                    {cert.image && (
                      <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="w-full h-auto max-h-32 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Hover effect line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent-500 to-success-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Education Summary */}
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
                {education.length}
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Degrees
              </div>
            </div>
            <div className="w-px h-12 bg-gray-400/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-500">
                {certifications.length}
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Certifications
              </div>
            </div>
            <div className="w-px h-12 bg-gray-400/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-success-500">
                8+
              </div>
              <div className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Years of Study
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
