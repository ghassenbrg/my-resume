import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const Footer = ({ darkMode, cvData }) => {
  const { hero } = cvData;

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

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${
        darkMode ? "bg-darkBg text-white" : "bg-gray-900 text-white"
      }`}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Personal Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">GB</span>
              </div>
              <h3 className="text-2xl font-bold">{hero.name}</h3>
            </div>
            <p className={`text-lg leading-relaxed mb-6 ${
              darkMode ? "text-gray-300" : "text-gray-300"
            }`}>
              Experienced Full-Stack Software Engineer passionate about building scalable, 
              high-performance applications and contributing to innovative technology solutions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary-400" size={16} />
                <span className="text-gray-300">{hero.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-primary-400" size={16} />
                <span className="text-gray-300">{hero.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary-400" size={16} />
                <span className="text-gray-300">{hero.email}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {["About", "Skills", "Experience", "Projects", "Education", "Languages"].map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className={`text-gray-300 hover:text-primary-400 transition-colors duration-200 ${
                      darkMode ? "hover:text-primary-400" : "hover:text-primary-300"
                    }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 text-white">Connect</h4>
            <div className="space-y-4">
              <a
                href={hero.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-700 group-hover:bg-gray-600 flex items-center justify-center transition-colors duration-200">
                  <FaGithub size={20} />
                </div>
                <span>GitHub</span>
              </a>
              <a
                href={hero.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center transition-colors duration-200">
                  <FaLinkedin size={20} />
                </div>
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:${hero.email}`}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-600 group-hover:bg-green-500 flex items-center justify-center transition-colors duration-200">
                  <FaEnvelope size={20} />
                </div>
                <span>Email</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={`inline-block p-8 rounded-2xl ${
            darkMode
              ? "bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50"
              : "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
          } shadow-xl`}>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Let's Connect
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Have a question about my work or want to discuss a project? 
              Feel free to reach out for professional networking and collaboration!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${hero.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <FaEnvelope size={16} />
                Contact Me
              </a>
              <a
                href={hero.cvLink}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Download CV
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${
        darkMode ? "border-gray-800" : "border-gray-800"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} {hero.name}. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" size={14} />
              <span>using React & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
