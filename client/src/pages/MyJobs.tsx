import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { jobService } from "@/services/api";
import { Loader2, PlusCircle, Edit, Trash2, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Job {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  status: string;
  createdAt: string;
  proposals: any[];
  budget: {
    type: string;
    min: number;
    max: number;
  };
}

const MyJobs = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and is a business
    if (!loading) {
      if (!isAuthenticated) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      if (user?.role !== "business") {
        toast.error("Access denied. This page is only for business accounts.");
        navigate("/unauthorized");
        return;
      }

      fetchJobs();
    }
  }, [loading, isAuthenticated, user, navigate]);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getMyJobs();
      setJobs(response.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setPageLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    setDeleteJobId(jobId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteJobId) return;

    try {
      await jobService.deleteJob(deleteJobId);
      setJobs(jobs.filter(job => job._id !== deleteJobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteJobId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Job Postings</h1>
          <Button onClick={() => navigate('/create-job')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {jobs.length === 0 ? (
          <Card className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">No Jobs Posted Yet</h3>
            <p className="text-gray-600 mb-4">Start hiring by posting your first job</p>
            <Button onClick={() => navigate('/create-job')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Posted:</span>{' '}
                        {formatDate(job.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span>{' '}
                        {job.budget.type === 'fixed' 
                          ? `$${job.budget.min}`
                          : `$${job.budget.min}-$${job.budget.max}/hr`}
                      </div>
                      <div>
                        <span className="font-medium">Proposals:</span>{' '}
                        {job.proposals?.length || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/jobs/${job._id}/proposals`)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Proposals
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/jobs/${job._id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(job._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting
              and all associated proposals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyJobs;
