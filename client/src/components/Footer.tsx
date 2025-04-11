
import { Link } from "react-router-dom";
import { MindlancerLogo } from "./MindlancerLogo";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MindlancerLogo className="h-10 w-auto" />
              <span className="text-xl font-bold text-gray-900">Mindlancer</span>
            </div>
            <p className="text-gray-600 max-w-xs">
              Connect top freelance developers with innovative businesses around the world.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Freelancers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/browse-jobs" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/create-profile" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/freelancer-resources" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/freelancer-success" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Businesses</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/post-job" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/find-talent" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Find Talent
                </Link>
              </li>
              <li>
                <Link to="/enterprise" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Enterprise Solutions
                </Link>
              </li>
              <li>
                <Link to="/business-resources" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Mindlancer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
