import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import ProposalForm from "@/components/proposals/ProposalForm";

const JobDetails = () => {
  const { user } = useAuth();
  const [showProposalForm, setShowProposalForm] = useState(false);

  // ... rest of your job details code ...

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Job details section */}
      
      {user?.role === "freelancer" && (
        <div className="mt-8">
          {!showProposalForm ? (
            <Button onClick={() => setShowProposalForm(true)}>
              Submit Proposal
            </Button>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Submit Your Proposal</h2>
              <ProposalForm 
                jobId={jobId} 
                onSuccess={() => setShowProposalForm(false)} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 