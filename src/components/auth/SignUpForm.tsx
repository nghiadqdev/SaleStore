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
import SocialLoginButtons from "./SocialLoginButtons";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { motion } from "framer-motion";

const signUpSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

const SignUpForm = ({
  onSuccess = () => console.log("Sign up successful"),
  onLogin = () => console.log("Login clicked"),
}: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        console.warn("Supabase is not configured. Using mock authentication.");
        // Simulate successful signup for development
        setTimeout(() => {
          onSuccess();
        }, 1000);
        return;
      }

      // First check if email already exists
      const { data: emailCheck, error: emailCheckError } = await supabase
        .from("Customer")
        .select("id")
        .eq("username", data.email)
        .maybeSingle();

      if (emailCheckError) {
        console.error("Email check error:", emailCheckError);
        // Continue anyway since this might be a first-time setup issue
      }

      // If email exists, return error
      if (emailCheck) {
        throw new Error(
          "Email already in use. Please use a different email or sign in.",
        );
      }

      // Real authentication with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin + "/auth/callback",
        },
      });

      if (error) throw error;

      // Create customer record in database
      if (authData?.user) {
        try {
          const { error: customerError } = await supabase
            .from("Customer")
            .insert({
              username: data.email,
              password: "hashed_in_supabase", // Password is already securely stored in auth.users
              phoneNumber: "",
              points: 0,
            });

          if (customerError) {
            console.error("Customer insert error:", customerError);
            // Continue anyway, as auth was successful
          }
        } catch (insertError) {
          console.error("Error inserting customer:", insertError);
          // Continue anyway, as auth was successful
        }
      }

      // Successful signup
      onSuccess();
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        console.warn("Supabase is not configured. Using mock authentication.");
        // Simulate successful signup for development
        setTimeout(() => {
          onSuccess();
        }, 1000);
        return;
      }

      // Handle social signup based on provider
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
      setError(err.message || `Failed to sign up with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

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
                Create an Account
              </CardTitle>
            </motion.div>
            <CardDescription className="text-center">
              Enter your details to create your account
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
                <Label htmlFor="password">Password</Label>
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
                className="space-y-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
                    {...register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 text-gray-500 hover:text-indigo-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <input
                  type="checkbox"
                  id="acceptTerms"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  {...register("acceptTerms")}
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <a
                    href="/terms"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </Label>
              </motion.div>
              {errors.acceptTerms && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500"
                >
                  {errors.acceptTerms.message}
                </motion.p>
              )}

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
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <SocialLoginButtons onSocialLogin={handleSocialSignUp} />
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <motion.div
              className="text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              Already have an account?{" "}
              <Button
                variant="link"
                className="px-0 text-indigo-600 hover:text-indigo-800"
                onClick={onLogin}
              >
                Sign in
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpForm;
