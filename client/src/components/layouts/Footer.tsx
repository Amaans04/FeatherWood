import React from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="text-2xl font-bold flex items-center mb-6">
              <span className="text-accent">Feather</span>Wood
            </Link>
            <p className="mb-6 opacity-80">
              Premium furniture and bespoke interior design services that transform spaces into personalized sanctuaries.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Home</Link></li>
              <li><Link href="/furniture" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Shop Furniture</Link></li>
              <li><Link href="/interiors" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Interior Design</Link></li>
              <li><Link href="/about" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">About Us</Link></li>
              <li><Link href="/blog" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Blog</Link></li>
              <li><Link href="/contact" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/furniture?category=beds" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Beds</Link></li>
              <li><Link href="/furniture?category=sofas" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Sofas</Link></li>
              <li><Link href="/furniture?category=tables" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Tables</Link></li>
              <li><Link href="/furniture?category=storage" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Storage</Link></li>
              <li><Link href="/furniture?category=decor" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">Decor</Link></li>
              <li><Link href="/furniture?filter=new" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">New Arrivals</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-accent w-4 h-4" />
                <span className="opacity-80">123 Design Street, New York, NY 10001</span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-3 text-accent w-4 h-4" />
                <span className="opacity-80">+1 (800) 555-1234</span>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-3 text-accent w-4 h-4" />
                <span className="opacity-80">info@featherwood.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mt-1 mr-3 text-accent w-4 h-4" />
                <span className="opacity-80">Mon - Fri: 9AM - 6PM<br />Sat: 10AM - 4PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="opacity-80 text-sm mb-4 md:mb-0">© 2023 FeatherWood. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">Privacy Policy</a>
              <a href="#" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">Terms of Service</a>
              <a href="#" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">Shipping Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
