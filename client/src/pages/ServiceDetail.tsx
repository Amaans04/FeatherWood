import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ArrowRight } from "lucide-react";
import { services } from "@/data/services";

interface ServiceDetailProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:id");
  const serviceId = params?.id;
  const [serviceData, setServiceData] = useState<ServiceDetailProps | null>(null);

  useEffect(() => {
    if (serviceId) {
      const service = services.find((s) => s.link.split("/").pop() === serviceId);
      if (service) setServiceData(service);
    }
  }, [serviceId]);

  if (!serviceData) {
    return (
      <PageLayout seo={{ title: "Service Not Found", description: "Service not found.", noIndex: true }}>
        <section className="py-14 md:py-28">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center">
            <h1 className="font-cormorant text-2xl font-light mb-4 text-[#1A1A1A]">Service not found</h1>
            <p className="text-[#6E6A66] mb-6">The service you're looking for doesn't exist or hasn't been created yet.</p>
            <Link href="/services">
              <span className="luxury-btn cursor-pointer">Back to Services</span>
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const isInteriorDesign = serviceId === "interior-design";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceData.title,
    description: `${serviceData.description} Available from FeatherWood in Bengaluru.`,
    url: `https://www.featherwood.in/services/${serviceId}`,
    provider: {
      "@type": "FurnitureStore",
      name: "FeatherWood",
      url: "https://www.featherwood.in/",
    },
    areaServed: {
      "@type": "City",
      name: "Bengaluru",
    },
  };

  return (
    <PageLayout
      seo={{
        title: `${serviceData.title} in Bengaluru`,
        description: `${serviceData.description} FeatherWood offers ${serviceData.title.toLowerCase()} for homes in Bengaluru.`,
        canonical: `/services/${serviceId}`,
        structuredData: serviceSchema,
      }}
    >
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: serviceData.title },
        ]}
      />

      <PageHero
        label="Services"
        title={serviceData.title}
        description={serviceData.description}
        image={serviceData.imageUrl}
        imageAlt={serviceData.title}
      />

      <section className="py-14 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-cormorant text-2xl md:text-3xl font-light mb-6 text-[#1A1A1A]">What We Offer</h2>
            <p className="text-[#6E6A66] mb-8 leading-relaxed">
              At Featherwood, we provide comprehensive {serviceData.title.toLowerCase()} services tailored to your unique
              needs and preferences. Our team of experienced designers and craftspeople work closely with you to bring
              your vision to life.
            </p>

            <Separator className="my-10 bg-[#E8E4DF]" />

            {isInteriorDesign && (
              <div className="bg-white border border-[#E8E4DF] p-8 mb-12">
                <h3 className="font-cormorant text-xl md:text-2xl font-light mb-4 text-[#1A1A1A]">
                  Explore Our Design Ideas
                </h3>
                <p className="text-[#6E6A66] mb-6">
                  Looking for inspiration? Browse our curated collection of design ideas to discover stunning interior
                  concepts for every room in your home.
                </p>
                <Link href="/design-ideas">
                  <span className="luxury-btn inline-flex items-center cursor-pointer">
                    View Design Ideas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </div>
            )}

            <h2 className="font-cormorant text-2xl md:text-3xl font-light mb-6 text-[#1A1A1A]">Our Process</h2>

            <div className="space-y-6 mb-12">
              {[
                ["Consultation", "We begin with an in-depth consultation to understand your vision, requirements, and budget."],
                ["Design Development", "Our designers create detailed plans and visual concepts for your approval."],
                ["Implementation", "Our skilled team brings the design to life with meticulous attention to detail."],
                ["Final Reveal", "We present the finished space to you and ensure everything meets your expectations."],
              ].map(([title, desc], i) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#E8E4DF] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#8B7355] text-sm font-medium">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-[#1A1A1A]">{title}</h3>
                    <p className="text-[#6E6A66] text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 border-t border-[#E8E4DF] pt-12">
              <h3 className="font-cormorant text-xl font-light mb-4 text-[#1A1A1A]">Ready to Transform Your Space?</h3>
              <Link href="/user-info">
                <span className="luxury-btn inline-flex items-center cursor-pointer">
                  Book a Consultation
                  <ChevronRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
