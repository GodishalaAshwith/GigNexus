import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { proposalService } from "@/services/api";
import Loading from "@/components/ui/loading";

interface Proposal {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  proposedRate: number;
  coverLetter: string;
  estimatedDuration: string;
  status: string;
  submittedAt: string;
}

const Proposals = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const data = await proposalService.getMyProposals();
        setProposals(data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast.error("Failed to load your proposals");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "freelancer") {
      fetchProposals();
    } else {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, user, navigate]);

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
      setProposals(proposals.filter(proposal => proposal.id !== id));
      toast.success("Proposal withdrawn successfully");
    } catch (error) {
      console.error("Error withdrawing proposal:", error);
      toast.error("Failed to withdraw proposal");
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading your proposals..." fullScreen />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Proposals</h1>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Proposals</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredProposals.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === "all" 
                    ? "You haven't submitted any proposals yet." 
                    : `You don't have any ${activeTab} proposals.`}
                </p>
                <Button onClick={() => navigate("/jobs")}>
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProposals.map((proposal) => (
                  <Card key={proposal.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            <span 
                              className="cursor-pointer hover:text-primary-600 transition-colors"
                              onClick={() => navigate(`/job/${proposal.jobId}`)}
                            >
                              {proposal.jobTitle}
                            </span>
                          </CardTitle>
                          <CardDescription>{proposal.companyName}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Proposed Rate</p>
                          <p className="font-medium">${proposal.proposedRate}/hr</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Estimated Duration</p>
                          <p className="font-medium">{proposal.estimatedDuration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Submitted On</p>
                          <p className="font-medium">{formatDate(proposal.submittedAt)}</p>
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Cover Letter</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{proposal.coverLetter}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/job/${proposal.jobId}`)}
                      >
                        View Job
                      </Button>
                      
                      {proposal.status === "pending" && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => withdrawProposal(proposal.id)}
                        >
                          Withdraw
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Proposals;
