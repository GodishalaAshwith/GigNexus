import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { authService } from "@/services/api";
import { toast } from "react-hot-toast";

const SignupForm = () => {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "freelancer";
  const navigate = useNavigate();
  
  const [userType, setUserType] = useState<"freelancer" | "business">(
    defaultType === "business" ? "business" : "freelancer"
  );
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    companyName: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        role: userType,
        profile: {
          name: `${formData.firstName} ${formData.lastName}`,
          ...(userType === "business" && { companyName: formData.companyName })
        }
      };
      
      await authService.register(userData);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOAuthSignup = (provider: string) => {
    window.location.href = `http://localhost:5001/api/auth/${provider}`;
  };

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
            type="button"
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
            type="button"
          >
            Business
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field" 
              placeholder="Enter your email" 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field" 
              placeholder="Create a password" 
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field" 
                placeholder="First name" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field" 
                placeholder="Last name" 
                required
              />
            </div>
          </div>
          
          {userType === "business" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input 
                type="text" 
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="input-field" 
                placeholder="Enter company name" 
                required={userType === "business"}
              />
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>

        <div className="relative flex items-center justify-center text-xs uppercase text-gray-500 my-6">
          <span className="px-2 bg-white z-10">Or Sign Up With</span>
          <div className="absolute w-full h-px bg-gray-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button"
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleOAuthSignup("github")}
          >
            <Github className="h-4 w-4" />
            Github
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleOAuthSignup("linkedin")}
          >
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
      </form>
    </div>
  );
};

export default SignupForm;
