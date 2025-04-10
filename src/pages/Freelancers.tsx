
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, MapPin } from "lucide-react";

const mockFreelancers = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Senior Full-Stack Developer",
    rating: 4.9,
    hourlyRate: "$85/hr",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&fit=crop",
    overview: "Full-stack developer with 8+ years of experience building scalable web applications. Specialized in React ecosystem and cloud architecture."
  },
  {
    id: 2,
    name: "Sarah Williams",
    title: "Frontend Engineer & UI Specialist",
    rating: 4.8,
    hourlyRate: "$75/hr",
    location: "London, UK",
    skills: ["React", "Vue.js", "CSS/SCSS", "UI Design", "Figma"],
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop",
    overview: "Frontend developer focused on creating pixel-perfect, responsive UIs with modern frameworks. Strong background in design systems and animations."
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "Backend Developer & DevOps Engineer",
    rating: 4.7,
    hourlyRate: "$80/hr",
    location: "Toronto, Canada",
    skills: ["Python", "Django", "Docker", "Kubernetes", "PostgreSQL"],
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop",
    overview: "Expert in building robust backend services and implementing DevOps practices. Strong focus on performance optimization and security."
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    title: "Mobile Application Developer",
    rating: 4.9,
    hourlyRate: "$90/hr",
    location: "Barcelona, Spain",
    skills: ["React Native", "iOS", "Android", "Firebase", "GraphQL"],
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop",
    overview: "Experienced mobile developer who has published over 15 apps to the App Store and Google Play. Expertise in cross-platform development and native integrations."
  },
  {
    id: 5,
    name: "David Kim",
    title: "Data Engineer & ML Specialist",
    rating: 4.8,
    hourlyRate: "$95/hr",
    location: "Seoul, South Korea",
    skills: ["Python", "TensorFlow", "Spark", "SQL", "AWS"],
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop",
    overview: "Data engineer with a focus on building ML pipelines and implementing data-driven solutions. Experience with large-scale data processing and analytics."
  }
];

const Freelancers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [filteredFreelancers, setFilteredFreelancers] = useState(mockFreelancers);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterFreelancers();
  };

  const filterFreelancers = () => {
    const filtered = mockFreelancers.filter((freelancer) => {
      const matchesSearch =
        freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSkill =
        skillFilter === "" ||
        freelancer.skills.some((skill) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        );

      return matchesSearch && matchesSkill;
    });

    setFilteredFreelancers(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Expert Developers</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or title"
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Filter by skill"
                className="input-field"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
            <Button type="submit" className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" /> Filter Results
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          {filteredFreelancers.length > 0 ? (
            filteredFreelancers.map((freelancer) => (
              <div key={freelancer.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center md:justify-start">
                    <img
                      src={freelancer.profileImage}
                      alt={freelancer.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{freelancer.name}</h2>
                        <h3 className="text-lg text-gray-700">{freelancer.title}</h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-gray-700">
                            {freelancer.rating} • {freelancer.hourlyRate}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {freelancer.location}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button>View Profile</Button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{freelancer.overview}</p>

                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary-50 text-primary-700 px-3 py-1 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No freelancers found
              </h3>
              <p className="text-gray-600 mt-1">
                Try adjusting your search criteria or browse all available freelancers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Freelancers;
