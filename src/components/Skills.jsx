import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode, FaDatabase, FaCloud, FaShieldAlt, FaCogs, FaRocket, FaTools, FaUsers } from "react-icons/fa";

const Skills = ({ darkMode, cvData }) => {
  const [activeCategory, setActiveCategory] = useState("Backend & Full-Stack Development");
  const { skills } = cvData;

  const categoryIcons = {
    "Backend & Full-Stack Development": FaCode,
    "Database & Data Processing": FaDatabase,
    "API Development": FaCode,
    "Microservices & Event-Driven Systems": FaCogs,
    "DevOps & Infrastructure": FaCloud,
    "Testing & Code Quality": FaTools,
    "Security": FaShieldAlt,
    "High-Performance Computing": FaRocket,
    "Agile & Collaboration": FaUsers,
  };

  // Devicon icon mapping for technologies
  const getTechIcon = (skillName) => {
    const iconMap = {
      "Java": "devicon-java-plain",
      "Spring Boot": "devicon-spring-plain",
      "Java EE": "devicon-java-plain",
      "Hibernate": "devicon-java-plain",
      "JPA": "devicon-java-plain",
      "Angular": "devicon-angularjs-plain",
      "TypeScript": "devicon-typescript-plain",
      "JavaScript": "devicon-javascript-plain",
      "Node.js": "devicon-nodejs-plain",
      "HTML5": "devicon-html5-plain",
      "CSS3": "devicon-css3-plain",
      "PrimeNG": "devicon-angularjs-plain",
      "RxJS": "devicon-javascript-plain",
      "NgRx (Basic)": "devicon-angularjs-plain",
      "PostgreSQL": "devicon-postgresql-plain",
      "MySQL": "devicon-mysql-plain",
      "Oracle (PL/SQL)": "devicon-oracle-plain",
      "MongoDB": "devicon-mongodb-plain",
      "Apache POI (Excel Processing)": "devicon-java-plain",
      "RESTful API Design": "devicon-javascript-plain",
      "OpenAPI": "devicon-javascript-plain",
      "Spring Cloud": "devicon-spring-plain",
      "ActiveMQ": "devicon-java-plain",
      "Docker": "devicon-docker-plain",
      "Jenkins": "devicon-jenkins-plain",
      "GitLab CI/CD": "devicon-gitlab-plain",
      "AWS": "devicon-amazonwebservices-plain",
      "Nginx": "devicon-nginx-plain",
      "WildFly": "devicon-java-plain",
      "Tomcat": "devicon-tomcat-plain",
      "Linux Server Management": "devicon-linux-plain",
      "JUnit": "devicon-java-plain",
      "Mockito": "devicon-java-plain",
      "Integration Tests": "devicon-java-plain",
      "SonarQube": "devicon-java-plain",
      "Code Review Best Practices": "devicon-git-plain",
      "Keycloak (OAuth2, OIDC, JWT)": "devicon-java-plain",
      "Asynchronous Processing": "devicon-java-plain",
      "Multi-threading": "devicon-java-plain",
      "JProfiler": "devicon-java-plain",
      "Scrum": "devicon-git-plain",
      "Jira": "devicon-jira-plain",
      "Git": "devicon-git-plain",
      "Confluence": "devicon-jira-plain"
    };
    
    return iconMap[skillName] || "devicon-java-plain";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const skillCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <section
      id="skills"
      className={`py-12 sm:py-16 lg:py-20 ${
        darkMode ? "bg-darkBg text-white" : "bg-lightBg text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Technical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Skills
            </span>
          </h2>
          <p className={`text-lg sm:text-xl max-w-3xl mx-auto px-4 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            A comprehensive toolkit of technologies and methodologies I've mastered through years of hands-on experience
          </p>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-4 sm:mt-6" />
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {Object.keys(skills).map((category) => {
            const Icon = categoryIcons[category];
            return (
              <motion.button
                key={category}
                variants={itemVariants}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                  activeCategory === category
                    ? darkMode
                      ? "bg-primary-600 text-white shadow-lg"
                      : "bg-primary-100 text-primary-700 shadow-md"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } border ${
                  activeCategory === category
                    ? "border-primary-500"
                    : darkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{category}</span>
                <span className="xs:hidden sm:hidden">{category.split(" ")[0]}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {skills[activeCategory]?.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={skillCardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 ${
                  darkMode
                    ? "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50"
                    : "bg-white border border-gray-200/50 hover:border-gray-300/50"
                } shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                {/* Highlight indicator */}
                {skill.highlight && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Skill icon/name */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${
                      skill.highlight
                        ? "bg-gradient-to-r from-primary-500 to-accent-500"
                        : darkMode
                        ? "bg-gray-700"
                        : "bg-gray-100"
                    } flex items-center justify-center flex-shrink-0`}>
                      <i className={`${getTechIcon(skill.name)} text-sm sm:text-lg ${
                        skill.highlight ? "text-white" : darkMode ? "text-gray-300" : "text-gray-600"
                      }`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold text-sm sm:text-base truncate ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {skill.name}
                      </h3>
                      {skill.highlight && (
                        <span className="text-xs text-accent-500 font-medium">Core Skill</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover effect line */}
                <div className={`absolute bottom-0 left-0 h-0.5 sm:h-1 ${
                  skill.highlight
                    ? "bg-gradient-to-r from-primary-500 to-accent-500"
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-6 sm:px-8 py-6 rounded-xl sm:rounded-2xl ${
            darkMode
              ? "bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200/50"
          } shadow-lg`}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-500">
                {(() => {
                  // Calculate years of experience from work history
                  const workStart = new Date('2019-10-01'); // VERMEG start date
                  const now = new Date();
                  const yearsDiff = now.getFullYear() - workStart.getFullYear();
                  const monthsDiff = now.getMonth() - workStart.getMonth();
                  const totalYears = yearsDiff + (monthsDiff / 12);
                  return Math.floor(totalYears) + '+';
                })()}
              </div>
              <div className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Years Experience
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-400/30" />
            <div className="block sm:hidden w-12 h-px bg-gray-400/30" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent-500">
                {Object.values(skills).flat().filter(s => s.highlight).length}
              </div>
              <div className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Core Technologies
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-400/30" />
            <div className="block sm:hidden w-12 h-px bg-gray-400/30" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-success-500">
                {Object.keys(skills).length}
              </div>
              <div className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Skill Domains
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
