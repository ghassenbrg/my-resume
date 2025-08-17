import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt, FaCode, FaRocket, FaUsers, FaChartLine, FaLaptopCode, FaGamepad, FaServer } from "react-icons/fa";

const Projects = ({ darkMode, cvData }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const { projects } = cvData;

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

  const projectTypeIcons = {
    "Full Stack Game Developer": FaGamepad,
    "Lead Developer": FaUsers,
    "Backend Developer": FaServer,
    "Full-Stack Developer": FaLaptopCode,
  };

  const getProjectIcon = (role) => {
    return projectTypeIcons[role] || FaCode;
  };

  return (
    <section
      id="projects"
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
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Projects
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            A showcase of my technical expertise through real-world applications and innovative solutions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl ${
                darkMode
                  ? "bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50"
                  : "bg-white border border-gray-200/50 hover:border-gray-300/50"
              } shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(getProjectIcon(project.role), {
                        className: "text-primary-500",
                        size: 18
                      })}
                      <span className="text-sm font-medium text-accent-500">
                        {project.role}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {project.title}
                    </h3>
                  </div>
                  
                  {/* External link if available */}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-700"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaExternalLinkAlt size={16} />
                    </a>
                  )}
                </div>

                {/* Outcomes */}
                <div className="mb-6">
                  <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    <FaRocket className="text-success-500" size={14} />
                    Key Outcomes
                  </h4>
                  <ul className="space-y-2">
                    {project.outcomes.slice(0, 3).map((outcome, outcomeIndex) => (
                      <li
                        key={outcomeIndex}
                        className={`flex items-start gap-2 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                    {project.outcomes.length > 3 && (
                      <li className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-500"
                      }`}>
                        +{project.outcomes.length - 3} more outcomes
                      </li>
                    )}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    <FaCode className="text-primary-500" size={14} />
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className={`px-2 py-1 text-xs font-medium rounded-lg ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </motion.div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                } shadow-2xl`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className={`p-6 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {React.createElement(getProjectIcon(selectedProject.role), {
                          className: "text-primary-500",
                          size: 20
                        })}
                        <span className="text-sm font-medium text-accent-500">
                          {selectedProject.role}
                        </span>
                      </div>
                      <h3 className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {selectedProject.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-700"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Outcomes */}
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      <FaRocket className="text-success-500" size={16} />
                      Key Outcomes
                    </h4>
                    <ul className="space-y-2">
                      {selectedProject.outcomes.map((outcome, index) => (
                        <li
                          key={index}
                          className={`flex items-start gap-3 text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="leading-relaxed">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      <FaCode className="text-primary-500" size={16} />
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* External Link */}
                  {selectedProject.link && (
                    <div className="pt-4">
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          darkMode
                            ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
                            : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
                        } hover:shadow-lg hover:scale-105`}
                      >
                        <FaExternalLinkAlt size={16} />
                        {selectedProject.linkLabel || "View Project"}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
