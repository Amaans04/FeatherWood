import PageLayout from "@/components/PageLayout";
import HeroSlider from "@/components/HeroSlider";
import PerksRibbon from "@/components/PerksRibbon";
import CategoryExplorer from "@/components/CategoryExplorer";
import EditorialBlock from "@/components/EditorialBlock";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import PriceCalculator from "@/components/PriceCalculator";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <PageLayout
      seo={{
        title: "Luxury Furniture & Interior Design in Bengaluru",
        description:
          "FeatherWood designs interiors and makes furniture in Bengaluru — sofas, beds, dining tables, wardrobes, modular kitchens and home renovation. Visit our Whitefield showrooms or book a free consultation.",
        canonical: "/",
      }}
    >
      <HeroSlider />
      <PerksRibbon />

      <EditorialBlock
        label="FeatherWood"
        title="Designed for Better Living"
        paragraphs={[
          "Welcome to FeatherWood — a world of design inspiration for modern homes. Inspired and unconventional, we bring distinctive styles that set the stage for refined living.",
          "Each piece carries the echoes of craftsmanship and the elegance of the present. We believe true contentment lies in the art of simplicity and the joy of living beautifully.",
        ]}
        image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1228&q=80"
        imageAlt="FeatherWood interior design"
        cta={{ text: "About Us", href: "/about" }}
      />

      <CategoryExplorer />
      <Services />
      <PriceCalculator />

      <EditorialBlock
        label="Our Philosophy"
        title="Crafted for Modern India"
        paragraphs={[
          "FeatherWood marries global design principles with an innate appreciation of the Indian lifestyle — from modular kitchens to bespoke wardrobes, every detail is considered.",
          "With a fresh perspective on style, a penchant for quality, and a nod to timeless elegance, our interiors resonate deeply with the diverse tastes of new India.",
        ]}
        image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        imageAlt="Modern Indian interior"
        reverse
        cta={{ text: "Visit Showroom", href: "/store-locator" }}
      />

      <Process />
      <Testimonials />
      <CallToAction />
      <ContactSection />
    </PageLayout>
  );
}
