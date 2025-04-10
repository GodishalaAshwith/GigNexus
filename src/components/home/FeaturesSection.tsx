
import { Code, Globe, Clock, ShieldCheck, Zap, Users } from "lucide-react";

const features = [
  {
    icon: <Code className="h-6 w-6" />,
    title: "Verified Tech Skills",
    description:
      "Each developer is vetted for technical skills and expertise before joining the platform.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Talent Pool",
    description:
      "Access developers from around the world, ensuring the perfect match for your project needs.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Secure Payments",
    description:
      "Our escrow system ensures safe and transparent transactions for all parties.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Fast Matching",
    description:
      "Our intelligent algorithm matches you with the most suitable developers quickly.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Flexible Engagement",
    description:
      "Choose between hourly, part-time, or full-time engagements based on your needs.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Collaborative Tools",
    description:
      "Built-in chat, video calls, and file sharing for seamless communication.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Mindlancer?
          </h2>
          <p className="text-xl text-gray-600">
            Our platform offers unique advantages for successful developer-business collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 opacity-0 animate-fade-in animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-primary-50 p-3 rounded-lg inline-block mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
