import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { proposalService } from "@/services/api";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface Proposal {
  _id: string;
  jobId: {
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
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: {
    value: number;
    unit: 'hours' | 'days' | 'weeks' | 'months';
  };
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
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
  const { user } = useAuth();
  const location = useLocation();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const isReceived = location.pathname === "/proposals/received";

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      // TODO: Implement API endpoint to fetch proposals based on user role
      const response = await fetch(`/api/proposals${isReceived ? '/received' : '/sent'}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      const data = await response.json();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (proposalId: string, status: 'accepted' | 'rejected') => {
    try {
      await proposalService.updateProposalStatus(proposalId, status);
      toast.success(`Proposal ${status}`);
      fetchProposals();
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast.error('Failed to update proposal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isReceived ? "Received Proposals" : "My Proposals"}
        </h1>

        {proposals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg">
              {isReceived
                ? "You haven't received any proposals yet."
                : "You haven't submitted any proposals yet."}
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate(isReceived ? "/my-jobs" : "/jobs")}
            >
              {isReceived ? "Post a Job" : "Browse Jobs"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <div
                key={proposal._id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-2">
                      {proposal.jobId.title}
                    </h2>
                    {isReceived && proposal.freelancerId && (
                      <div className="flex items-center mb-3">
                        <img
                          src={proposal.freelancerId.profile.avatar || "/default-avatar.png"}
                          alt={proposal.freelancerId.profile.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <p className="font-medium">
                            {proposal.freelancerId.profile.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${proposal.freelancerId.profile.hourlyRate}/hr
                          </p>
                        </div>
                      </div>
                    )}
                    {!isReceived && (
                      <p className="text-gray-600 mb-3">
                        {proposal.jobId.businessId.profile.companyName}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Bid Amount</p>
                        <p className="font-medium">
                          ${proposal.bidAmount.toLocaleString()}
                          {proposal.jobId.budget.type === "hourly" && "/hr"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Duration</p>
                        <p className="font-medium">
                          {proposal.estimatedDuration.value}{" "}
                          {proposal.estimatedDuration.unit}
                        </p>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600">{proposal.coverLetter}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          proposal.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : proposal.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : proposal.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {proposal.status.charAt(0).toUpperCase() +
                          proposal.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Submitted{" "}
                      {formatDistanceToNow(new Date(proposal.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    {isReceived && proposal.status === "pending" && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(proposal._id, "accepted")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(proposal._id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals;