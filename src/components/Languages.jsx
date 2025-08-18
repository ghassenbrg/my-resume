import React from "react";
import { motion } from "framer-motion";
import { FaGlobe, FaStar, FaComments, FaGraduationCap, FaLightbulb } from "react-icons/fa";

const Languages = ({ darkMode, cvData }) => {
  const { languages } = cvData;

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

  const getProficiencyColor = (percentage) => {
    if (percentage >= 80) return "from-success-500 to-success-600";
    if (percentage >= 60) return "from-warning-500 to-warning-600";
    if (percentage >= 40) return "from-accent-500 to-accent-600";
    return "from-gray-400 to-gray-500";
  };

  const getProficiencyLabel = (percentage) => {
    if (percentage >= 100) return "Native";
    if (percentage >= 80) return "Fluent";
    if (percentage >= 60) return "Advanced";
    if (percentage >= 40) return "Intermediate";
    return "Basic";
  };

  const getProficiencyIcon = (percentage) => {
    if (percentage >= 80) return FaStar;
    if (percentage >= 60) return FaComments;
    if (percentage >= 40) return FaGraduationCap;
    return FaLightbulb;
  };

  return (
    <section
      id="languages"
      className={`py-20 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
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
            Language{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Proficiency
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Multilingual capabilities that enable effective communication in diverse professional environments
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Languages Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {languages.map((language, index) => {
            const Icon = getProficiencyIcon(language.percentage);
            const proficiencyColor = getProficiencyColor(language.percentage);
            const proficiencyLabel = getProficiencyLabel(language.percentage);

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-2xl p-6 ${
                  darkMode
                    ? "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50"
                    : "bg-white border border-gray-200/50 hover:border-gray-300/50"
                } shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Language name and level */}
                  <div className="text-center mb-4">
                    <h3 className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {language.language}
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {proficiencyLabel}
                    </p>
                  </div>
                </div>

                {/* Hover effect line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${proficiencyColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Language Skills Summary */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Communication Skills */}
          <motion.div
            variants={itemVariants}
            className={`text-center p-6 rounded-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200/50"
            } shadow-lg`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
              <FaComments size={32} className="text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Communication
            </h3>
            <p className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Fluent in English and French for professional communication
            </p>
          </motion.div>

          {/* Cultural Understanding */}
          <motion.div
            variants={itemVariants}
            className={`text-center p-6 rounded-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200/50"
            } shadow-lg`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 flex items-center justify-center">
              <FaGlobe size={32} className="text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Cultural Awareness
            </h3>
            <p className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Native Arabic speaker with multicultural experience
            </p>
          </motion.div>

          {/* Learning Ability */}
          <motion.div
            variants={itemVariants}
            className={`text-center p-6 rounded-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200/50"
            } shadow-lg`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-success-500 to-success-600 flex items-center justify-center">
              <FaLightbulb size={32} className="text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Continuous Learning
            </h3>
            <p className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Currently learning Japanese for global collaboration
            </p>
          </motion.div>
        </motion.div>


      </div>
    </section>
  );
};

export default Languages;
