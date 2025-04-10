
import React from "react";

const companies = [
  { name: "Acme Corp", logo: "ACME" },
  { name: "Globex", logo: "GLOBEX" },
  { name: "Initech", logo: "INITECH" },
  { name: "TechFirm", logo: "TECHFIRM" },
  { name: "Massive Inc", logo: "MASSIVE" },
  { name: "StarkTech", logo: "STARK" },
];

const TrustedBySection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-xl text-gray-600">Trusted by innovative companies</h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {companies.map((company, index) => (
            <div key={index} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="bg-gray-50 px-6 py-3 rounded-md">
                <span className="font-bold tracking-wider text-gray-500">{company.logo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
