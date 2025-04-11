import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] px-4">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        You don't have permission to access this page.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)}>Go Back</Button>
        <Button onClick={() => navigate("/")} variant="outline">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
