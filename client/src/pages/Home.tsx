import React from "react";
import Hero from "@/components/home/Hero";
import ServicesIntro from "@/components/home/ServicesIntro";
import FeaturedFurniture from "@/components/home/FeaturedFurniture";
import InteriorShowcase from "@/components/home/InteriorShowcase";
import DesignProcess from "@/components/home/DesignProcess";
import EstimateForm from "@/components/home/EstimateForm";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import CallToAction from "@/components/home/CallToAction";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <ServicesIntro />
      <FeaturedFurniture />
      <InteriorShowcase />
      <DesignProcess />
      <EstimateForm />
      <Testimonials />
      <BlogPreview />
      <CallToAction />
    </>
  );
};

export default Home;
