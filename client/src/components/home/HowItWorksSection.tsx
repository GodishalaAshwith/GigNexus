
import { ArrowDown, FileText, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Post a Job or Search Profiles",
    description:
      "Describe your project needs or browse through our curated developer profiles.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Connect & Collaborate",
    description:
      "Chat with potential matches, conduct interviews, and find the perfect fit.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Work with Confidence",
    description:
      "Secure payments, clear milestones, and reliable support throughout the project.",
    color: "bg-green-100 text-green-600",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Mindlancer Works
          </h2>
          <p className="text-xl text-gray-600">
            A simple, streamlined process to connect businesses with the right developer talent.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative opacity-0 animate-fade-in animate-slide-up" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className={`${step.color} p-4 rounded-full flex-shrink-0`}>
                  {step.icon}
                </div>
                <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-6 ml-1 h-8 w-0.5 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/signup">
            <Button size="lg" className="font-medium">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
