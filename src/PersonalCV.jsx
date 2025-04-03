// All components now follow modern Tailwind design

import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Languages from './components/Languages';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';

import React, { useState, useEffect } from 'react';

const PersonalCV = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [darkMode, setDarkMode] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

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

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-500 min-h-screen`}>      
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      <main className="pt-16">
        <Hero darkMode={darkMode} />
        <About darkMode={darkMode} />
        <Skills darkMode={darkMode} />
        <Experience darkMode={darkMode} />
        <Projects darkMode={darkMode} />
        <Education darkMode={darkMode} />
        <Languages darkMode={darkMode} />
      </main>

      <Footer darkMode={darkMode} />

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}

      {/* Floating contact button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowContactModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all"
          title="Contact Me"
        >
          📩
        </button>
      </div>
    </div>
  );
};

export default PersonalCV;
