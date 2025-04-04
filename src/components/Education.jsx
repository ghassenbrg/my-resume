import { motion } from "framer-motion";
import React from "react";
import { FaGraduationCap } from "react-icons/fa";

const Education = ({ darkMode, cvData }) => {
  const education = cvData.education;
  const certifications = cvData.certifications;

  return (
    <section
      id="education"
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
          <FaGraduationCap className="text-indigo-600  w-6 h-6" />
          Education & <span className="text-indigo-600">Certifications</span>
        </motion.h2>

        {/* 🎓 Education List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl shadow-md transition ${
                darkMode
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "bg-white hover:bg-slate-100"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-1">{edu.degree}</h3>
              <p className="text-sm text-indigo-500">{edu.institution}</p>
              <p
                className={`text-sm italic ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                {edu.period}
              </p>
              {edu.location && (
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {edu.location}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* 🏅 Certifications */}
        <div className="max-w-2xl mx-auto">
          <motion.h3
            className="text-xl font-semibold mb-4 text-center text-indigo-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Professional Certifications
          </motion.h3>

          <ul className="space-y-4">
            {certifications.map((cert, idx) => (
              <motion.li
                key={idx}
                className={`p-4 border-l-4 rounded-lg shadow-sm ${
                  darkMode
                    ? "bg-slate-800 border-indigo-500 text-white"
                    : "bg-white border-indigo-600 text-gray-900"
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4 flex-col sm:flex-row">
                  {cert.image && (
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="w-14 h-14 object-contain rounded-md shadow-sm"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{cert.name}</p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    >
                      Issued by {cert.issuer} – {cert.date}
                    </p>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-500 underline"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Education;
