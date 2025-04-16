import React, { useState } from "react";
import { Link } from "wouter";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DropdownItem {
  title: string;
  isOpen: boolean;
  items: { name: string; href: string }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [dropdowns, setDropdowns] = useState<DropdownItem[]>([
    {
      title: "Furniture",
      isOpen: false,
      items: [
        { name: "Beds", href: "/furniture?category=beds" },
        { name: "Sofas", href: "/furniture?category=sofas" },
        { name: "Tables", href: "/furniture?category=tables" },
        { name: "Storage", href: "/furniture?category=storage" },
        { name: "Decor", href: "/furniture?category=decor" },
      ],
    },
    {
      title: "Interiors",
      isOpen: false,
      items: [
        { name: "Modular Kitchen", href: "/interiors?category=Modular Kitchen" },
        { name: "Living Room", href: "/interiors?category=Living Room" },
        { name: "Bedroom", href: "/interiors?category=Bedroom" },
        { name: "Wardrobes", href: "/interiors?category=Wardrobes" },
        { name: "Case Studies", href: "/interiors?category=Case Studies" },
      ],
    },
  ]);

  const toggleDropdown = (index: number) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[index].isOpen = !newDropdowns[index].isOpen;
    setDropdowns(newDropdowns);
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 bg-primary z-50 overflow-auto">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-white hover:text-accent">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="container mx-auto px-4 py-3">
        <Link href="/" onClick={onClose} className="block py-2 hover:text-accent transition-all">
          Home
        </Link>
        
        {dropdowns.map((dropdown, index) => (
          <div key={dropdown.title} className="py-2">
            <div 
              className="flex justify-between items-center hover:text-accent transition-all cursor-pointer"
              onClick={() => toggleDropdown(index)}
            >
              <span>{dropdown.title}</span>
              {dropdown.isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
            
            {dropdown.isOpen && (
              <div className="pl-4 mt-2">
                {dropdown.items.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    onClick={onClose}
                    className="block py-2 hover:text-accent transition-all"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <Link href="/interiors" onClick={onClose} className="block py-2 hover:text-accent transition-all">
          Portfolio
        </Link>
        <Link href="/blog" onClick={onClose} className="block py-2 hover:text-accent transition-all">
          Blog
        </Link>
        <Link href="/contact" onClick={onClose} className="block py-2 hover:text-accent transition-all">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
