import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";
import { PlusCircle, Edit, Trash, Users, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { jobService } from "@/services/api";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  budgetMin: string;
  budgetMax: string;
  duration: string;
  skills: string[];
  applicants: number;
  status: string;
  createdAt: string;
  isUrgent: boolean;
  location: string;
  experienceLevel: string;
  jobType: string;
  deadline: string;
}

const MyJobs = () => {
  const [jobPostings, setJobPostings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        const data = await jobService.getBusinessJobs();
        setJobPostings(data);
      } catch (error) {
        console.error("Error fetching job postings:", error);
        toast.error("Failed to load job postings");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "business") {
      fetchJobPostings();
    } else {
      // Redirect non-business users
      navigate("/unauthorized");
    }
  }, [isAuthenticated, user, navigate]);

  const handleCreateJob = () => {
    navigate("/create-job");
  };

  const handleViewApplicants = (jobId: string) => {
    navigate(`/job/${jobId}/applicants`);
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await jobService.deleteJob(jobId);
      toast.success("Job posting deleted successfully");
      setJobPostings(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job posting");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getBudgetDisplay = (job: Job) => {
    if (job.budget) return job.budget;
    if (job.budgetMin && job.budgetMax) return `$${job.budgetMin}-$${job.budgetMax}`;
    return "Not specified";
  };

  if (loading) {
    return <Loading size="lg" text="Loading your job postings..." fullScreen />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Job Postings</h1>
        <Button 
          onClick={handleCreateJob} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Job
        </Button>
      </div>

      {jobPostings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">You haven't posted any jobs yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first job posting to start finding talented freelancers.
          </p>
          <Button onClick={handleCreateJob} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Post Your First Job
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobPostings.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  {job.isUrgent && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Urgent
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleEditJob(job.id)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{job.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">{getBudgetDisplay(job)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{job.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posted On</p>
                  <p className="font-medium">{formatDate(job.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{job.status}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string, index: number) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-primary-600">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{job.applicants} Applicants</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => window.open(`/job/${job.id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Post
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleViewApplicants(job.id)}
                  >
                    <Users className="h-4 w-4" />
                    View Applicants
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
