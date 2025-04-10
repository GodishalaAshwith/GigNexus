
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MindlancerLogo } from "./MindlancerLogo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
            <Link to="/jobs" className="text-gray-700 font-medium hover:text-primary-600 transition-colors">
              Find Jobs
            </Link>
            <Link to="/freelancers" className="text-gray-700 font-medium hover:text-primary-600 transition-colors">
              Find Freelancers
            </Link>
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
                    to="/for-freelancers"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    onClick={() => setDropdownOpen(false)}
                  >
                    For Freelancers
                  </Link>
                  <Link
                    to="/for-businesses"
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
            <Link to="/login">
              <Button variant="outline" className="font-medium">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="font-medium">Sign Up</Button>
            </Link>
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
            <Link
              to="/jobs"
              className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              to="/freelancers"
              className="block text-gray-700 font-medium hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Freelancers
            </Link>
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
                    to="/for-freelancers"
                    className="block text-gray-700 hover:text-primary-600"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    For Freelancers
                  </Link>
                  <Link
                    to="/for-businesses"
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
            <div className="pt-4 flex flex-col space-y-3">
              <Link
                to="/login"
                className="block text-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="block text-center py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
