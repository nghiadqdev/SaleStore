import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data?.session) {
          // Redirect to profile completion page
          navigate("/profile-completion");
        } else {
          // If no session, redirect to login
          navigate("/");
        }
      } catch (err: any) {
        console.error("Error during auth callback:", err);
        setError(err.message || "Authentication failed");
        // Redirect to login after a delay
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-500">Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Completing Authentication
          </h2>
          <p className="text-gray-700">
            Please wait while we complete the authentication process...
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
