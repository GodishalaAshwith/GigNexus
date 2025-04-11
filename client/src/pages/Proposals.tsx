import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { proposalService } from "@/services/api";
import { Loader2, ExternalLink } from "lucide-react";

interface Proposal {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    description: string;
    budget: {
      type: string;
      min: number;
      max: number;
    };
    status: string;
  };
  coverLetter: string;
  bidAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  estimatedDuration: {
    value: number;
    unit: string;
  };
}

const Proposals = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is a freelancer
    if (!loading) {
      if (!isAuthenticated) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      if (user?.role !== "freelancer") {
        toast.error("Access denied. This page is only for freelancer accounts.");
        navigate("/unauthorized");
        return;
      }

      fetchProposals();
    }
  }, [loading, isAuthenticated, user, navigate]);

  const fetchProposals = async () => {
    try {
      const response = await proposalService.getMyProposals();
      setProposals(response.proposals || []);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to load proposals");
    } finally {
      setPageLoading(false);
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
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold">My Proposals</h1>
          <Button onClick={() => navigate('/jobs')}>
            Browse More Jobs
          </Button>
        </div>

        {proposals.length === 0 ? (
          <Card className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">No Proposals Yet</h3>
            <p className="text-gray-600 mb-4">Start applying to jobs to see your proposals here</p>
            <Button onClick={() => navigate('/jobs')}>
              Browse Jobs
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {proposal.jobId.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 mb-2">
                          {proposal.jobId.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Your Bid:</span>{' '}
                        ${proposal.bidAmount}
                      </div>
                      <div>
                        <span className="font-medium">Job Budget:</span>{' '}
                        {proposal.jobId.budget.type === 'fixed' 
                          ? `$${proposal.jobId.budget.min}`
                          : `$${proposal.jobId.budget.min}-$${proposal.jobId.budget.max}/hr`}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>{' '}
                        {formatDate(proposal.createdAt)}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <h4 className="font-medium mb-2">Your Cover Letter:</h4>
                      <p className="text-gray-700">{proposal.coverLetter}</p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/job/${proposal.jobId._id}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Job
                      </Button>
                      {proposal.status === 'pending' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            // Add withdraw functionality
                            toast.error("Withdraw functionality coming soon");
                          }}
                        >
                          Withdraw Proposal
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals;
