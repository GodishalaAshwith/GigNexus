
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

const SignupForm = () => {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "freelancer";
  
  const [userType, setUserType] = useState<"freelancer" | "business">(
    defaultType === "business" ? "business" : "freelancer"
  );

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="mb-6">
        <div className="flex rounded-md border border-gray-200 p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              userType === "freelancer"
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setUserType("freelancer")}
          >
            Developer
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              userType === "business"
                ? "bg-primary text-white"
                : "bg-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setUserType("business")}
          >
            Business
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input type="email" className="input-field" placeholder="Enter your email" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input type="password" className="input-field" placeholder="Create a password" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input type="text" className="input-field" placeholder="First name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input type="text" className="input-field" placeholder="Last name" />
            </div>
          </div>
          
          {userType === "business" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input type="text" className="input-field" placeholder="Enter company name" />
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button className="w-full">Create Account</Button>
        </div>

        <div className="relative flex items-center justify-center text-xs uppercase text-gray-500 my-6">
          <span className="px-2 bg-white z-10">Or Sign Up With</span>
          <div className="absolute w-full h-px bg-gray-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Github className="h-4 w-4" />
            Github
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-8">
          By signing up, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
