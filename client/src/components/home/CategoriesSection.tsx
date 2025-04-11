
import { Link } from "react-router-dom";
import { Code, Database, Globe, Layout, Server, Smartphone, Chrome, BarChart } from "lucide-react";

const categories = [
  {
    icon: <Code className="h-6 w-6" />,
    name: "Frontend Development",
    count: 856,
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Server className="h-6 w-6" />,
    name: "Backend Development",
    count: 734,
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    name: "Mobile Development",
    count: 512,
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: <Database className="h-6 w-6" />,
    name: "Database Engineering",
    count: 408,
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    name: "Full-Stack Development",
    count: 621,
    color: "bg-red-100 text-red-600",
  },
  {
    icon: <Layout className="h-6 w-6" />,
    name: "UI/UX Development",
    count: 325,
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: <Chrome className="h-6 w-6" />,
    name: "DevOps Engineering",
    count: 247,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    name: "Data Engineering",
    count: 183,
    color: "bg-cyan-100 text-cyan-600",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Specialty
          </h2>
          <p className="text-xl text-gray-600">
            Find developers with expertise in your specific technical needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="opacity-0 animate-fade-in animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all flex items-center space-x-4 h-full">
                <div className={`${category.color} p-3 rounded-lg`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} developers</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
