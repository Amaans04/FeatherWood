import { useState, useEffect, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import locationsData from "@/data/locations.json";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Clock, 
  MapPin, 
  Phone, 
  Navigation2, 
  Mail, 
  Calendar, 
  ChevronRight, 
  Search
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons (required for proper display)
// This is a workaround for the issue with webpack and leaflet's marker icons
// Import marker icon images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icon issue
// @ts-ignore - Workaround for Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

// Custom gold icon for selected location
const goldIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'golden-marker-icon'
});

// Define a type for the store locations data structure
interface Address {
  id: string;
  name: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  hours: string;
  days: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
}

interface Location {
  id: number;
  city: string;
  addresses: Address[];
}

interface StoreLocationsData {
  locations: Location[];
}

// Mock data since the import may be causing issues
const storeLocationsData: StoreLocationsData = {
  locations: [
    {
      id: 1,
      city: "Showroom-1",
      addresses: [
        {
          
          id: "Showroom-1",
          name: "Featherwood Interiors & Furniture",
          address: "#11/45 Opposite to D mart siddapura, varthur main road Bengaluru",
          pincode: "560066",
          phone: "+91-8850219287",
          email: "Featherwoodblr@gmail.com",
          hours: "10:30 AM - 9:30 PM",
          days: "Monday - Sunday",
          coordinates: {
            lat: 12.956107148951224, 
            lng: 77.72821025974845
          },
          features: ["Design Studio", "Consultation Rooms", "Material Library"]
        }
      ]
    },
    {
      id: 2,
      city: "Studio",
      addresses: [
        {
          id: "Stduio",
          name: "Featherwood Studio",
          address: "Opposite to Sumadhura Folium, Whitefiels, Borewell Road, Bengaluru",
          pincode: "560066",
          phone: "+91-6366820888",
          email: "Featherwoodblr@gmail.com",
          hours: "10:30 AM - 9:30 PM",
          days: "Monday - Sunday",
          coordinates: {
            lat: 12.966457, 
            lng: 77.742944
          },
          features: ["Design Studio", "Material Library"]
        }
      ]
    },
    {
      id: 3,
      city: "Showroom-2",
      addresses: [
        {
          id: "Showroom-2",
          name: "Feather Wood Interiors",
          address: "Shop #01 Opposite Sai Garden, next to Miracle Hospital, Seegehalli, Kadugodi, Bengaluru",
          pincode: "560066",
          phone: "+91-6366830888",
          email: "Featherwoodblr@gmail.com",
          hours: "10:30 AM - 9:30 PM",
          days: "Monday - Sunday",
          coordinates: {
            lat: 13.00897588290264,
            lng: 77.7588814254467
          },
          features: ["Design Studio", "Consultation Rooms", "Material Library"]
        }
      ]
    }
  ]
};

// Map component with Leaflet implementation
interface MapComponentProps {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location) => void;
  locations: Location[];
}

