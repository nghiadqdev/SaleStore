import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { Toaster } from "@/components/ui/toaster";

// Lazy load components for better performance
const AuthCallback = lazy(() => import("./components/auth/AuthCallback"));
const ProfileCompletionPage = lazy(
  () => import("./components/auth/ProfileCompletionPage"),
);
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const SignUpPage = lazy(() => import("./components/auth/SignUpPage"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <>
        {/* Tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/profile-completion"
            element={<ProfileCompletionPage />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Add this before the catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
