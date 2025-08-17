import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

const Hero = ({ darkMode, cvData }) => {
  const { name, title, location, phone, email, github, linkedin, cvLink } = cvData.hero;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const backgroundVariants = {
    hidden: { scale: 1.1, opacity: 0.8 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 20, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <motion.img
          src="/computer_programmer_bg.jpg"
          alt="Background"
          className="w-full h-full object-cover"
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-primary-900/40" />
        
        {/* Animated geometric elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary-400/20 rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-accent-400/20 rotate-45 animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-success-400/20 rounded-full animate-pulse" />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Name and Title */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-white">{name.split(" ")[0]}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 ml-4">
              {name.split(" ")[1]}
            </span>
          </motion.h1>
          
          <motion.h2
            className="text-xl md:text-2xl lg:text-3xl font-light text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            whileHover={{ scale: 1.01 }}
          >
            {title}
          </motion.h2>
        </motion.div>

        {/* Contact Information Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto"
        >
          <motion.div
            className={`p-4 rounded-xl backdrop-blur-sm border ${
              darkMode 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-black/10 border-black/20 text-gray-800"
            }`}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaMapMarkerAlt className="mx-auto mb-2 text-primary-400" size={20} />
            <p className="text-sm font-medium">{location}</p>
          </motion.div>
          
          <motion.div
            className={`p-4 rounded-xl backdrop-blur-sm border ${
              darkMode 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-black/10 border-black/20 text-gray-800"
            }`}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPhone className="mx-auto mb-2 text-primary-400" size={20} />
            <p className="text-sm font-medium">{phone}</p>
          </motion.div>
          
          <motion.div
            className={`p-4 rounded-xl backdrop-blur-sm border ${
              darkMode 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-black/10 border-black/20 text-gray-800"
            }`}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEnvelope className="mx-auto mb-2 text-primary-400" size={20} />
            <p className="text-sm font-medium">{email}</p>
          </motion.div>
        </motion.div>

        {/* Social Links and CTA */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            {[
              { icon: FaGithub, href: github, label: "GitHub", color: "hover:text-gray-300" },
              { icon: FaLinkedin, href: linkedin, label: "LinkedIn", color: "hover:text-blue-400" },
              { icon: FaEnvelope, href: `mailto:${email}`, label: "Email", color: "hover:text-green-400" },
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                  darkMode 
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                    : "bg-black/10 border-black/20 text-gray-800 hover:bg-black/20"
                } ${social.color}`}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </div>

          {/* Download CV Button */}
          <motion.a
            href={cvLink}
            download
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl ${
              darkMode
                ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
                : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
            } hover:shadow-primary-500/25 hover:scale-105`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <FaDownload size={20} />
            Download CV
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
