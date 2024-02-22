import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupForm = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('https://localhost:3000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          // Assuming successful signup, you might want to handle this according to your application flow
          console.log('User signed up successfully');
        } else {
          // Handle error responses from the server
          console.error('Failed to sign up user');
        }
      } catch (error) {
        console.error('Error occurred while signing up:', error);
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
    return errors;
  };

  return (
    <div className="bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Signup</h1>
      <form onSubmit={handleSubmit} className="text-white">
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Signup
        </button>
      </form>
      <p className="mt-4 text-white">
        Already have an account? <Link to="/login" className="text-black">Login here</Link>
      </p>
    </div>
  );
};

export default SignupForm;
