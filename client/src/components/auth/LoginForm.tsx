import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/api";
import { toast } from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `http://localhost:5001/api/auth/${provider}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-700">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="Enter your password"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative flex items-center justify-center text-xs uppercase text-gray-500 my-6">
        <span className="px-2 bg-white z-10">Or Sign In With</span>
        <div className="absolute w-full h-px bg-gray-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          type="button" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleOAuthLogin("github")}
        >
          <Github className="h-4 w-4" />
          Github
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleOAuthLogin("linkedin")}
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
      </div>

      <p className="text-sm text-center text-gray-600 mt-8">
        Don't have an account?{" "}
        <Link to="/signup" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
