import React from 'react';
import cvData from '../data/cv-data.json';
import { motion } from 'framer-motion';

const Languages = ({ darkMode }) => {
  const languages = cvData.languages;

  return (
    <section
      id="languages"
      className={`py-20 transition-colors duration-500 ${
        darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-gray-900'
      }`}
    >
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Language <span className="text-indigo-600">Proficiency</span>
        </motion.h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {languages.map((lang, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium text-base">{lang.language}</span>
                <span className="text-sm text-indigo-500 font-semibold">{lang.level}</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${lang.percentage}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Languages;