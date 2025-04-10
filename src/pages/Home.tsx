
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";
import TrustedBySection from "@/components/home/TrustedBySection";

const Home = () => {
  return (
    <main>
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
};

export default Home;
