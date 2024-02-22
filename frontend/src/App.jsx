import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import StoryPage from "./components/StoryPage";
import LoginForm from "./components/Login";
import SignupForm from "./components/SignUp";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/story" element={<StoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
