import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { freelancerService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Mail, Calendar, BriefcaseBusiness } from "lucide-react";
import Loading from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  rating: number;
  hourlyRate: string;
  location: string;
  skills: string[];
  profileImage?: string;
  overview: string;
  email?: string;
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  portfolio: {
    title: string;
    description: string;
    link: string;
  }[];
}

const FreelancerDetail = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchFreelancerDetails = async () => {
      try {
        setLoading(true);
        if (!freelancerId) {
          toast.error("Freelancer ID is missing");
          navigate("/freelancers");
          return;
        }

        const data = await freelancerService.getFreelancerById(freelancerId);
        setFreelancer(data);
      } catch (error) {
        console.error("Error fetching freelancer details:", error);
        toast.error("Failed to load freelancer details");
        navigate("/freelancers");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerDetails();
  }, [freelancerId, navigate]);

  const handleHire = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to hire freelancers");
      navigate("/login");
      return;
    }

    if (user?.role !== "business") {
      toast.error("Only businesses can hire freelancers");
      return;
    }

    try {
      // Here you would typically open a modal or navigate to a page to select the job
      // For now, we'll just show a success message
      toast.success("Please create a job posting to hire this freelancer");
      navigate("/jobs/create");
    } catch (error) {
      console.error("Error hiring freelancer:", error);
      toast.error("Failed to initiate hiring process");
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading freelancer details..." fullScreen />;
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              Freelancer not found
            </h3>
            <p className="text-gray-600 mt-1">
              The freelancer you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/freelancers")} className="mt-4">
              Back to Freelancers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-400">
            <div className="absolute -bottom-16 left-8">
              <img
                src={freelancer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=random`}
                alt={freelancer.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{freelancer.name}</h1>
                <h2 className="text-xl text-gray-700 mt-1">{freelancer.title}</h2>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-700 text-lg">
                    {freelancer.rating} • {freelancer.hourlyRate}
                  </span>
                </div>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="h-5 w-5 mr-1" />
                  {freelancer.location}
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex gap-4">
                {freelancer.email && (
                  <Button variant="outline" onClick={() => window.location.href = `mailto:${freelancer.email}`}>
                    <Mail className="h-4 w-4 mr-2" /> Contact
                  </Button>
                )}
                <Button onClick={handleHire}>
                  <BriefcaseBusiness className="h-4 w-4 mr-2" /> Hire Now
                </Button>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Overview</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{freelancer.overview}</p>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            {freelancer.experience && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience</h3>
                <div className="space-y-6">
                  {freelancer.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary-200 pl-4">
                      <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-gray-500 text-sm">{exp.duration}</p>
                      <p className="text-gray-600 mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {freelancer.education && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
                <div className="space-y-4">
                  {freelancer.education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="text-lg font-medium text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-gray-500 text-sm">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {freelancer.portfolio && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freelancer.portfolio.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetail;
