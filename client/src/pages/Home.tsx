import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import PriceCalculator from "@/components/PriceCalculator";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { pageTransition } from "@/utils/animations";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Featherwood - Luxury Interior Design</title>
        <meta name="description" content="Luxury interior design solutions for discerning clients who appreciate exceptional craftsmanship and timeless elegance." />
      </Helmet>

      <Navbar />
      
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
        className="overflow-x-hidden w-full"
      >
      <HeroSlider />
      <Services />
      <Projects />
      <PriceCalculator />
      <Process />
      <Testimonials />
      <CallToAction />
      <ContactSection />
      </motion.div>
      
      <Footer />
      <BackToTop />
    </>
  );
}