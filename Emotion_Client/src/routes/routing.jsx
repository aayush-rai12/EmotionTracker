// src/Routing.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import EmotionTracker from "../components/EmotionTracker/EmotionTracker";
import Home from "../components/Home/Landing";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/emotion" element={<EmotionTracker />} />
    </Routes>
  );
};

export default Routing;
