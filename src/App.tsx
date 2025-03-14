import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
// Lazy load components for better performance
const AuthCallback = lazy(() => import("./components/auth/AuthCallback"));
const ProfileCompletionPage = lazy(
  () => import("./components/auth/ProfileCompletionPage"),
);
const Dashboard = lazy(() => import("./dashboard/Dashboard"));

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/profile-completion"
            element={<ProfileCompletionPage />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
          {/* {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )} */}
        </Routes>
        {/* {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)} */}
      </>
    </Suspense>
  );
}

export default App;
