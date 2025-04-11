import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
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
  const [skillFilter, setSkillFilter] = useState("");
  const [freelancers, setFreelancers] = useState<FreelancerDisplay[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<FreelancerDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

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
        
        // Ensure response is an array
        const data = Array.isArray(response) ? response : [];
        
        // Transform and validate the data
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

  const filterFreelancersData = () => {
    if (!Array.isArray(freelancers)) {
      setFilteredFreelancers([]);
      return;
    }

    const filtered = freelancers.filter((freelancer) => {
      const matchesSearch =
        searchTerm === "" ||
        freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.overview.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSkill =
        skillFilter === "" ||
        (Array.isArray(freelancer.skills) &&
          freelancer.skills.some((skill) =>
            skill.toLowerCase().includes(skillFilter.toLowerCase())
          ));

      return matchesSearch && matchesSkill;
    });

    setFilteredFreelancers(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Top Freelancers
          </h1>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, title, or description"
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Filter by skill"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
            <Button type="submit" className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" /> Filter Results
            </Button>
          </form>
        </div>

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
                        <Link 
                          to={`/freelancer/${freelancer.id}`}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{freelancer.overview}</p>

                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills && freelancer.skills.map((skill, index) => (
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
  );
};

export default Freelancers;
