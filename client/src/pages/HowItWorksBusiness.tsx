import { motion } from "framer-motion";

const HowItWorksBusiness = () => {
  const steps = [
    {
      title: "1. Create Your Business Profile",
      description: "Register with your business email or LinkedIn. Set up your company profile with details about your organization, industry focus, and hiring needs.",
      icon: "🏢",
    },
    {
      title: "2. Verify Your Business",
      description: "Complete our business verification process to establish credibility and trust with freelancers. Verified businesses attract top talent.",
      icon: "✓",
    },
    {
      title: "3. Post Your Project",
      description: "Create detailed job posts specifying required skills, budget, timeline, and engagement model (hourly/fixed price). Mark urgent projects for faster responses.",
      icon: "📢",
    },
    {
      title: "4. Review & Shortlist",
      description: "Evaluate proposals from qualified freelancers. Review their profiles, portfolios, and past project reviews to make informed decisions.",
      icon: "📋",
    },
    {
      title: "5. Interview & Hire",
      description: "Schedule interviews with promising candidates through our platform. Use integrated chat and video calls for seamless communication. Send job offers to selected freelancers.",
      icon: "🤝",
    }
  ];

  return (
    <div className="container-custom py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How It Works for Businesses
        </h1>
        <p className="text-xl text-gray-600">
          Find the perfect freelancer for your project
        </p>
      </div>

      <div className="grid gap-8 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex gap-6 items-start bg-white p-6 rounded-lg card-shadow"
          >
            <div className="text-4xl">{step.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-16">
        <button className="btn-primary">
          Post Your First Project
        </button>
      </div>
    </div>
  );
};

export default HowItWorksBusiness; 