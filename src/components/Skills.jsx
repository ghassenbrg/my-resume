import React from 'react';
import cvData from '../data/cv-data.json';
import { motion } from 'framer-motion';

const Skills = ({ darkMode }) => {
  const allCategories = Object.entries(cvData.skills || {});
  const highlightSkills = allCategories
    .flatMap(([_, skills]) => skills.filter((s) => s.highlight));
    //.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section
      id="skills"
      className={`py-20 transition-colors duration-500 ${
        darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-gray-900'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          My <span className="text-indigo-600">Skills</span>
        </motion.h2>

        {/* 🔹 Highlighted Skills */}
        {highlightSkills.length > 0 && (
          <motion.div
            className="mb-12 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {highlightSkills.map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100 font-semibold text-sm px-4 py-2 rounded-full shadow-sm"
              >
                {skill.name}
              </span>
            ))}
          </motion.div>
        )}

        {/* 🔸 Categorized Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allCategories.map(([category, skills], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className={`p-6 rounded-xl shadow-md transition ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      darkMode
                        ? 'bg-slate-700 text-slate-100'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;