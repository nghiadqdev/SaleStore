import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import SocialLoginButtons from "./SocialLoginButtons";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

const LoginForm = ({
  onSuccess = () => console.log("Login successful"),
  onForgotPassword = () => console.log("Forgot password clicked"),
  onSignUp = () => console.log("Sign up clicked"),
}: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        console.warn("Supabase is not configured. Using mock authentication.");
        // Simulate successful login for development
        setTimeout(() => {
          // Store in localStorage if remember me is checked
          if (data.rememberMe) {
            localStorage.setItem("rememberedEmail", data.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }
          onSuccess();
        }, 1000);
        return;
      }

      // Real authentication with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Store in localStorage if remember me is checked
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        console.warn("Supabase is not configured. Using mock authentication.");
        // Simulate successful login for development
        setTimeout(() => {
          onSuccess();
        }, 1000);
        return;
      }

      // Handle social login based on provider
      if (provider === "google") {
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin + "/auth/callback",
          },
        });
      } else if (provider === "facebook") {
        await supabase.auth.signInWithOAuth({
          provider: "facebook",
          options: {
            redirectTo: window.location.origin + "/auth/callback",
          },
        });
      }
    } catch (err: any) {
      setError(err.message || `Failed to login with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full border-t-4 border-indigo-500 shadow-lg bg-gradient-to-b from-white to-slate-50">
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Welcome Back
              </CardTitle>
            </motion.div>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div
                className="space-y-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
                  {...register("email")}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    variant="link"
                    className="px-0 font-normal text-indigo-600 hover:text-indigo-800"
                    type="button"
                    onClick={onForgotPassword}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 text-gray-500 hover:text-indigo-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  className="text-indigo-600 focus:ring-indigo-500"
                  onCheckedChange={(checked) => {
                    setValue("rememberMe", checked === true);
                  }}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <SocialLoginButtons onSocialLogin={handleSocialLogin} />
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <motion.div
              className="text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              Don't have an account?{" "}
              <Button
                variant="link"
                className="px-0 text-indigo-600 hover:text-indigo-800"
                onClick={onSignUp}
              >
                Sign up
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;
