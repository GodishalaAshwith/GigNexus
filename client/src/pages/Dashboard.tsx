import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Please login to access the dashboard");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.profile?.name || "User"}!</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Profile Completion</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: "60%" }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Complete your profile to increase visibility
            </p>
            <Button variant="link" className="p-0 mt-2" onClick={() => navigate("/profile")}>
              Complete Profile
            </Button>
          </div>

          {user?.role === "freelancer" ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">Active Proposals</h2>
                <p className="text-3xl font-bold">0</p>
                <Button variant="link" className="p-0 mt-2" onClick={() => navigate("/proposals")}>
                  View Proposals
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">Recommended Jobs</h2>
                <p className="text-3xl font-bold">12</p>
                <Button variant="link" className="p-0 mt-2" onClick={() => navigate("/jobs")}>
                  Browse Jobs
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">Active Job Posts</h2>
                <p className="text-3xl font-bold">0</p>
                <Button variant="link" className="p-0 mt-2" onClick={() => navigate("/my-jobs")}>
                  Manage Jobs
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">Pending Proposals</h2>
                <p className="text-3xl font-bold">0</p>
                <Button variant="link" className="p-0 mt-2" onClick={() => navigate("/proposals/received")}>
                  Review Proposals
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {user?.role === "freelancer" ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Jobs for You</h2>
          <div className="space-y-4">
            <p className="text-gray-500 italic">Loading recommended jobs...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Freelancers</h2>
          <div className="space-y-4">
            <p className="text-gray-500 italic">Loading top freelancers...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
