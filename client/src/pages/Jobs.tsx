import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, BriefcaseBusiness, Clock, MapPin, DollarSign, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/hooks/useAuth";

const mockJobs = [
  {
    id: "1",
    title: "Full Stack Developer",
    company: "TechSolutions Inc.",
    location: "Remote",
    type: "Contract",
    rate: "$30-$45/hr",
    budget: "$2000-$3000",
    description: "We are looking for an experienced Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using React.js and Node.js.",
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript"],
    posted: "2025-03-15T10:30:00Z",
    deadline: "2025-04-30T23:59:59Z",
    isUrgent: true
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Remote",
    type: "Fixed Price",
    rate: "$25-$40/hr",
    budget: "$1500-$2500",
    description: "Looking for a UI/UX designer to redesign our mobile app interface.",
    skills: ["Figma", "Adobe XD", "UI Design", "Wireframing", "Prototyping"],
    posted: "2025-03-20T14:45:00Z",
    deadline: "2025-04-15T23:59:59Z",
    isUrgent: false
  },
  {
    id: "3",
    title: "Full-Stack JavaScript Developer",
    company: "Web Solutions Inc",
    location: "Remote",
    type: "Part-time",
    rate: "$60-75/hr",
    budget: "$4000-$6000",
    description: "Looking for a full-stack developer to work on client projects. Must be proficient with modern JavaScript frameworks and databases.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    posted: "2025-03-05T09:15:00Z",
    deadline: "2025-04-20T23:59:59Z",
    isUrgent: false
  },
  {
    id: "4",
    title: "Mobile Developer (React Native)",
    company: "AppWorks",
    location: "Remote",
    type: "Full-time",
    rate: "$75-95/hr",
    budget: "$8000-$10000",
    description: "We need an experienced mobile developer to help us build cross-platform applications using React Native.",
    skills: ["React Native", "JavaScript", "iOS", "Android"],
    posted: "2025-03-10T11:30:00Z",
    deadline: "2025-04-25T23:59:59Z",
    isUrgent: true
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    type: "Contract",
    rate: "$80-100/hr",
    budget: "$5000-$7000",
    description: "Seeking a DevOps engineer to help us implement CI/CD pipelines and improve our infrastructure automation.",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
    posted: "2025-03-18T16:45:00Z",
    deadline: "2025-04-18T23:59:59Z",
    isUrgent: false
  }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you would fetch jobs from an API
    const fetchJobs = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setFilteredJobs(mockJobs);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterJobs();
  };

  const filterJobs = () => {
    const filtered = mockJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = jobType === "all" || job.type.toLowerCase().includes(jobType.toLowerCase());

      return matchesSearch && matchesType;
    });

    setFilteredJobs(filtered);
  };

  const formatDate = (dateString: string) => {
    const posted = new Date(dateString);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return posted.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading jobs..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Developer Jobs</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies"
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="input-field"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="all">All Job Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="fixed price">Fixed Price</option>
              </select>
            </div>
            <Button type="submit" className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" /> Filter Results
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                {job.isUrgent && (
                  <div className="mb-4 flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-md inline-block">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Urgent</span>
                  </div>
                )}
                
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <BriefcaseBusiness className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.budget}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    View Details
                  </Button>
                </div>

                <p className="text-gray-600 my-4">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-3 py-1 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Posted {formatDate(job.posted)}</div>
                  <Link 
                    to={`/job/${job.id}`}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                  >
                    See details & apply
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="text-gray-600 mt-1">
                Try adjusting your search criteria or browse all available jobs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
