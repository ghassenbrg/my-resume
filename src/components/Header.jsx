import React, { useState } from "react";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({
  darkMode,
  setDarkMode,
  activeSection,
  scrollToSection,
  cvData,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    "home",
    "about",
    "skills",
    "experience",
    "projects",
    "education",
    "languages",
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 shadow-md transition-colors duration-500 ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo with favicon.svg */}
        <div
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-2 font-bold text-lg cursor-pointer"
        >
          <img src="/favicon.svg" alt="Logo" className="w-6 h-6" />
          <span className="text-indigo-600">
            {cvData.hero.name.split(" ")[0]}
          </span>{" "}
          {cvData.hero.name.split(" ")[1]}
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              className={`capitalize font-medium hover:text-indigo-600 transition ${
                activeSection === link ? "text-indigo-600 font-semibold" : ""
              }`}
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`text-lg p-2 ml-4 rounded-full ${
            darkMode ? "bg-slate-700" : "bg-indigo-100"
          } hover:scale-105 transition`}
          title="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Mobile menu button */}
        <button className="md:hidden ml-4" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile nav menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    scrollToSection(link);
                    closeMenu();
                  }}
                  className={`capitalize font-medium text-left hover:text-indigo-600 ${
                    activeSection === link
                      ? "text-indigo-600 font-semibold"
                      : ""
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