const MapComponent = ({ selectedLocation, setSelectedLocation, locations }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  
  // Effect to pan to selected location
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const coords = selectedLocation.addresses[0].coordinates;
      mapRef.current.setView([coords.lat, coords.lng], 12);
    }
  }, [selectedLocation]);

  // Calculate center and zoom for initial map view
  const getInitialMapView = () => {
    // If we have a selected location, center on it
    if (selectedLocation) {
      return {
        center: [
          selectedLocation.addresses[0].coordinates.lat,
          selectedLocation.addresses[0].coordinates.lng
        ] as [number, number],
        zoom: 12
      };
    }
    
    // Otherwise, center on India
    return {
      center: [20.5937, 78.9629] as [number, number], // Center of India
      zoom: 5
    };
  };

  const { center, zoom } = getInitialMapView();

  // Add CSS for the golden marker
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    // Add the CSS for the golden marker icon
    styleElement.textContent = `
      .golden-marker-icon {
        filter: hue-rotate(45deg) saturate(1.8) brightness(1.2);
      }
      
      /* Fix z-index issues */
      .leaflet-pane {
        z-index: 1 !important;
      }
      .leaflet-top, .leaflet-bottom {
        z-index: 5 !important;
      }
      
      /* Custom scrollbar styling */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #FAFAF8;
        border-radius: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #8B7355;
        border-radius: 4px;
        border: 2px solid #FAFAF8;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #6E5A42;
      }
    `;
    // Append the style element to the document head
    document.head.appendChild(styleElement);

    // Clean up
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="w-full h-full rounded-md overflow-hidden">
      <MapContainer
        style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
        center={center}
        zoom={zoom}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {locations.map((location) => 
          location.addresses.map((address) => (
            <Marker 
              key={address.id}
              position={[address.coordinates.lat, address.coordinates.lng]}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(location);
                }
              }}
              // @ts-ignore - Using icon property from Leaflet but TypeScript doesn't recognize it
              icon={selectedLocation && selectedLocation.id === location.id ? goldIcon : new L.Icon.Default()}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-base">{address.name}</h3>
                  <p className="text-sm">{address.address}</p>
                  <p className="text-xs mt-1">
                    <span className="font-semibold">Hours:</span> {address.hours}, {address.days}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="font-semibold">Phone:</span> {address.phone}
                  </p>
            </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default function StoreLocator() {
  const { locations } = storeLocationsData;
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [displayedLocations, setDisplayedLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter locations based on city selection and search term
  useEffect(() => {
    const filtered = locations.filter(location => {
      const matchesCity = !selectedCity || selectedCity === 'all' || location.city === selectedCity;
      const matchesSearch = !searchTerm || 
        location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.addresses.some(addr => 
          addr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          addr.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return matchesCity && matchesSearch;
    });
    
    setDisplayedLocations(filtered);
    
    // If there's a filtered result and no selected location, select the first one
    if (filtered.length > 0 && !selectedLocation) {
      setSelectedLocation(filtered[0]);
    } else if (filtered.length === 0) {
      setSelectedLocation(null);
    }
  }, [selectedCity, searchTerm, locations]);

  const localBusinessSchemas = locationsData.locations.map((store) => ({
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: `FeatherWood — ${store.area}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.city,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    telephone: store.phone,
    openingHours: "Mo-Su 10:00-20:00",
    geo: {
      "@type": "GeoCoordinates",
      latitude: String(store.mapCoordinates.lat),
      longitude: String(store.mapCoordinates.lng),
    },
    url: "https://www.featherwood.in/store-locator",
  }));

  return (
    <PageLayout seo={{ title: "Store Locator", description: "Find FeatherWood showrooms and design studios in Bengaluru.", canonical: "/store-locator" }}>

        <section className="bg-[#FAFAF8] py-6 md:py-12">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl md:px-6">
            <div className="text-center mb-8">
              <h1 className="font-cormorant text-3xl md:text-5xl font-bold mb-3 text-[#1A1A1A]">
                Our Experience Centers
              </h1>
              <p className="text-[#6E6A66] max-w-2xl mx-auto text-sm md:text-base">
                Visit our luxury design studios across Bengaluru to experience our craftsmanship firsthand and consult with our expert designers
              </p>
            </div>
            
            {/* Mobile View - Stacked Layout */}
            <div className="md:hidden flex flex-col">
              <div className="mb-6 p-4 bg-[#FAFAF8] border border-[#E8E4DF] rounded-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Search className="h-4 w-4 text-[#6E6A66]" />
                    </div>
                  <input
                      type="text" 
                      placeholder="Search locations..." 
                      className="w-full pl-10 pr-3 py-2 bg-white border border-[#E8E4DF] rounded-md text-sm placeholder:text-[#6E6A66] focus:border-[#8B7355] focus:outline-none"
                    value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                  <Select value={selectedCity ?? 'all'} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-[140px] text-sm bg-white border-[#E8E4DF] text-[#1A1A1A] hover:border-[#8B7355] focus:border-[#8B7355] focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E8E4DF] text-[#1A1A1A]">
                      <SelectItem value="all" className="focus:bg-[#FAFAF8] focus:text-[#1A1A1A]">All</SelectItem>
                      {Array.from(new Set(locations.map(loc => loc.city))).map(city => (
                        <SelectItem key={city} value={city} className="focus:bg-[#FAFAF8] focus:text-[#1A1A1A]">{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              
                <div className="h-64 rounded-md overflow-hidden mb-4">
                  {/* Map component */}
                  <MapComponent 
                    selectedLocation={selectedLocation} 
                  setSelectedLocation={setSelectedLocation}
                  locations={displayedLocations}
                />
                </div>
              </div>
              
              {/* Location List */}
              <div className="space-y-4">
                {displayedLocations.map(location => (
                  <div 
                    key={location.id} 
                    className={`p-4 rounded-card border transition-colors cursor-pointer ${
                      selectedLocation?.id === location.id 
                        ? 'bg-[#FAFAF8] border-l-4 border-[#8B7355]' 
                        : 'bg-white border-[#E8E4DF] hover:bg-[#F5F0EA]'
                    }`}
                          onClick={() => setSelectedLocation(location)}
                        >
                    <h2 className="font-cormorant text-xl font-semibold mb-2 text-[#1A1A1A]">{location.city}</h2>
                    
                    {location.addresses.map(address => (
                      <div key={address.id} className="mt-3 pl-2 border-l border-[#E8E4DF]">
                        <h3 className="font-medium text-base text-[#1A1A1A]">{address.name}</h3>
                        <p className="text-[#6E6A66] text-sm mb-2">
                          {address.address}, {address.pincode}
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 text-[#8B7355] mr-2" />
                            <span className="text-[#6E6A66]">{address.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3.5 w-3.5 text-[#8B7355] mr-2" />
                            <span className="text-[#6E6A66]">
                              {address.hours}, {address.days}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${address.coordinates.lat},${address.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-[#8B7355] hover:text-[#6E5A42]"
                          >
                            <Navigation2 className="h-3 w-3 mr-1" />
                            Directions
                          </a>
                          <Link
                            href="/contact"
                            className="flex items-center text-xs text-[#8B7355] hover:text-[#6E5A42]"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Book Visit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                {displayedLocations.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-[#6E6A66]">No locations found. Please try another search.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10"
                        onClick={() => {
                        setSearchTerm('');
                          setSelectedCity(null);
                        }}
                      >
                      Reset filters
                    </Button>
                    </div>
                  )}
              </div>
            </div>
            {/* Desktop View - Side by Side Layout */}
            <div className="hidden md:grid md:grid-cols-12 gap-8">
              {/* Left Column - List */}
              <div className="col-span-4">
                <div className="sticky top-32">
                  <div className="p-4 bg-[#FAFAF8] border border-[#E8E4DF] rounded-card mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Search className="h-4 w-4 text-[#6E6A66]" />
                        </div>
                    <input
                          type="text" 
                          placeholder="Search locations..." 
                          className="w-full pl-10 pr-3 py-2 bg-white border border-[#E8E4DF] rounded-md text-sm placeholder:text-[#6E6A66] focus:border-[#8B7355] focus:outline-none"
                      value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                      <Select value={selectedCity ?? 'all'} onValueChange={setSelectedCity}>
                        <SelectTrigger className="w-[140px] text-sm bg-white border-[#E8E4DF] text-[#1A1A1A] hover:border-[#8B7355] focus:border-[#8B7355] focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="All" />
                    </SelectTrigger>
                        <SelectContent className="bg-white border-[#E8E4DF] text-[#1A1A1A]">
                          <SelectItem value="all" className="focus:bg-[#FAFAF8] focus:text-[#1A1A1A]">All</SelectItem>
                          {Array.from(new Set(locations.map(loc => loc.city))).map(city => (
                            <SelectItem key={city} value={city} className="focus:bg-[#FAFAF8] focus:text-[#1A1A1A]">{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                  </div>
                  
                  <div className="h-[calc(100vh-260px)] overflow-y-auto pr-2 space-y-4 custom-scrollbar premium-scroll" data-lenis-prevent style={{ scrollbarWidth: 'thin', scrollbarColor: '#8B7355 #FAFAF8' }}>
                    {displayedLocations.map(location => (
                      <div 
                        key={location.id} 
                        className={`p-4 rounded-card border transition-colors cursor-pointer ${
                          selectedLocation?.id === location.id 
                            ? 'bg-[#FAFAF8] border-l-4 border-[#8B7355]' 
                            : 'bg-white border-[#E8E4DF] hover:bg-[#F5F0EA]'
                        }`}
                            onClick={() => setSelectedLocation(location)}
                          >
                        <h2 className="font-cormorant text-xl font-semibold mb-2 text-[#1A1A1A]">{location.city}</h2>
                        
                        {location.addresses.map(address => (
                          <div key={address.id} className="mt-3 pl-3 border-l border-[#E8E4DF]">
                            <h3 className="font-medium text-base text-[#1A1A1A]">{address.name}</h3>
                            <p className="text-[#6E6A66] text-sm mb-2">{address.address}, {address.pincode}</p>
                            
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center text-sm">
                                <Phone className="h-3.5 w-3.5 text-[#8B7355] mr-2" />
                                <span className="text-[#6E6A66]">{address.phone}</span>
                            </div>
                            
                              <div className="flex items-center text-sm">
                                <Clock className="h-3.5 w-3.5 text-[#8B7355] mr-2" />
                                <span className="text-[#6E6A66]">{address.hours}, {address.days}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex space-x-4">
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${address.coordinates.lat},${address.coordinates.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-xs text-[#8B7355] hover:text-[#6E5A42]"
                              >
                                <Navigation2 className="h-3 w-3 mr-1" />
                                Directions
                              </a>
                              
                              <Link href="/contact" className="flex items-center text-xs text-[#8B7355] hover:text-[#6E5A42]">
                                <Calendar className="h-3 w-3 mr-1" />
                                Book Visit
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    {displayedLocations.length === 0 && (
                      <div className="py-8 text-center">
                        <p className="text-[#6E6A66]">No locations found. Please try another search.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedCity(null);
                          }}
                        >
                          Reset filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Map */}
              <div className="col-span-8">
                <div className="p-4 bg-[#FAFAF8] rounded-card border border-[#E8E4DF]" style={{ position: 'relative', zIndex: 1 }}>
                  <h3 className="font-cormorant text-xl font-semibold mb-4 text-[#1A1A1A]">Map View</h3>
                  <div className="h-[calc(100vh-180px)] bg-[#FAFAF8] rounded-md overflow-hidden">
                    {/* Map component */}
                    <MapComponent 
                      selectedLocation={selectedLocation} 
                  setSelectedLocation={setSelectedLocation}
                  locations={displayedLocations}
                />
              </div>
            </div>
          </div>
            </div>
          </div>
        </section>
      </PageLayout>
  );
}