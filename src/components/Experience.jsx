import React from "react";
import cvData from "../data/cv-data.json";
import { motion } from "framer-motion";

const Experience = ({ darkMode }) => {
  const experiences = cvData.experience || [];

  return (
    <section
      id="experience"
      className={`py-20 transition-colors duration-500 ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 md:px-10">
        <motion.h2
          className="text-3xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Professional <span className="text-indigo-600">Experience</span>
        </motion.h2>

        <div className="relative">
          {/* Center timeline line */}
          <div className="absolute left-1/2 top-0 w-1 h-full bg-indigo-600 -translate-x-1/2 z-0" />

          <div className="flex flex-col gap-20 relative z-10">
            {experiences.map((exp, i) => {
              const isRight = i % 2 !== 0;

              return (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row md:items-start w-full`}
                >
                  {/* MOBILE: Universal date + dot */}
                  <div
                    className={`md:hidden flex flex-col items-center justify-center mb-4 px-2 py-1 rounded ${
                      darkMode
                        ? "bg-slate-900 text-slate-300"
                        : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    <span className="text-sm italic mb-1">{exp.period}</span>
                    <div className="w-4 h-4 rounded-full bg-indigo-600 border-[4px] border-white shadow" />
                  </div>

                  {/* DESKTOP LEFT: Date + Dot (left side) */}
                  {!isRight && (
                    <div className="hidden md:flex flex-col items-end justify-start w-1/2 pr-6 relative">
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-sm italic ${
                            darkMode ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {exp.period}
                        </span>
                        <div className="w-4 h-4 rounded-full bg-indigo-600 border-[4px] border-white shadow" />
                      </div>
                    </div>
                  )}

                  {/* DESKTOP RIGHT: Dot + Date (right side) */}
                  {isRight && (
                    <div className="hidden md:flex flex-col items-start justify-start w-1/2 pl-6 relative order-2">
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 border-[4px] border-white shadow" />
                        <span
                          className={`text-sm italic ${
                            darkMode ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Experience CARD */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    viewport={{ once: true }}
                    className={`mt-6 md:mt-0 w-full md:w-1/2 ${
                      isRight ? "md:order-1 md:pr-6" : "md:pl-6"
                    }`}
                  >
                    <div
                      className={`p-6 rounded-xl shadow-md transition ${
                        darkMode ? "bg-slate-800" : "bg-white"
                      }`}
                    >
                      <h3 className="text-lg font-bold text-indigo-600 mb-1">
                        {exp.position}
                      </h3>
                      <h4
                        className={`text-sm font-semibold mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {exp.company} – {exp.location}
                      </h4>
                      {exp.description && (
                        <p
                          className={`text-sm mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {exp.description}
                        </p>
                      )}
                      <ul
                        className={`list-disc list-inside text-sm leading-relaxed space-y-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {exp.achievements?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
