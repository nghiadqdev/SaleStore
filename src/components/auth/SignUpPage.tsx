import React from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUpSuccess = () => {
    // Navigate to home page after successful signup
    navigate("/");

    // Show success toast that auto-dismisses after 3 seconds
    toast({
      variant: "success",
      title: "Registration Successful!",
      description: "Your account has been created successfully.",
      duration: 3000, // 3 seconds
    });
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Us Today</h1>
        <p className="text-lg text-gray-600">
          Create your account to start your journey
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <SignUpForm onSuccess={handleSignUpSuccess} onLogin={handleLogin} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-center text-sm text-gray-500"
      >
        <p>
          By signing up, you agree to our{" "}
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

export default SignUpPage;
