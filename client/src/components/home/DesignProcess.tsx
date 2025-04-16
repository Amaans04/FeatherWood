import React from "react";
import { Link } from "wouter";

const DesignProcess: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Consultation",
      description: "We start with understanding your needs, preferences, and budget to establish project requirements."
    },
    {
      number: 2,
      title: "Design Concept",
      description: "Our designers create detailed plans, mood boards, and 3D visualizations for your approval."
    },
    {
      number: 3,
      title: "Execution",
      description: "We source materials, coordinate with vendors, and manage the implementation of your design."
    },
    {
      number: 4,
      title: "Final Reveal",
      description: "We complete the project with final styling touches and a walkthrough of your transformed space."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Design Process</h2>
          <p className="text-lg text-gray-700">From concept to completion, we follow a comprehensive process to bring your vision to life.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/contact">
            <a className="inline-block bg-primary hover:bg-accent text-white px-8 py-3 rounded-md font-medium transition-all">
              Schedule a Consultation
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DesignProcess;
