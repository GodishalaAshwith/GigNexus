import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, MapPin, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { freelancerService } from "@/services/api";

interface FreelancerProfile {
  name: string;
  avatar?: string;
  location: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  portfolio: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
}

interface Freelancer {
  _id: string;
  email: string;
  role: string;
  profile: FreelancerProfile;
  isVerified: boolean;
  createdAt: string;
}

interface FreelancerDisplay {
  id: string;
  name: string;
  title: string;
  rating: number;
  hourlyRate: string;
  location: string;
  skills: string[];
  profileImage?: string;
  overview: string;
}

const Freelancers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [freelancers, setFreelancers] = useState<FreelancerDisplay[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<FreelancerDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Common skills list (you can expand this)
  const commonSkills = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Content Writing",
    "Digital Marketing",
    "Graphic Design",
    "Data Analysis",
    "SEO",
    "Video Editing",
    "Project Management"
  ];

  const transformFreelancer = (freelancer: Freelancer): FreelancerDisplay => {
    return {
      id: freelancer._id,
      name: freelancer.profile.name || 'Anonymous Freelancer',
      title: freelancer.profile.bio?.split('\n')[0] || 'Freelancer',
      rating: 5, // We'll implement this later
      hourlyRate: `$${freelancer.profile.hourlyRate || 0}/hr`,
      location: freelancer.profile.location || 'Remote',
      skills: freelancer.profile.skills || [],
      profileImage: freelancer.profile.avatar,
      overview: freelancer.profile.bio || 'No bio provided'
    };
  };

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await freelancerService.getAllFreelancers();
        
        const data = Array.isArray(response) ? response : [];
        const transformedFreelancers = data
          .filter(freelancer => 
            freelancer && 
            freelancer._id && 
            freelancer.profile &&
            freelancer.profile.name
          )
          .map(transformFreelancer);

        setFreelancers(transformedFreelancers);
        setFilteredFreelancers(transformedFreelancers);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
        setError("Failed to load freelancers. Please try again later.");
        toast.error("Failed to load freelancers");
        setFreelancers([]);
        setFilteredFreelancers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterFreelancersData();
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill) && skill.trim() !== "") {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const filterFreelancersData = () => {
    if (!Array.isArray(freelancers)) {
      setFilteredFreelancers([]);
      return;
    }

    const filtered = freelancers.filter((freelancer) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchLower === "" ||
        freelancer.name.toLowerCase().includes(searchLower) ||
        freelancer.title.toLowerCase().includes(searchLower) ||
        freelancer.overview.toLowerCase().includes(searchLower);

      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.every(skill =>
          freelancer.skills.some(freelancerSkill =>
            freelancerSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

      return matchesSearch && matchesSkills;
    });

    setFilteredFreelancers(filtered);
  };

  // Update filtered results whenever search terms or skills change
  useEffect(() => {
    filterFreelancersData();
  }, [searchTerm, selectedSkills]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Top Freelancers
          </h1>
          
          {/* Search and Filter Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, title, or description"
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Skills Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Filter by Skills
                </label>
                
                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 inline-flex items-center"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Skill Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                  />
                </div>

                {/* Common Skills Suggestions */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" /> Apply Filters
              </Button>
            </form>
          </div>

          {/* Results Count */}
          <div className="text-gray-600 mb-4">
            Found {filteredFreelancers.length} freelancers
          </div>

          {/* Freelancers List */}
          {loading ? (
            <Loading size="lg" text="Loading freelancers..." fullScreen />
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <h3 className="text-lg font-medium text-gray-900">Error</h3>
              <p className="text-gray-600 mt-1">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : filteredFreelancers.length > 0 ? (
            <div className="space-y-6">
              {filteredFreelancers.map((freelancer) => (
                <div key={freelancer.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center md:justify-start">
                      <img
                        src={freelancer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=random`}
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
                          <Button
                            onClick={() => navigate(`/freelancer/${freelancer.id}`)}
                            className="w-full md:w-auto"
                          >
                            View Profile
                          </Button>
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
              ))}
            </div>
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
