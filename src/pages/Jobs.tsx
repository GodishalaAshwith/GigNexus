
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, BriefcaseBusiness, Clock, MapPin, DollarSign } from "lucide-react";

const mockJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechNova",
    location: "Remote",
    type: "Full-time",
    rate: "$70-90/hr",
    description: "We are looking for an experienced React developer to join our team. You'll be working on a cutting-edge SaaS product with a modern tech stack.",
    skills: ["React", "TypeScript", "Redux", "Node.js"],
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "Backend Developer (Python)",
    company: "DataPulse",
    location: "Remote",
    type: "Contract",
    rate: "$65-80/hr",
    description: "Seeking a backend developer with strong Python skills to help scale our data processing pipelines. Experience with large datasets is a plus.",
    skills: ["Python", "Flask", "PostgreSQL", "AWS"],
    posted: "3 days ago"
  },
  {
    id: 3,
    title: "Full-Stack JavaScript Developer",
    company: "Web Solutions Inc",
    location: "Remote",
    type: "Part-time",
    rate: "$60-75/hr",
    description: "Looking for a full-stack developer to work on client projects. Must be proficient with modern JavaScript frameworks and databases.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    posted: "1 week ago"
  },
  {
    id: 4,
    title: "Mobile Developer (React Native)",
    company: "AppWorks",
    location: "Remote",
    type: "Full-time",
    rate: "$75-95/hr",
    description: "We need an experienced mobile developer to help us build cross-platform applications using React Native.",
    skills: ["React Native", "JavaScript", "iOS", "Android"],
    posted: "1 week ago"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    type: "Contract",
    rate: "$80-100/hr",
    description: "Seeking a DevOps engineer to help us implement CI/CD pipelines and improve our infrastructure automation.",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
    posted: "3 days ago"
  }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

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
                        {job.rate}
                      </div>
                    </div>
                  </div>
                  <Button>View Details</Button>
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

                <div className="text-sm text-gray-500">Posted {job.posted}</div>
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
