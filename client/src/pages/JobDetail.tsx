import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  Briefcase, 
  MapPin, 
  Building, 
  BookmarkPlus,
  Send,
  AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { jobService, proposalService } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Proposal form validation schema
const proposalSchema = z.object({
  coverLetter: z.string().min(20, "Cover letter must be at least 20 characters"),
  proposedRate: z.string().min(1, "Proposed rate is required"),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
});

interface Job {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    location: string;
    website?: string;
  };
  budget?: string;
  budgetMin?: string;
  budgetMax?: string;
  hourlyRate?: string;
  duration: string;
  jobType: string;
  location: string;
  skills: string[];
  experience?: string;
  experienceLevel?: string;
  postedAt: string;
  createdAt?: string;
  deadline: string;
  isUrgent: boolean;
  status: string;
  applicantsCount?: number;
  applicants?: number;
}

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof proposalSchema>>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      coverLetter: "",
      proposedRate: "",
      estimatedDuration: "",
    },
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        if (!jobId) {
          toast.error("Job ID is missing");
          navigate("/jobs");
          return;
        }
        
        const jobData = await jobService.getJobById(jobId);
        setJob(jobData);
        
        // Check if user has already applied to this job
        if (isAuthenticated && user?.role === "freelancer") {
          try {
            const myProposals = await proposalService.getMyProposals();
            const hasAlreadyApplied = myProposals.some((proposal: any) => proposal.jobId === jobId);
            setHasApplied(hasAlreadyApplied);
          } catch (error) {
            console.error("Error checking proposal status:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, navigate, isAuthenticated, user]);

  const onSubmitProposal = async (values: z.infer<typeof proposalSchema>) => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for this job");
      navigate("/login");
      return;
    }
    
    if (user?.role !== "freelancer") {
      toast.error("Only freelancers can apply for jobs");
      return;
    }
    
    if (!job) {
      toast.error("Job information is missing");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const proposalData = {
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company.name,
        proposedRate: parseFloat(values.proposedRate),
        coverLetter: values.coverLetter,
        estimatedDuration: values.estimatedDuration,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      
      await proposalService.submitProposal(proposalData);
      
      toast.success("Proposal submitted successfully!");
      setIsApplyDialogOpen(false);
      setHasApplied(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const saveJob = () => {
    // In a real app, you would call an API to save the job
    toast.success("Job saved to your favorites");
  };

  const getBudgetDisplay = (job: Job) => {
    if (job.budget) return job.budget;
    if (job.budgetMin && job.budgetMax) return `$${job.budgetMin}-$${job.budgetMax}`;
    return "Not specified";
  };

  const getPostedDate = (job: Job) => {
    return job.postedAt ? formatDate(job.postedAt) : 
           job.createdAt ? formatDate(job.createdAt) : 
           "Unknown date";
  };

  if (loading) {
    return <Loading size="lg" text="Loading job details..." fullScreen />;
  }

  if (!job) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{job.title}</h1>
                {job.isUrgent && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Urgent
                  </span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <Building className="h-4 w-4 mr-1" />
                <span>{job.company.name}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={saveJob}
              >
                <BookmarkPlus className="h-4 w-4" />
                Save
              </Button>
              {isAuthenticated && user?.role === "freelancer" && (
                hasApplied ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled
                    className="flex items-center gap-1"
                  >
                    <Send className="h-4 w-4" />
                    Already Applied
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => setIsApplyDialogOpen(true)}
                  >
                    <Send className="h-4 w-4" />
                    Apply Now
                  </Button>
                )
              )}
              {user?.role === 'business' && (
                <Button
                  onClick={() => navigate(`/jobs/${jobId}/interview-questions`)}
                  className="ml-4"
                >
                  Generate Interview Questions
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">{getBudgetDisplay(job)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{job.duration}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-medium">{job.jobType}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Experience Level</p>
              <p className="font-medium">{job.experienceLevel || job.experience || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Posted On</p>
              <p className="font-medium">{getPostedDate(job)}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Apply before {formatDate(job.deadline)}</span>
          </div>
        </div>
        
        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="prose max-w-none">
            <p className="mb-4">{job.description}</p>
            {job.longDescription && (
              <div dangerouslySetInnerHTML={{ __html: job.longDescription.replace(/\n/g, '<br />') }} />
            )}
          </div>
        </div>
        
        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">About the Client</h2>
          <div className="flex items-start gap-4">
            {job.company.logo && (
              <img 
                src={job.company.logo} 
                alt={job.company.name} 
                className="w-16 h-16 rounded-md object-cover"
              />
            )}
            <div>
              <h3 className="font-medium text-lg">{job.company.name}</h3>
              <p className="text-gray-600 mb-2">{job.company.location}</p>
              {job.company.website && (
                <a 
                  href={job.company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Apply Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Submit your proposal to apply for this job. Make sure to highlight your relevant skills and experience.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitProposal)} className="space-y-4">
              <FormField
                control={form.control}
                name="proposedRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 35" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Propose a competitive rate based on your skills and experience.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 2 weeks" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      How long do you think it will take you to complete this project?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Introduce yourself and explain why you're a good fit for this job..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Highlight your relevant skills and experience. Be specific about how you can help.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsApplyDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Proposal"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetail;
