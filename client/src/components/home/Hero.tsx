import React from "react";
import { Link } from "wouter";

const Hero: React.FC = () => {
  return (
    <section className="relative h-[70vh] md:h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80" 
          alt="Modern luxury living room interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-overlay"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 relative text-white">
        <div className="max-w-2xl">
          <h5 className="text-accent font-medium mb-2">Premium Living Solutions</h5>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">Where Furniture Meets <br/>Interior Design</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Elegant furnishings and professional design services to transform your space into a sanctuary.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/furniture" className="bg-secondary hover:bg-opacity-90 text-secondary-foreground px-8 py-3 rounded-md font-medium hover-scale inline-block">
              Shop Furniture
            </Link>
            <Link href="/interiors" className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-3 rounded-md font-medium transition-all inline-block">
              Design Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
