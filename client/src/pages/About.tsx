import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { ChevronRight, Users, Star, Award, BookOpen, Lightbulb, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <PageLayout
      seo={{
        title: "About FeatherWood Design",
        description:
          "Learn about FeatherWood — Bengaluru's premium interior design studio crafting bespoke luxury furniture and interiors for modern Indian homes.",
        canonical: "/about",
      }}
    >
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <PageHero
        label="Our Story"
        title="Crafting Premium Living Spaces Since 2010"
        description="Featherwood has been transforming houses into dream homes with our exceptional interior design services."
        image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1228&q=80"
        imageAlt="Featherwood Interior Design"
      />

        {/* Our Story Section */}
        <section className="py-14 md:py-28 bg-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="font-cormorant text-3xl font-light mb-6 text-[#1A1A1A]">Our Story</h2>
                <p className="text-[#6E6A66] mb-4">
                  Founded in 2010, Featherwood began as a small design studio with a big vision - to create living spaces that perfectly balance luxury, functionality, and personal expression. Our founder, Sarah Wood, combined her passion for design with her background in architecture to establish a company that truly understands the art of interior transformation.
                </p>
                <p className="text-[#6E6A66] mb-4">
                  Over the years, we've grown from a team of 3 to over 300 design professionals across the country. Our philosophy remains unchanged: every space has potential, and every client deserves a home that reflects their unique lifestyle and aspirations.
                </p>
                <p className="text-[#6E6A66]">
                  Today, Featherwood is recognized as one of India's premier interior design companies, having completed over 10,000 projects nationwide. We continue to innovate and elevate the standard of interior design, bringing international trends and timeless elegance to homes across the country.
                </p>

                <div className="mt-8 flex flex-wrap gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8B7355]">13+</div>
                    <div className="text-[#6E6A66] text-sm">Years of Excellence</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8B7355]">10,000+</div>
                    <div className="text-[#6E6A66] text-sm">Projects Completed</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8B7355]">300+</div>
                    <div className="text-[#6E6A66] text-sm">Design Experts</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8B7355]">15+</div>
                    <div className="text-[#6E6A66] text-sm">Cities</div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-64 overflow-hidden rounded-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1630699144867-37acbe72c4b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" 
                      alt="Interior design team at work" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-64 overflow-hidden rounded-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80" 
                      alt="Kitchen design by Featherwood" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-64 overflow-hidden rounded-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80" 
                      alt="Living room design" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-64 overflow-hidden rounded-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1632829882891-5047ceda5c5a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80" 
                      alt="Design consultation" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-14 md:py-28 bg-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2 bg-white p-8 rounded-card border border-[#E8E4DF] shadow-soft">
                <div className="flex items-center mb-6">
                  <div className="bg-[#8B7355]/15 p-3 rounded-full mr-4">
                    <Lightbulb className="h-8 w-8 text-[#8B7355]" />
                  </div>
                  <h2 className="text-2xl font-cormorant font-light text-[#1A1A1A]">Our Mission</h2>
                </div>
                <p className="text-[#6E6A66] mb-6">
                  To transform living spaces into personalized sanctuaries that enhance the quality of life for our clients through innovative design, superior craftsmanship, and exceptional service.
                </p>
                <ul className="space-y-3 text-[#6E6A66]">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
                    <span>Create designs that perfectly balance aesthetics and functionality</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
                    <span>Deliver exceptional value and quality in every project</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
                    <span>Make the design process enjoyable and stress-free for our clients</span>
                  </li>
                </ul>
              </div>

              <div className="md:w-1/2 bg-white p-8 rounded-card border border-[#E8E4DF] shadow-soft">
                <div className="flex items-center mb-6">
                  <div className="bg-[#8B7355]/15 p-3 rounded-full mr-4">
                    <TrendingUp className="h-8 w-8 text-[#8B7355]" />
                  </div>
                  <h2 className="text-2xl font-cormorant font-light text-[#1A1A1A]">Our Vision</h2>
                </div>
                <p className="text-[#6E6A66] mb-6">
                  To be India's most trusted and innovative interior design company, setting new standards of excellence and making premium design accessible to more homeowners across the nation.
                </p>
                <ul className="space-y-3 text-[#6E6A66]">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
                    <span>Lead innovation in sustainable and functional design solutions</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
                    <span>Expand our presence while maintaining our quality standards</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
                    <span>Create opportunities for design professionals to grow and excel</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-14 md:py-28 bg-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-cormorant font-light mb-4 text-[#1A1A1A]">Our Core Values</h2>
              <p className="text-[#6E6A66]">
                The principles that guide everything we do at Featherwood.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-card text-center border border-[#E8E4DF] shadow-soft">
                <div className="inline-flex items-center justify-center bg-[#8B7355]/15 p-4 rounded-full mb-6">
                  <Star className="h-8 w-8 text-[#8B7355]" />
                </div>
                <h3 className="text-xl font-cormorant font-light mb-4 text-[#1A1A1A]">Excellence</h3>
                <p className="text-[#6E6A66]">
                  We pursue excellence in every aspect of our work, from the initial design concept to the final installation. No detail is too small for our attention.
                </p>
              </div>

              <div className="bg-white p-8 rounded-card text-center border border-[#E8E4DF] shadow-soft">
                <div className="inline-flex items-center justify-center bg-[#8B7355]/15 p-4 rounded-full mb-6">
                  <Users className="h-8 w-8 text-[#8B7355]" />
                </div>
                <h3 className="text-xl font-cormorant font-light mb-4 text-[#1A1A1A]">Client-Centered</h3>
                <p className="text-[#6E6A66]">
                  Our clients' needs, preferences, and lifestyle are at the heart of every decision we make. We listen, adapt, and collaborate to create spaces you'll love.
                </p>
              </div>

              <div className="bg-white p-8 rounded-card text-center border border-[#E8E4DF] shadow-soft">
                <div className="inline-flex items-center justify-center bg-[#8B7355]/15 p-4 rounded-full mb-6">
                  <Award className="h-8 w-8 text-[#8B7355]" />
                </div>
                <h3 className="text-xl font-cormorant font-light mb-4 text-[#1A1A1A]">Integrity</h3>
                <p className="text-[#6E6A66]">
                  We operate with complete transparency and honesty. From our pricing to our processes, what you see is what you get – no hidden surprises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        {/* <section className="py-20 bg-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-cormorant font-light mb-4">Meet Our Leadership</h2>
              <p className="text-[#6E6A66]">
                The visionaries and experts behind Featherwood's success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-sm overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80" 
                    alt="Sarah Wood - Founder & CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">Sarah Wood</h3>
                  <p className="text-[#8B7355] text-sm">Founder & CEO</p>
                </div>
              </div>

              <div className="bg-white rounded-sm overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" 
                    alt="Rahul Mehta - Creative Director" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">Rahul Mehta</h3>
                  <p className="text-[#8B7355] text-sm">Creative Director</p>
                </div>
              </div>

              <div className="bg-white rounded-sm overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1522&q=80" 
                    alt="Priya Singh - Head of Design" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">Priya Singh</h3>
                  <p className="text-[#8B7355] text-sm">Head of Design</p>
                </div>
              </div>

              <div className="bg-white rounded-sm overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Vikram Patel - Operations Director" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">Vikram Patel</h3>
                  <p className="text-[#8B7355] text-sm">Operations Director</p>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Our Approach Section */}
        <section className="py-14 md:py-28 bg-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-cormorant font-light mb-6 text-[#1A1A1A]">Our Approach</h2>
                <p className="text-[#6E6A66] mb-6">
                  At Featherwood, we follow a client-centered, collaborative approach to design. We believe that great spaces are created when designers truly understand the people who will live in them.
                </p>

                <div className="space-y-8 mt-8">
                  <div className="flex">
                    <div className="bg-[#8B7355]/15 w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 mr-4">
                      <span className="text-[#8B7355] font-bold">01</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Discovery</h3>
                      <p className="text-[#6E6A66] text-sm">
                        We begin by understanding your lifestyle, preferences, and vision through detailed consultations.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-[#8B7355]/15 w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 mr-4">
                      <span className="text-[#8B7355] font-bold">02</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Concept & Design</h3>
                      <p className="text-[#6E6A66] text-sm">
                        Our designers create detailed plans and 3D visualizations tailored to your specific needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-[#8B7355]/15 w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 mr-4">
                      <span className="text-[#8B7355] font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Execution</h3>
                      <p className="text-[#6E6A66] text-sm">
                        Our skilled craftspeople and project managers bring the design to life with precision and care.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-[#8B7355]/15 w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 mr-4">
                      <span className="text-[#8B7355] font-bold">04</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Handover</h3>
                      <p className="text-[#6E6A66] text-sm">
                        We deliver your perfectly finished space along with maintenance advice and warranty support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1572025442646-866d16c84a54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80" 
                  alt="Featherwood design process" 
                  className="rounded-card w-full h-auto border border-[#E8E4DF]"
                />
              </div>
            </div>
          </div>
        </section>

      {/* CTA Section */}
      <section className="py-14 md:py-28 bg-[#FAFAF8] border-t border-[#E8E4DF]">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="font-cormorant text-3xl font-light mb-4 text-[#1A1A1A]">Ready to Transform Your Space?</h2>
              <p className="text-[#6E6A66]">
                Let's create your dream home together. Book a free consultation with our design experts today.
              </p>
            </div>
            <div className="md:w-1/3 flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <span className="luxury-btn cursor-pointer">Contact Us</span>
              </Link>
              <button type="button" className="luxury-btn-outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}