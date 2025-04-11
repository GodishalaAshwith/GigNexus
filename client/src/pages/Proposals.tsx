import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { proposalService } from "@/services/api";
import Loading from "@/components/ui/loading";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface Proposal {
  _id: string;
  id: string;
  jobId: string | {
    _id: string;
    title: string;
    description: string;
    budget: {
      type: 'fixed' | 'hourly';
      min: number;
      max: number;
    };
    businessId: {
      profile: {
        companyName: string;
      };
    };
  };
  jobTitle: string;
  companyName: string;
  coverLetter: string;
  proposedRate: number;
  bidAmount: number;
  estimatedDuration: string | {
    value: number;
    unit: 'hours' | 'days' | 'weeks' | 'months';
  };
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: string;
  createdAt: string;
  freelancerId?: {
    profile: {
      name: string;
      avatar: string;
      skills: string[];
      hourlyRate: number;
    };
  };
}

const Proposals = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const isReceived = location.pathname === "/proposals/received";

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        let data;
        if (isReceived) {
          data = await proposalService.getReceivedProposals();
        } else {
          data = await proposalService.getMyProposals();
        }
        setProposals(data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast.error("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && (user?.role === "freelancer" || (user?.role === "business" && isReceived))) {
      fetchProposals();
    } else {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, user, navigate, isReceived]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProposals = activeTab === "all" 
    ? proposals 
    : proposals.filter(proposal => proposal.status === activeTab);

  const withdrawProposal = async (id: string) => {
    try {
      await proposalService.withdrawProposal(id);
      setProposals(proposals.filter(proposal => proposal.id !== id && proposal._id !== id));
      toast.success("Proposal withdrawn successfully");
    } catch (error) {
      console.error("Error withdrawing proposal:", error);
      toast.error("Failed to withdraw proposal");
    }
  };

  const handleUpdateStatus = async (proposalId: string, status: 'accepted' | 'rejected') => {
    try {
      await proposalService.updateProposalStatus(proposalId, status);
      toast.success(`Proposal ${status}`);
      
      // Update the status in the local state
      setProposals(proposals.map(proposal => 
        (proposal.id === proposalId || proposal._id === proposalId) 
          ? { ...proposal, status } 
          : proposal
      ));
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast.error('Failed to update proposal');
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading proposals..." fullScreen />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isReceived ? "Received Proposals" : "My Proposals"}
        </h1>
        
        {!isReceived && (
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all">All Proposals</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        )}
        
        {proposals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No proposals found</h2>
            <p className="text-gray-500 mb-6">
              {isReceived 
                ? "You haven't received any proposals yet." 
                : "You haven't submitted any proposals yet."}
            </p>
            {!isReceived && (
              <Button asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProposals.map((proposal) => {
              const jobId = typeof proposal.jobId === 'object' ? proposal.jobId._id : proposal.jobId;
              const jobTitle = typeof proposal.jobId === 'object' ? proposal.jobId.title : proposal.jobTitle;
              const companyName = typeof proposal.jobId === 'object' 
                ? proposal.jobId.businessId.profile.companyName 
                : proposal.companyName;
              
              return (
                <Card key={proposal._id || proposal.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          <Link to={`/job/${jobId}`} className="text-blue-600 hover:underline">
                            {jobTitle}
                          </Link>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {companyName} • Submitted {proposal.submittedAt 
                            ? formatDate(proposal.submittedAt) 
                            : formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Proposed Rate</p>
                        <p className="font-medium">${proposal.proposedRate || proposal.bidAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Duration</p>
                        <p className="font-medium">
                          {typeof proposal.estimatedDuration === 'object' 
                            ? `${proposal.estimatedDuration.value} ${proposal.estimatedDuration.unit}` 
                            : proposal.estimatedDuration}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Cover Letter</p>
                      <p className="text-gray-700 whitespace-pre-line">{proposal.coverLetter}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    {isReceived ? (
                      <div className="flex gap-2">
                        {proposal.status === 'pending' && (
                          <>
                            <Button 
                              onClick={() => handleUpdateStatus(proposal._id || proposal.id, 'accepted')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </Button>
                            <Button 
                              onClick={() => handleUpdateStatus(proposal._id || proposal.id, 'rejected')}
                              variant="outline" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      proposal.status === "pending" && (
                        <Button 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => withdrawProposal(proposal._id || proposal.id)}
                        >
                          Withdraw Proposal
                        </Button>
                      )
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals;
