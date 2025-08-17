import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaCode, FaGlobe, FaGraduationCap } from "react-icons/fa";

const About = ({ darkMode, cvData }) => {
  const { paragraphs } = cvData.about;

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

  const highlightCards = [
    {
      icon: FaUser,
      title: "Professional Experience",
      description: "5+ years in software engineering",
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50",
      textColor: "text-primary-700",
    },
    {
      icon: FaCode,
      title: "Technical Expertise",
      description: "Full-stack & backend development",
      color: "from-accent-500 to-accent-600",
      bgColor: "bg-accent-50",
      textColor: "text-accent-700",
    },
    {
      icon: FaGlobe,
      title: "Global Perspective",
      description: "Multilingual & multicultural",
      color: "from-success-500 to-success-600",
      bgColor: "bg-success-50",
      textColor: "text-success-700",
    },
    {
      icon: FaGraduationCap,
      title: "Continuous Learning",
      description: "Oracle Certified Developer",
      color: "from-warning-500 to-warning-600",
      bgColor: "bg-warning-50",
      textColor: "text-warning-700",
    },
  ];

  return (
    <section
      id="about"
      className={`py-20 ${
        darkMode ? "bg-darkBg text-white" : "bg-lightBg text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Me
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left side - Text content */}
          <motion.div variants={itemVariants} className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className={`text-lg leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          {/* Right side - Visual representation */}
          <motion.div
            variants={itemVariants}
            className={`relative p-8 rounded-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                : "bg-gradient-to-br from-gray-50 to-white border border-gray-200/50"
            } shadow-xl`}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center`}>
                  <FaCode size={32} className="text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  Software Engineer
                </h3>
                <p className={`text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  Full-Stack & Backend Specialist
                </p>
              </div>

              {/* Skills preview */}
              <div className="grid grid-cols-2 gap-4">
                {["Java", "Spring Boot", "Angular", "PostgreSQL"].map((skill, index) => (
                  <motion.div
                    key={skill}
                    className={`p-3 rounded-lg text-center ${
                      darkMode
                        ? "bg-gray-800/50 text-gray-300 border border-gray-700/50"
                        : "bg-white/80 text-gray-700 border border-gray-200/50"
                    } backdrop-blur-sm`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-sm font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Highlight Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {highlightCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-xl p-6 ${
                darkMode
                  ? "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50"
                  : "bg-white border border-gray-200/50 hover:border-gray-300/50"
              } shadow-lg hover:shadow-xl transition-all duration-300`}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon size={24} className="text-white" />
              </div>

              {/* Content */}
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {card.title}
              </h3>
              <p className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                {card.description}
              </p>

              {/* Hover effect line */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
