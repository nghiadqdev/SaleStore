import React from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Mail, Github, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLoginButtonsProps {
  onSocialLogin?: (provider: string) => void;
  providers?: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    color?: string;
    hoverColor?: string;
    textColor?: string;
  }>;
}

const SocialLoginButtons = ({
  onSocialLogin = (provider) => console.log(`Login with ${provider}`),
  providers = [
    {
      id: "google",
      name: "Google",
      icon: <Mail className="mr-2 h-4 w-4" />,
      color: "bg-white",
      hoverColor: "hover:bg-red-50",
      textColor: "text-red-500 hover:text-red-600",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="mr-2 h-4 w-4" />,
      color: "bg-white",
      hoverColor: "hover:bg-blue-50",
      textColor: "text-blue-600 hover:text-blue-700",
    },
    // {
    //   id: "github",
    //   name: "GitHub",
    //   icon: <Github className="mr-2 h-4 w-4" />,
    //   color: "bg-white",
    //   hoverColor: "hover:bg-gray-50",
    //   textColor: "text-gray-800 hover:text-black",
    // },
    // {
    //   id: "twitter",
    //   name: "Twitter",
    //   icon: <Twitter className="mr-2 h-4 w-4" />,
    //   color: "bg-white",
    //   hoverColor: "hover:bg-sky-50",
    //   textColor: "text-sky-500 hover:text-sky-600",
    // },
  ],
}: SocialLoginButtonsProps) => {
  return (
    <div className="w-full space-y-4 p-4 rounded-md bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-full text-indigo-600 font-semibold">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            type="button"
            className={cn(
              "border-2 shadow-sm transition-all duration-300 transform hover:scale-105",
              provider.color,
              provider.hoverColor,
              provider.textColor,
              "font-medium",
            )}
            onClick={() => onSocialLogin(provider.id)}
          >
            {provider.icon}
            {provider.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialLoginButtons;
