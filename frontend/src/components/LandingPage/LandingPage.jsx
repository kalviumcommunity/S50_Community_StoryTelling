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
      transition={{ duration: 1 }}
      className="bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900 min-h-screen flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to Community Storytelling
      </h1>
      <p className="text-lg mb-8 max-w-lg text-center">
        Unleash your creativity and join a community of storytellers. Start a
        new story, continue an existing one, or contribute random lines to fuel
        imagination.
      </p>
      <div className="flex space-x-4">
        <Link to="/signup" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <FaUserPlus className="mr-2" /> Sign Up
        </Link>
        <Link to="/login" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <FaSignInAlt className="mr-2" /> Login
        </Link>
        <Link to="/story" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <FaSignInAlt className="mr-2" /> Test
        </Link>
      </div>
    </motion.div>
  );
};

export default LandingPage;
