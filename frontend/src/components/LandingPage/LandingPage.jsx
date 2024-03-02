import React from "react";
import { motion } from "framer-motion";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }} // Slow fade transition
      className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900 via-gray-900 to-indigo-800 min-h-screen flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Welcome to Community Storytelling
      </h1>
      <p className="text-lg mb-8 max-w-lg text-center text-white">
        Unleash your creativity and join a community of storytellers. Start a
        new story, continue an existing one, or contribute random lines to fuel
        imagination.
      </p>
      <div className="flex space-x-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/signup"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaUserPlus className="mr-2" /> Sign Up
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/login"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaSignInAlt className="mr-2" /> Login
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/story"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaSignInAlt className="mr-2" /> Test
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
