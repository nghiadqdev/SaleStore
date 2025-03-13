import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCompletion from "./ProfileCompletion";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const ProfileCompletionPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          // For development without Supabase
          setUserEmail("user@example.com");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!data.session) {
          // Not authenticated, redirect to login
          navigate("/");
          return;
        }

        // Set the user email
        setUserEmail(data.session.user.email);
      } catch (err) {
        console.error("Error checking auth:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleProfileComplete = async (data: any) => {
    try {
      if (isSupabaseConfigured()) {
        // Get current user
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;

        if (!userData.user) {
          throw new Error("User not authenticated");
        }

        // Save profile data
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: userData.user.id,
          email: userData.user.email,
          phone_number: data.phoneNumber,
          gender: data.gender,
          address: data.address,
          date_of_birth: data.dateOfBirth,
          updated_at: new Date(),
        });

        if (profileError) throw profileError;

        // Also update Customer table if it exists
        const { error: customerError } = await supabase.from("Customer").upsert(
          {
            username: userData.user.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            address: data.address,
            dateOfBirth: data.dateOfBirth,
            update_at: new Date(),
          },
          {
            onConflict: "username",
          },
        );

        if (customerError) {
          console.warn("Could not update Customer table:", customerError);
          // Continue even if Customer update fails
        }
      }

      // Navigate to dashboard after successful profile completion
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving profile:", err);
      // Handle error (you might want to show an error message)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Almost There!</h1>
        <p className="text-lg text-gray-600">
          Please complete your profile to continue
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <ProfileCompletion
          onComplete={handleProfileComplete}
          userEmail={userEmail || undefined}
        />
      </motion.div>
    </div>
  );
};

export default ProfileCompletionPage;
