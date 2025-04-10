import { motion } from "framer-motion";
import React from "react";
import { FaRocket } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const Projects = ({ darkMode, cvData }) => {
  const projects = cvData.projects;

  return (
    <section
      id="projects"
      className={`py-20 transition-colors duration-500 ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FaRocket className="text-indigo-600 w-6 h-6" />
          Featured <span className="text-indigo-600">Projects</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl shadow-md transition-all hover:shadow-lg ${
                darkMode
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "bg-white hover:bg-slate-100"
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{project.title}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-700"
                    title="View project"
                  >
                    <span>{project.linkLabel}</span>
                    <FiExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
              <p className="text-sm text-indigo-400 mb-2 italic">
                {project.role}
              </p>

              <ul
                className={`list-disc list-inside text-sm space-y-1 mb-4 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {project.outcomes.map((outcome, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {outcome}
                  </motion.li>
                ))}
              </ul>

              <div>
                <h4 className="text-sm font-semibold mb-1 text-indigo-600">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full font-medium ${
                        darkMode
                          ? "bg-indigo-700 text-indigo-100"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
