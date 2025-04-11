import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { proposalService } from "@/services/api";

interface ProposalFormProps {
  jobId: string;
  onSuccess?: () => void;
}

const ProposalForm = ({ jobId, onSuccess }: ProposalFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    bidAmount: "",
    estimatedDuration: {
      value: "",
      unit: "days"
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await proposalService.submitProposal({
        jobId,
        ...formData,
        bidAmount: Number(formData.bidAmount),
        estimatedDuration: {
          ...formData.estimatedDuration,
          value: Number(formData.estimatedDuration.value)
        }
      });

      toast.success("Proposal submitted successfully!");
      onSuccess?.();
      navigate("/proposals");
    } catch (error: any) {
      console.error("Submit proposal error:", error);
      toast.error(error.response?.data?.msg || "Failed to submit proposal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Letter
        </label>
        <textarea
          value={formData.coverLetter}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              coverLetter: e.target.value
            }))
          }
          className="input-field min-h-[150px]"
          placeholder="Explain why you're the best fit for this job..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bid Amount ($)
        </label>
        <input
          type="number"
          value={formData.bidAmount}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              bidAmount: e.target.value
            }))
          }
          className="input-field"
          placeholder="Enter your bid amount"
          min="1"
          step="0.01"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Duration
          </label>
          <input
            type="number"
            value={formData.estimatedDuration.value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estimatedDuration: {
                  ...prev.estimatedDuration,
                  value: e.target.value
                }
              }))
            }
            className="input-field"
            placeholder="Duration"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration Unit
          </label>
          <select
            value={formData.estimatedDuration.unit}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estimatedDuration: {
                  ...prev.estimatedDuration,
                  unit: e.target.value
                }
              }))
            }
            className="input-field"
            required
          >
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Proposal"}
      </Button>
    </form>
  );
};

export default ProposalForm; 