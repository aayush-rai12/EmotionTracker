// src/Routing.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import EmotionTracker from "../components/EmotionTracker/EmotionTracker";
import Home from "../components/Home/Landing";
import UserRegister from "../components/UserRegister/UserRegister";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/emotion" element={<EmotionTracker />} />
      <Route path="/register" element={<UserRegister />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default Routing;
