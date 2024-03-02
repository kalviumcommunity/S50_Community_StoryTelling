import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:3000/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // console.log("Login response:", data);

        // Save JWT token in cookie
        document.cookie = `username=${data.token}; expires=${new Date(
          Date.now() + 3600000
        ).toUTCString()}; path=/; HttpOnly; Secure`;        
        // console.log("kk",document.cookie)

        setIsLoggedIn(true);
        navigate("/story");
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("An error occurred. Please try again later.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validate = (data) => {
    const errors = {};
    if (!data.username.trim()) {
      errors.username = "Username is required";
    }
    if (!data.password.trim()) {
      errors.password = "Password is required";
    }
    return errors;
  };

  if (isLoggedIn) {
    navigate("/story");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="text-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900 via-gray-900 to-indigo-800 min-h-screen flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-white">LOGIN</h1>
      <form onSubmit={handleSubmit} className="text-black">
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            autoComplete="username"
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
        </div>
        <div className="text-black mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            autoComplete="current-password"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-black py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <p className="mt-4 text-white">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-400">
          Signup here
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
