
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-16 md:py-20 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center opacity-0 animate-fade-in animate-slide-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to transform how you build software?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and developers who are changing the way software projects happen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup?type=business">
              <Button size="lg" variant="secondary" className="text-primary-800 font-medium">
                Hire a Developer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signup?type=freelancer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium">
                Join as a Developer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
