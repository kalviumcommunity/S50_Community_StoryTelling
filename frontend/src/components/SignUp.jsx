import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
      if (formData.password !== formData.repeatPassword) {
        setErrors({ repeatPassword: "Passwords do not match" });
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });
        if (response.ok) {
          console.log("User signed up successfully");
          // Optionally reset form data after successful submission
          setFormData({
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
          });
        } else {
          console.error("Failed to sign up user");
        }
      } catch (error) {
        console.error("Error occurred while signing up:", error);
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
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email address is invalid";
    }
    if (!data.password) {
      errors.password = "Password is required";
    }
    if (!data.repeatPassword) {
      errors.repeatPassword = "Repeat password is required";
    }
    return errors;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="text-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900 via-gray-900 to-indigo-800 min-h-screen flex flex-col justify-center items-center"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-white">SIGN UP</h1>
      <form onSubmit={handleSubmit} className="text-black">
        <div className="text-black mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="on"
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
        </div>
        <div className="text-black mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="on"
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div className="text-black mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="on"
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <div className="text-black mb-4">
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat Password"
            value={formData.repeatPassword}
            onChange={handleChange}
            autoComplete="on"
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.repeatPassword && (
            <p className="text-red-500">{errors.repeatPassword}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-black py-2 px-4 rounded"
        >
          Signup
        </button>
      </form>
      <p className="mt-4 text-white">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400">
          Login here
        </Link>
      </p>
    </motion.div>
  );
};

export default SignupForm;
