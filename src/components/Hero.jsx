import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const Hero = ({ darkMode, cvData }) => {
  const { name, title, github, linkedin, email, cvLink } = cvData.hero;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden text-white"
    >
      {/* 🔹 Blurry Zoomed Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src="/computer_programmer_bg.jpg"
          alt="Background"
          className="w-full h-full object-cover scale-110 blur-1xl opacity-100"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.5 }}
          transition={{
            duration: 15,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* 🔸 Foreground Content */}
      <div className="z-10 text-center px-6 max-w-3xl">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {name.split(" ")[0]}{" "}
          <span className="text-indigo-500">{name.split(" ")[1]}</span>
        </motion.h1>

        <motion.h2
          className="text-xl md:text-2xl font-medium text-slate-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.h2>

        <motion.div
          className="flex justify-center gap-5 mb-6 text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href={github}
            className="hover:text-indigo-400"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub size={24} />
          </a>
          <a
            href={linkedin}
            className="hover:text-indigo-400"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin size={24} />
          </a>
          <a href={`mailto:${email}`} className="hover:text-indigo-400">
            <FaEnvelope size={24} />
          </a>
        </motion.div>

        <motion.a
          href={cvLink}
          download
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Download CV
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
