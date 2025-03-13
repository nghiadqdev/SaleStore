import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./auth/LoginForm";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Navigate to profile completion page after successful login
    navigate("/profile-completion");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-lg text-gray-600">
          Sign in to your account to continue your journey
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <LoginForm
          onSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSignUp}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-center text-sm text-gray-500"
      >
        <p>
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;
