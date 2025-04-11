import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as UIToaster } from "@/components/ui/toaster";

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Jobs from '@/pages/Jobs';
import JobDetail from '@/pages/JobDetail';
import FreelancerDetail from '@/pages/FreelancerDetail';
import CreateJob from '@/pages/CreateJob';
import MyJobs from '@/pages/MyJobs';
import Profile from '@/pages/Profile';
import Freelancers from '@/pages/Freelancers';
import Proposals from '@/pages/Proposals';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import HowItWorksFreelancer from "@/pages/HowItWorksFreelancer";
import HowItWorksBusiness from "@/pages/HowItWorksBusiness";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/Layout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UIToaster />
        <Toaster position="top-center" />
        <Router>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route index element={<Home />} />
              <Route 
                path="login" 
                element={
                  <ProtectedRoute requireAuth={false} redirectPath="/dashboard">
                    <Login />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="signup" 
                element={
                  <ProtectedRoute requireAuth={false} redirectPath="/dashboard">
                    <Signup />
                  </ProtectedRoute>
                } 
              />
              <Route path="jobs" element={<Jobs />} />
              <Route path="job/:jobId" element={<JobDetail />} />
              <Route path="freelancers" element={<Freelancers />} />
              <Route path="freelancer/:freelancerId" element={<FreelancerDetail />} />
              <Route path="unauthorized" element={<Unauthorized />} />
              <Route path="how-it-works/freelancer" element={<HowItWorksFreelancer />} />
              <Route path="how-it-works/business" element={<HowItWorksBusiness />} />

              {/* Protected routes for all authenticated users */}
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Protected routes for businesses */}
              <Route 
                path="create-job" 
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <CreateJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="my-jobs" 
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <MyJobs />
                  </ProtectedRoute>
                } 
              />

              {/* Protected routes for freelancers */}
              <Route 
                path="proposals" 
                element={
                  <ProtectedRoute allowedRoles={['freelancer']}>
                    <Proposals />
                  </ProtectedRoute>
                } 
              />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
