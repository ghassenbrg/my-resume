import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const ContactModal = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md mx-4 sm:mx-0 bg-white/80 dark:bg-slate-800/80 text-gray-800 dark:text-gray-100 rounded-2xl shadow-xl backdrop-blur-xl p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-indigo-600 hover:text-red-500 transition"
          >
            <FaTimes size={18} />
          </button>

          {/* Modal Content */}
          <h3 className="text-xl font-bold text-center mb-4 text-indigo-600">Contact Me</h3>

          <p className="text-sm text-center mb-6 text-gray-600 dark:text-gray-300">
            Feel free to reach out directly or drop a message below.
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Message sent! (Simulation)');
              onClose();
            }}
          >
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              rows="4"
              placeholder="Your message"
              className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-700 placeholder:text-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;
