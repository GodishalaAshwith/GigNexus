
import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-16 md:py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 opacity-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Connect with top <span className="text-primary">developer talent</span> for your projects
            </h1>
            <p className="text-xl text-gray-700 max-w-lg">
              The marketplace where exceptional software developers meet innovative businesses for successful collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup?type=business">
                <Button size="lg" className="font-medium">
                  Hire a Developer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signup?type=freelancer">
                <Button size="lg" variant="outline" className="font-medium">
                  Join as a Developer
                </Button>
              </Link>
            </div>
            <div className="flex items-center pt-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
              </div>
              <span className="ml-3 text-sm text-gray-600">
                Join over 10,000+ developers & 5,000+ businesses
              </span>
            </div>
          </div>
          <div className="opacity-0 animate-fade-in animate-delay-200 lg:mt-0">
            <div className="relative bg-white p-6 rounded-xl shadow-xl">
              <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Popular
              </div>
              <h2 className="text-xl font-semibold mb-4">Find the perfect developer</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="React, Node.js, Python, etc." 
                      className="input-field pl-10" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select className="input-field">
                      <option>All Levels</option>
                      <option>Entry Level</option>
                      <option>Intermediate</option>
                      <option>Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select className="input-field">
                      <option>All Types</option>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>One-time</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full">Search Developers</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
