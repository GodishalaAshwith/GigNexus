
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO, TechNova",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop",
    content:
      "Mindlancer transformed our development process. We found a senior React developer within days who seamlessly integrated with our team. The quality of talent here is exceptional.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Founder, DataPulse",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&fit=crop",
    content:
      "As a startup, finding qualified developers who understand our vision was challenging until we discovered Mindlancer. Their vetting process ensures we only connect with top-tier talent.",
    rating: 5,
  },
  {
    name: "David Rodriguez",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop",
    content:
      "After years on other freelancing platforms, I switched to Mindlancer and haven't looked back. The quality of projects and clients is substantially better, and payments are always on time.",
    rating: 5,
  },
  {
    name: "Emily Zhang",
    role: "Product Manager, FinEdge",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=256&h=256&fit=crop",
    content:
      "We needed specialized Node.js expertise for our fintech platform. Mindlancer connected us with developers who had specific experience in our industry, which made all the difference.",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(testimonials.length - 3, currentIndex + 1));
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Hear from the businesses and developers who've found success on our platform.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md opacity-0 animate-fade-in animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i + testimonial.rating} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {testimonials.length > 3 && (
            <div className="flex justify-center mt-12 space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full border ${
                  currentIndex === 0
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= testimonials.length - 3}
                className={`p-2 rounded-full border ${
                  currentIndex >= testimonials.length - 3
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
