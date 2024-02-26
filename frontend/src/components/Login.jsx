import React, { useState } from "react";
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
        const response = await fetch("http://localhost:3000/user/login", { // Update the URL to /user/login
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Login response:", data);
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
    return <Redirect to="/story" />;
  }

  return (
    <div className="text-white bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="text-white">
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
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Login
        </button>
      </form>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <p className="mt-4">
        Don't have an account? <Link to="/signup" className="text-white">Signup here</Link>
      </p>
    </div>
  );
};

export default LoginForm;
