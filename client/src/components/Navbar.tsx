import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MindlancerLogo } from "./MindlancerLogo";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MindlancerLogo className="h-10 w-auto" />
              <span className="text-xl font-bold text-primary-800">Mindlancer</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {/* Show Jobs link only for freelancers or unauthenticated users */}
            {(!isAuthenticated || user?.role === "freelancer") && (
              <Link to="/jobs" className="text-gray-700 font-medium hover:text-primary-600 transition-colors">
                Find Jobs
              </Link>
            )}
            
            {/* Show My Job Postings link only for business users */}
            {isAuthenticated && user?.role === "business" && (
              <>
                <Link to="/my-jobs" className="text-gray-700 font-medium hover:text-primary-600 transition-colors">
                  My Job Postings
                </Link>
                <Link to="/create-job" className="text-gray-700 font-medium hover:text-primary-600 transition-colors">
                  <span className="flex items-center">
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Post a Job
                  </span>
                </Link>
              </>
            )}
            
            {/* Show Freelancers link only for businesses or unauthenticated users */}
            {(!isAuthenticated || user?.role === "business") && (
              <Link to="/freelancers" className="text-gray-700 font-medium hover:text-primary-600 transition-colors">
                Find Freelancers
              </Link>
            )}
            
            {/* Show Proposals link only for freelancers */}
            {isAuthenticated && user?.role === "freelancer" && (
              <Link to="/proposals" className="text-gray-700 font-medium hover:text-primary-600 transition-colors">
                My Proposals
              </Link>
            )}
            
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 font-medium hover:text-primary-600 transition-colors"
              >
                How It Works <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-100">
                  <Link
                    to="/how-it-works/freelancer"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    onClick={() => setDropdownOpen(false)}
                  >
                    For Freelancers
                  </Link>
                  <Link
                    to="/how-it-works/business"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    onClick={() => setDropdownOpen(false)}
                  >
                    For Businesses
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.profile?.avatar} />
                      <AvatarFallback>
                        {user?.profile?.name ? getInitials(user.profile.name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    {user?.profile?.name || user?.email}
                    <p className="text-xs text-muted-foreground">
                      {user?.role === "freelancer" ? "Freelancer" : "Business"}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  {user?.role === "freelancer" ? (
                    <DropdownMenuItem onClick={() => navigate("/proposals")}>My Proposals</DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/my-jobs")}>My Job Posts</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/create-job")}>Post a Job</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="font-medium">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="font-medium">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container-custom space-y-4">
            {/* Show Jobs link only for freelancers or unauthenticated users */}
            {(!isAuthenticated || user?.role === "freelancer") && (
              <Link
                to="/jobs"
                className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Jobs
              </Link>
            )}
            
            {/* Show My Job Postings link only for business users */}
            {isAuthenticated && user?.role === "business" && (
              <>
                <Link
                  to="/my-jobs"
                  className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Job Postings
                </Link>
                <Link
                  to="/create-job"
                  className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Post a Job
                  </span>
                </Link>
              </>
            )}
            
            {/* Show Freelancers link only for businesses or unauthenticated users */}
            {(!isAuthenticated || user?.role === "business") && (
              <Link
                to="/freelancers"
                className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Freelancers
              </Link>
            )}
            
            {/* Show Proposals link only for freelancers */}
            {isAuthenticated && user?.role === "freelancer" && (
              <Link
                to="/proposals"
                className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Proposals
              </Link>
            )}
            
            <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 font-medium hover:text-primary-600 transition-colors"
              >
                How It Works <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {dropdownOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <Link
                    to="/how-it-works/freelancer"
                    className="block text-gray-700 hover:text-primary-600"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    For Freelancers
                  </Link>
                  <Link
                    to="/how-it-works/business"
                    className="block text-gray-700 hover:text-primary-600"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    For Businesses
                  </Link>
                </div>
              )}
            </div>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-red-600 font-medium hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-4 pt-2">
                <Link
                  to="/login"
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full font-medium">
                    Log In
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full font-medium">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
