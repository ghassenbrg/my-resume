import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = ({ darkMode, cvData }) => {
  const { github, linkedin, email } = cvData.hero;

  return (
    <footer
      className={`py-10 border-t transition-colors duration-500 ${
        darkMode
          ? "bg-slate-900 border-slate-700 text-white"
          : "bg-slate-50 border-slate-200 text-gray-800"
      }`}
    >
      <div className="container mx-auto px-6 text-center">
        <h4 className="text-lg font-semibold mb-4 text-indigo-600">
          Let’s Connect
        </h4>

        <div className="flex justify-center gap-6 mb-6 text-gray-400 dark:text-gray-300">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-600 transition"
          >
            <FaGithub size={22} />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-600 transition"
          >
            <FaLinkedin size={22} />
          </a>
          <a
            href={`mailto:${email}`}
            className="hover:text-indigo-600 transition"
          >
            <FaEnvelope size={22} />
          </a>
        </div>

        <p className="text-sm text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Ghassen Bargougui. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
