import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import SignInForm from "./components/SignInForm";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const [showLandingPage, setShowLandingPage] = useState(false);

  useEffect(() => {
    setShowLandingPage(location.pathname === "/");
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      {showLandingPage && <Landing />}
    </>
  );
};

export default App;
