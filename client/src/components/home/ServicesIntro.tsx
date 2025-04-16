import React from "react";
import { Link } from "wouter";
import { Check } from "lucide-react";

const ServicesIntro: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
          <p className="text-lg text-gray-700">Discover our dual expertise in curated furniture selection and professional interior design services.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg overflow-hidden card-shadow hover-scale">
            <img 
              src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
              alt="Luxury furniture collection" 
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3">Furniture Collections</h3>
              <p className="text-gray-700 mb-5">Explore our curated selection of premium furniture pieces that blend style, comfort, and craftsmanship to elevate your living spaces.</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="text-accent mr-2 w-5 h-5" /> 
                  Premium materials and craftsmanship
                </li>
                <li className="flex items-center">
                  <Check className="text-accent mr-2 w-5 h-5" /> 
                  Customizable options
                </li>
                <li className="flex items-center">
                  <Check className="text-accent mr-2 w-5 h-5" /> 
                  Nationwide delivery
                </li>
              </ul>
              <Link href="/furniture">
                <a className="inline-block bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-md font-medium">
                  Explore Furniture
                </a>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden card-shadow hover-scale">
            <img 
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
              alt="Interior design service" 
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3">Interior Design Services</h3>
              <p className="text-gray-700 mb-5">Our professional interior designers create personalized spaces that reflect your style, optimize functionality, and enhance your lifestyle.</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="text-accent mr-2 w-5 h-5" /> 
                  Personalized design consultation
                </li>
                <li className="flex items-center">
                  <Check className="text-accent mr-2 w-5 h-5" /> 
                  3D visualization
                </li>
                <li className="flex items-center">
                  <Check className="text-accent mr-2 w-5 h-5" /> 
                  End-to-end project management
                </li>
              </ul>
              <Link href="/interiors">
                <a className="inline-block bg-secondary hover:bg-opacity-90 text-white px-6 py-2 rounded-md font-medium">
                  Book Consultation
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesIntro;
