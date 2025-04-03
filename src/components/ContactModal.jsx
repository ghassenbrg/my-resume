import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast';

const ContactModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        'service_ghassen_io',     // 🔁 Replace with your actual service ID
        'template_ghassen_io_cont',    // 🔁 Replace with your actual template ID
        e.target,
        'AQDInfmbzEsuK-x5L'      // 🔁 Replace with your public API key
      )
      .then(
        () => {
          toast.success('Message sent successfully!');
          setLoading(false);
          setSent(true);
          setTimeout(() => {
            setSent(false);
            onClose();
          }, 2000);
        },
        (error) => {
          toast.error('Failed to send message. Try again later.');
          console.error(error);
          setLoading(false);
        }
      );
  };

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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-indigo-600 hover:text-red-500 transition"
          >
            <FaTimes size={18} />
          </button>

          <h3 className="text-xl font-bold text-center mb-4 text-indigo-600">Contact Me</h3>
          <p className="text-sm text-center mb-6 text-gray-600 dark:text-gray-300">
            Feel free to reach out directly or drop a message below.
          </p>

          {/* ✅ Success Checkmark */}
          {sent ? (
            <motion.div
              className="flex flex-col items-center justify-center text-center text-green-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <FaCheckCircle size={50} className="mb-3" />
              <p className="text-lg font-semibold">Message sent!</p>
            </motion.div>
          ) : (
            <form className="space-y-4" onSubmit={sendEmail}>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Message title"
                className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                name="message"
                rows="4"
                placeholder="Your message"
                className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-700 placeholder:text-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;