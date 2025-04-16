import React from "react";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const About: React.FC = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About FeatherWood</h1>
            <p className="text-lg md:text-xl opacity-90">
              Where premium furniture design meets exceptional interior expertise to create spaces that tell your story.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Founded in 2010, FeatherWood began as a small furniture workshop dedicated to creating handcrafted pieces that blend artistry with functionality. Our founder, Emma Wood, started with a simple philosophy: every piece of furniture should tell a story and stand the test of time.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                As our reputation for quality and craftsmanship grew, so did our vision. In 2015, we expanded to include interior design services, creating a unique hybrid approach that ensures every element of a space works in harmony.
              </p>
              <p className="text-lg text-gray-700">
                Today, FeatherWood is recognized as a leader in premium furniture design and comprehensive interior solutions, serving clients nationwide with the same dedication to quality and personalized service that defined our humble beginnings.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                alt="FeatherWood workshop" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              At FeatherWood, we believe that exceptional living spaces have the power to transform daily life. Our mission is to create furniture and interiors that not only reflect your unique style but also enhance the way you live, work, and connect with others.
            </p>
            <div className="flex justify-center">
              <Separator className="w-24" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Craftsmanship</h3>
              <p className="text-gray-700">
                We're dedicated to creating furniture and spaces that combine timeless design principles with modern sensibilities, using only the highest quality materials.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-gray-700">
                We're committed to environmentally responsible practices, from sourcing sustainable materials to reducing waste in our manufacturing process.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-700">
                We believe in fostering relationships with local artisans and giving back to the communities where we operate through mentorship and charitable initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                  alt="Emma Wood - Founder & Head Designer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Emma Wood</h3>
              <p className="text-accent mb-3">Founder & Head Designer</p>
              <p className="text-gray-700">
                With over 15 years of experience in furniture design and interior architecture, Emma leads our creative vision.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                  alt="David Chen - Chief Operations Officer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">David Chen</h3>
              <p className="text-accent mb-3">Chief Operations Officer</p>
              <p className="text-gray-700">
                David ensures our business runs smoothly, overseeing production, logistics, and customer service excellence.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                  alt="Sarah Johnson - Lead Interior Designer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-accent mb-3">Lead Interior Designer</p>
              <p className="text-gray-700">
                Sarah specializes in creating cohesive spaces that balance aesthetics with functionality for our clients.
              </p>
            </div>
            
            {/* Team Member 4 */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                  alt="Miguel Santana - Master Craftsman" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Miguel Santana</h3>
              <p className="text-accent mb-3">Master Craftsman</p>
              <p className="text-gray-700">
                With 20+ years of woodworking experience, Miguel leads our workshop and trains our artisan team.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose FeatherWood?</h2>
              <p className="text-lg opacity-90 mb-8">
                We combine design expertise, quality craftsmanship, and personalized service to create spaces and furnishings that exceed expectations.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="text-accent mt-1 mr-3 h-5 w-5" />
                  <span>Integrated approach to furniture and interior design</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mt-1 mr-3 h-5 w-5" />
                  <span>Premium, sustainable materials sourced responsibly</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mt-1 mr-3 h-5 w-5" />
                  <span>Skilled artisans with decades of combined experience</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mt-1 mr-3 h-5 w-5" />
                  <span>Customization options to match your unique style</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mt-1 mr-3 h-5 w-5" />
                  <span>End-to-end project management for seamless execution</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mt-1 mr-3 h-5 w-5" />
                  <span>5-year warranty on all furniture pieces</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Button asChild className="bg-accent hover:bg-opacity-90">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600607687644-c7f34b5e0b01?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                alt="FeatherWood furniture showroom" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Clients & Partners Logo Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Our Clients & Partners</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {/* Logo placeholders */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-16 rounded-md flex items-center justify-center">
                <div className="text-gray-400 font-medium">Partner Logo</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
