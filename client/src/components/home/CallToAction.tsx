import React from "react";
import { Link } from "wouter";

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-accent text-white relative">
      <div className="absolute inset-0 bg-primary opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-lg mb-8 opacity-90">Whether you're looking for the perfect furniture piece or a complete interior redesign, our team is here to help bring your vision to life.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/furniture">
              <a className="bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-medium">
                Shop Furniture
              </a>
            </Link>
            <Link href="/contact">
              <a className="bg-white text-primary hover:bg-background px-8 py-3 rounded-md font-medium transition-all">
                Book a Consultation
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
