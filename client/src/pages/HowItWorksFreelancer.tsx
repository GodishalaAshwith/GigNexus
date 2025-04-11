import { motion } from "framer-motion";

const HowItWorksFreelancer = () => {
  const steps = [
    {
      title: "1. Create Your Profile",
      description: "Register using your email, LinkedIn, or GitHub account. Build a comprehensive profile showcasing your skills, experience, portfolio, and certifications. Set your hourly rate and availability.",
      icon: "🔑",
    },
    {
      title: "2. Get Verified",
      description: "Complete our verification process to build trust with potential clients. Verified profiles get more visibility and opportunities.",
      icon: "✓",
    },
    {
      title: "3. Search & Apply for Projects",
      description: "Browse projects filtered by skills, budget, and project type. Save interesting opportunities and apply with customized proposals.",
      icon: "🔍",
    },
    {
      title: "4. Submit Proposals",
      description: "Create compelling proposals with your approach, timeline, and pricing. Stand out by highlighting relevant experience and portfolio items.",
      icon: "📝",
    },
    {
      title: "5. Interview & Get Hired",
      description: "Connect with potential clients through our integrated chat and video call system. Discuss project details and expectations.",
      icon: "🤝",
    }
  ];

  return (
    <div className="container-custom py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How It Works for Freelancers
        </h1>
        <p className="text-xl text-gray-600">
          Your journey to successful freelancing starts here
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
          Get Started as a Freelancer
        </button>
      </div>
    </div>
  );
};

export default HowItWorksFreelancer; 