import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { freelancerService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Mail, 
  BriefcaseBusiness, 
  GraduationCap, 
  Award,
  Globe,
  Clock,
  CheckCircle
} from "lucide-react";
import Loading from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

const FreelancerDetail = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchFreelancerDetails = async () => {
      try {
        setLoading(true);
        if (!freelancerId) {
          console.log("No freelancerId found");
          toast.error("Freelancer ID is missing");
          navigate("/freelancers");
          return;
        }

        console.log("Attempting to fetch freelancer with ID:", freelancerId);
        const response = await freelancerService.getFreelancerById(freelancerId);
        console.log("Received response:", response);

        if (!response) {
          toast.error("Failed to load freelancer details");
          navigate("/freelancers");
          return;
        }

        setFreelancer(response);
      } catch (error: any) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        toast.error("Failed to load freelancer details");
        navigate("/freelancers");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerDetails();
  }, [freelancerId, navigate]);

  const handleHire = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to hire freelancers");
      navigate("/login");
      return;
    }

    if (user?.role !== "business") {
      toast.error("Only businesses can hire freelancers");
      return;
    }

    navigate("/create-job", { state: { freelancerId: freelancer.id } });
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
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={() => navigate("/freelancers")}
          className="mb-4"
        >
          ← Back to Freelancers
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center mb-6">
                <img
                  src={freelancer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=random`}
                  alt={freelancer.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                />
                <h2 className="text-xl font-bold text-gray-900">{freelancer.name}</h2>
                <p className="text-gray-600">{freelancer.title}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="font-semibold">{freelancer.hourlyRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{freelancer.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{freelancer.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold">{freelancer.responseTime}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {freelancer.email && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = `mailto:${freelancer.email}`}
                  >
                    <Mail className="h-4 w-4 mr-2" /> Contact
                  </Button>
                )}
                {user?.role === 'business' && (
                  <Button className="w-full" onClick={handleHire}>
                    <BriefcaseBusiness className="h-4 w-4 mr-2" /> Hire Now
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              {/* Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Overview</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{freelancer.overview}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-500">Completed Jobs</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{freelancer.completedJobs}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-500">Success Rate</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{freelancer.successRate}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-500">Total Earnings</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{freelancer.totalEarnings}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              {freelancer.experience.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    <BriefcaseBusiness className="inline-block h-6 w-6 mr-2" />
                    Experience
                  </h3>
                  <div className="space-y-6">
                    {freelancer.experience.map((exp: any, index: number) => (
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
              {freelancer.education.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    <GraduationCap className="inline-block h-6 w-6 mr-2" />
                    Education
                  </h3>
                  <div className="space-y-4">
                    {freelancer.education.map((edu: any, index: number) => (
                      <div key={index}>
                        <h4 className="text-lg font-medium text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-gray-500 text-sm">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {freelancer.certifications.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    <Award className="inline-block h-6 w-6 mr-2" />
                    Certifications
                  </h3>
                  <div className="space-y-4">
                    {freelancer.certifications.map((cert: any, index: number) => (
                      <div key={index}>
                        <h4 className="text-lg font-medium text-gray-900">{cert.name}</h4>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-gray-500 text-sm">{cert.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {freelancer.portfolio.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {freelancer.portfolio.map((item: any, index: number) => (
                      <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
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

              {/* Languages */}
              {freelancer.languages.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    <Globe className="inline-block h-6 w-6 mr-2" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.languages.map((language: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetail;
