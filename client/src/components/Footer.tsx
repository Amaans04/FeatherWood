import { Link } from "wouter";
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import FooterCredits from "@/components/ui/FooterCredits.tsx";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAF8] pt-16 md:pt-20 pb-8 pb-mobile-nav lg:pb-8 border-t border-[#E8E4DF]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <img src="/cmp_logo.jpg" alt="FeatherWood" className="h-10 w-auto mb-6" />
            <p className="text-[#6E6A66] text-sm font-light leading-relaxed mb-6">
              Luxury interior design and furniture for discerning clients who appreciate timeless elegance.
            </p>
            <div className="flex gap-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#6E6A66] hover:text-[#1A1A1A] transition-colors">
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#6E6A66] hover:text-[#1A1A1A] transition-colors">
                <Facebook size={16} strokeWidth={1.5} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#6E6A66] hover:text-[#1A1A1A] transition-colors">
                <Linkedin size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="luxury-label mb-6">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Furniture", href: "/furniture" },
                { label: "Design Ideas", href: "/design-ideas" },
                { label: "Store Locator", href: "/store-locator" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-[#6E6A66] hover:text-[#1A1A1A] font-light transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="luxury-label mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#8B7355] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="text-sm text-[#6E6A66] font-light leading-relaxed">
                  <p>Siddapura, Varthur Main Road</p>
                  <p>Bengaluru — 560066</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#8B7355] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="text-sm text-[#6E6A66] font-light leading-relaxed">
                  <p>Kadugodi, Whitefield</p>
                  <p>Bengaluru — 560067</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[#8B7355] flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-[#6E6A66] font-light">+91 88502 19287</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-[#8B7355] flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-[#6E6A66] font-light">featherwoodblr@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="luxury-label mb-6">Get Started</h4>
            <p className="text-sm text-[#6E6A66] font-light leading-relaxed mb-6">
              Book a free consultation and let us bring your vision to life.
            </p>
            <Link href="/user-info">
              <span className="luxury-btn text-[10px] cursor-pointer">Book Consultation</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-[#E8E4DF] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6E6A66] text-xs font-light">
            &copy; {new Date().getFullYear()} FeatherWood. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/contact">
              <span className="text-xs text-[#6E6A66] hover:text-[#1A1A1A] font-light transition-colors cursor-pointer">
                Privacy
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-xs text-[#6E6A66] hover:text-[#1A1A1A] font-light transition-colors cursor-pointer">
                Terms
              </span>
            </Link>
          </div>
        </div>

        <FooterCredits />
      </div>
    </footer>
  );
}
