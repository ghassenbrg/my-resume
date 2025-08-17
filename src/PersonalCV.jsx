// All components now follow modern Tailwind design

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Import all components
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Languages from "./components/Languages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";

const PersonalCV = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [darkMode, setDarkMode] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [cvData, setCvData] = useState(null);

  // Load CV data
  useEffect(() => {
    fetch("/cv-data.json")
      .then((res) => res.json())
      .then(setCvData)
      .catch((err) => console.error("Failed to load CV data:", err));
  }, []);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Loading state
  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-accent-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Loading Resume</h2>
            <p className="text-gray-400">Preparing your professional showcase...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } transition-colors duration-500 min-h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Navigation */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        cvData={cvData}
      />

      {/* Main Content */}
      <main className="pt-16">
        <Hero darkMode={darkMode} cvData={cvData} />
        <About darkMode={darkMode} cvData={cvData} />
        <Skills darkMode={darkMode} cvData={cvData} />
        <Experience darkMode={darkMode} cvData={cvData} />
        <Projects darkMode={darkMode} cvData={cvData} />
        <Education darkMode={darkMode} cvData={cvData} />
        <Languages darkMode={darkMode} cvData={cvData} />
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} cvData={cvData} />

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          onClose={() => setShowContactModal(false)}
          darkMode={darkMode}
        />
      )}

      {/* Floating Contact Button */}
      <motion.button
        onClick={() => setShowContactModal(true)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white"
            : "bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white"
        } hover:scale-110 hover:shadow-primary-500/25`}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        title="Contact Me"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </motion.button>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={() => scrollToSection("hero")}
        className={`fixed bottom-8 left-8 z-50 p-3 rounded-full shadow-2xl transition-all duration-300 ${
          darkMode
            ? "bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white border border-gray-600/50"
            : "bg-white/80 hover:bg-gray-100/80 text-gray-600 hover:text-gray-900 border border-gray-300/50"
        } hover:scale-110 backdrop-blur-sm`}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        title="Scroll to Top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default PersonalCV;
