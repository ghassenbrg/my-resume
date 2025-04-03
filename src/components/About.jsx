import React from 'react';
import cvData from '../data/cv-data.json';
import { motion } from 'framer-motion';

const About = ({ darkMode }) => {
  const { paragraphs } = cvData.about;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 }
    })
  };

  // Keyword highlight
  const keywordHighlight = (text) => {
    const highlights = [
      'Java',
      'Spring Boot',
      'Angular',
      'CI/CD',
      'containerization',
      'microservices',
      'Oracle Certified',
      'Docker',
      'Kubernetes',
      'infrastructure automation'
    ];

    const regex = new RegExp(`(${highlights.join('|')})`, 'gi');
    return text.split(regex).map((part, i) =>
      highlights.includes(part) || highlights.includes(part.toLowerCase()) ? (
        <span key={i} className="text-indigo-500 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <section
      id="about"
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
          About <span className="text-indigo-600">Me</span>
        </motion.h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              className={`text-base md:text-lg ${
                darkMode ? 'text-gray-400' : 'text-gray-700'
              } dark:text-gray-100 leading-relaxed`}
              custom={index}
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
            >
              {keywordHighlight(paragraph)}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;