import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, BriefcaseBusiness, Clock, MapPin, DollarSign, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/hooks/useAuth";
import { jobService } from "@/services/api";
import { toast } from "react-hot-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  rate: string | { min: string; max: string; type: string };
  budget: string | { min: string; max: string; type: string };
  description: string;
  skills: string[] | { [key: string]: string };
  posted: string;
  deadline: string;
  isUrgent: boolean;
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const filters = {
          ...(searchTerm && { search: searchTerm }),
          ...(jobType !== "all" && { type: jobType })
        };
        const data = await jobService.getAllJobs(filters);
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, jobType]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return <Loading size="lg" text="Loading jobs..." fullScreen />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Find Jobs</h1>
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loading size="lg" text="Loading jobs..." fullScreen />
      ) : jobs.length === 0 ? (
        <div key="no-jobs" className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 key={`title-${job.id}`} className="text-xl font-semibold hover:text-primary-600 transition-colors cursor-pointer">
                      <Link to={`/job/${job.id}`}>
                        {job.title}
                      </Link>
                    </h3>
                    <p key={`company-${job.id}`} className="text-gray-600 mt-1">{job.company}</p>
                  </div>
                  {job.isUrgent && (
                    <div key={`urgent-${job.id}`} className="bg-red-100 text-red-800 px-3 py-1 rounded-md inline-block">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Urgent</span>
                    </div>
                  )}
                </div>

                <div key={`info-grid-${job.id}`} className="grid grid-cols-2 gap-4 mb-4">
                  <div key={`type-${job.id}`} className="flex items-center gap-2">
                    <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                    <span>{job.type}</span>
                  </div>
                  <div key={`location-${job.id}`} className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div key={`rate-${job.id}`} className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>{typeof job.rate === 'object' ? `${job.rate.min}-${job.rate.max} ${job.rate.type}` : job.rate}</span>
                  </div>
                  <div key={`budget-${job.id}`} className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{typeof job.budget === 'object' ? `${job.budget.min}-${job.budget.max} ${job.budget.type}` : job.budget}</span>
                  </div>
                </div>

                <p key={`description-${job.id}`} className="text-gray-600 line-clamp-2 mb-4">{job.description}</p>

                <div key={`skills-${job.id}`} className="flex flex-wrap gap-2">
                  {Array.isArray(job.skills) ? job.skills.map((skill) => (
                    <div key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full">
                      {skill}
                    </div>
                  )) : typeof job.skills === 'object' ? Object.entries(job.skills).map(([key, value]) => (
                    <div key={key} className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full">
                      {key}: {value}
                    </div>
                  )) : null}
                </div>

                <div key={`dates-${job.id}`} className="mt-4">
                  <p className="text-sm text-gray-500">
                    Posted: {formatDateTime(job.posted)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Deadline: {formatDateTime(job.deadline)}
                  </p>
                </div>

                <div key={`view-details-${job.id}`} className="mt-4">
                  <Link 
                    to={`/job/${job.id}`} 
                    className="w-full md:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
