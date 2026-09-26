import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackCalculatorUse } from "@/lib/analytics";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChevronRight, Home, Check, Calculator, Download, ArrowRight } from "lucide-react";

import pricingData from "@/data/pricing.json";

export default function HomeCalculator() {
  const [selectedRooms, setSelectedRooms] = useState<{[key: string]: boolean}>({});
  const [roomSizes, setRoomSizes] = useState<{[key: string]: number}>({});
  const [packageType, setPackageType] = useState<"basic" | "premium" | "luxury">("premium");
  const [totalEstimate, setTotalEstimate] = useState<number>(0);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    city: ""
  });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showQuote, setShowQuote] = useState<boolean>(false);
  
  const { roomTypes, packageTypes } = pricingData.homeInterior;
  
  // Initialize room sizes with default values (minimum sizes)
  useEffect(() => {
    const initialRoomSizes: {[key: string]: number} = {};
    roomTypes.forEach(room => {
      initialRoomSizes[room.id] = room.minArea;
    });
    setRoomSizes(initialRoomSizes);
  }, []);
  
  // Calculate total estimate whenever selections change
  useEffect(() => {
    let total = 0;
    
    roomTypes.forEach(room => {
      if (selectedRooms[room.id]) {
        const area = roomSizes[room.id] || room.minArea;
        const pricePerSqFt = room.pricePerSqFt[packageType];
        total += area * pricePerSqFt;
      }
    });
    
    setTotalEstimate(total);
  }, [selectedRooms, roomSizes, packageType]);
  
  const toggleRoomSelection = (roomId: string) => {
    setSelectedRooms(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }));
  };
  
  const updateRoomSize = (roomId: string, size: number) => {
    setRoomSizes(prev => ({
      ...prev,
      [roomId]: size
    }));
  };
  
  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form to Google Sheets
      submitFormToGoogleSheets();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getSelectedRoomCount = () => {
    return Object.values(selectedRooms).filter(Boolean).length;
  };

  const revealQuote = () => {
    setShowQuote(true);
    trackCalculatorUse("home_interior", totalEstimate);
  };
  
  const submitFormToGoogleSheets = async () => {
    try {
      // Google Script URL - use the same one as other forms
      const scriptURL = "https://script.google.com/macros/s/AKfycbw_CsG5qUH22QoyuPhMUZQ2bGX0GeEz35wHDhNkz8Pyrzajb49AVdEn0i5fA_pTmgEyAA/exec";
      
      // Get the selected rooms and package details
      const selectedRoomsDetails = roomTypes
        .filter(room => selectedRooms[room.id])
        .map(room => `${room.name} (${roomSizes[room.id] || room.minArea} sqft)`)
        .join(", ");
      
      const packageDetails = packageTypes.find(pkg => pkg.id === packageType)?.name || "";
      
      // Calculate total area
      const totalArea = roomTypes
        .filter(room => selectedRooms[room.id])
        .reduce((sum, room) => sum + (roomSizes[room.id] || room.minArea), 0);
      
      // Build dimensions string
      const dimensionsStr = `Total Area: ${totalArea} sqft`;
      
      // Build options string
      const optionsStr = `Package: ${packageDetails}, Rooms: ${selectedRoomsDetails}`;
      
      // Build URL with query parameters
      const url = new URL(scriptURL);
      
      // Add form data as query parameters
      url.searchParams.append("formType", "calculator");
      url.searchParams.append("calculatorType", "home");
      url.searchParams.append("name", contactInfo.name);
      url.searchParams.append("email", contactInfo.email);
      url.searchParams.append("phone", contactInfo.phone);
      url.searchParams.append("city", contactInfo.city);
      url.searchParams.append("selectedType", "Full Home Interior");
      url.searchParams.append("dimensions", dimensionsStr);
      url.searchParams.append("materialGrade", packageDetails);
      url.searchParams.append("options", optionsStr);
      url.searchParams.append("totalEstimate", totalEstimate.toString());
      url.searchParams.append("sourceUrl", window.location.href);
      
      // Use XMLHttpRequest to avoid page redirection
      const xhr = new XMLHttpRequest();
      
      // Setup request with a silent GET request (no redirect)
      xhr.open("GET", url.toString(), true);
      
      // Set up callbacks
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Home calculator form submitted successfully:", xhr.responseText);
          // Show success message by showing the quote
          revealQuote();
        } else {
          console.error("Error submitting home calculator form:", xhr.statusText);
          revealQuote();
        }
      };
      
      xhr.onerror = function() {
        console.error("Network error during form submission");
        revealQuote();
      };
      
      // Send the request
      xhr.send();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      // Still show the quote even if there's an error
      revealQuote();
    }
  };

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How accurate is this estimate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This calculator provides a ballpark estimate based on standard measurements and quality. For a precise quote, our design consultants will visit your home to take detailed measurements and understand your specific requirements.",
        },
      },
      {
        "@type": "Question",
        name: "What does the package price include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The package prices include design consultation, materials, manufacturing, and installation. Additional costs may apply for specific customizations, specialized materials, or structural modifications.",
        },
      },
      {
        "@type": "Question",
        name: "How long will my project take to complete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Project timelines vary based on the scope of work. A typical 2-3 bedroom home interior project takes 45-90 days to complete from design approval to installation.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer any discounts or promotions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we run seasonal promotions and offer special discounts for full home interiors. Our design consultants will inform you about ongoing offers during your consultation.",
        },
      },
    ],
  };
  
  return (
    <PageLayout seo={{ title: "Home Interior Price Calculator Bengaluru", description: "Estimate the cost of a full home interior in Bengaluru — living room, kitchen, bedroom and wardrobe — with FeatherWood's calculator.", canonical: "/home-interior-price-calculator", structuredData: homeFaqSchema }}>

        {/* Breadcrumbs */}
        <div className="bg-[#FAFAF8] border-b border-[#E8E4DF] py-4">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex items-center text-sm text-[#6E6A66]">
              <Link href="/">
                <span className="hover:text-[#8B7355] cursor-pointer">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-[#8B7355]">Home Interior Price Calculator</span>
            </div>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-[#FAFAF8] to-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-cormorant mb-4">
                Home Interior Price Calculator
              </h1>
              <p className="text-[#6E6A66] text-lg mb-8">
                Estimate the cost of your dream home interior project with our interactive calculator.
              </p>
            </div>
          </div>
        </section>
        
        {/* Calculator Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-5xl mx-auto">
              
              {!showQuote ? (
                <>
                  {/* Progress Indicator */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                      <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#8B7355]' : 'text-[#666]'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 1 ? 'bg-[#8B7355] text-black' : 'bg-[#333] text-[#666]'}`}>
                          1
                        </div>
                        <span className="text-sm">Select Rooms</span>
                      </div>
                      
                      <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-[#8B7355]' : 'bg-[#333]'}`}></div>
                      
                      <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#8B7355]' : 'text-[#666]'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 2 ? 'bg-[#8B7355] text-black' : 'bg-[#333] text-[#666]'}`}>
                          2
                        </div>
                        <span className="text-sm">Choose Package</span>
                      </div>
                      
                      <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-[#8B7355]' : 'bg-[#333]'}`}></div>
                      
                      <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#8B7355]' : 'text-[#666]'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 3 ? 'bg-[#8B7355] text-black' : 'bg-[#333] text-[#666]'}`}>
                          3
                        </div>
                        <span className="text-sm">Your Details</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 1: Room Selection */}
                  <div className={currentStep === 1 ? 'block' : 'hidden'}>
                    <div className="bg-white border border-[#E8E4DF] rounded-card p-6 mb-8 shadow-soft">
                      <h2 className="text-2xl font-semibold mb-6">Step 1: Select Rooms to Design</h2>
                      <p className="text-[#6E6A66] mb-8">
                        Choose the rooms you want to design and specify their approximate size.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roomTypes.map((room) => (
                          <Card key={room.id} className={`bg-[#FAFAF8] border border-[#E8E4DF] ${selectedRooms[room.id] ? 'ring-2 ring-[#8B7355]' : ''}`}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                              <CardTitle className="text-lg text-[#1A1A1A]">{room.name}</CardTitle>
                                <Button 
                                  variant={selectedRooms[room.id] ? "default" : "outline"}
                                  size="sm"
                                  className={selectedRooms[room.id] ? "bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]" : "border-[#E8E4DF] text-[#6E6A66]"}
                                  onClick={() => toggleRoomSelection(room.id)}
                                >
                                  {selectedRooms[room.id] ? "Selected" : "Select"}
                                </Button>
                              </div>
                              <CardDescription className="text-[#6E6A66]">
                                {room.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {selectedRooms[room.id] && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor={`${room.id}-size`}>Room Size (sqft)</Label>
                                    <span className="text-[#8B7355] font-medium">{roomSizes[room.id] || room.minArea} sqft</span>
                                  </div>
                                  <Slider
                                    id={`${room.id}-size`}
                                    defaultValue={[room.minArea]}
                                    min={room.minArea}
                                    max={room.maxArea}
                                    step={10}
                                    className="mt-2"
                                    onValueChange={(value) => updateRoomSize(room.id, value[0])}
                                  />
                                  <div className="flex justify-between mt-1 text-xs text-[#A29B93]">
                                    <span>{room.minArea} sqft</span>
                                    <span>{room.maxArea} sqft</span>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                            {selectedRooms[room.id] && (
                              <CardFooter className="border-t border-[#E8E4DF] pt-4">
                                <div className="w-full flex justify-between items-center">
                                  <span className="text-sm text-[#6E6A66]">Estimated Price:</span>
                                  <span className="font-semibold text-[#1A1A1A]">
                                    {formatCurrency((roomSizes[room.id] || room.minArea) * room.pricePerSqFt[packageType])}
                                  </span>
                                </div>
                              </CardFooter>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" className="text-[#6E6A66]" disabled>
                        Back
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]"
                        disabled={getSelectedRoomCount() === 0}
                      >
                        Next: Choose Package
                      </Button>
                    </div>
                  </div>
                  
                  {/* Step 2: Package Selection */}
                  <div className={currentStep === 2 ? 'block' : 'hidden'}>
                    <div className="bg-white border border-[#E8E4DF] rounded-card p-6 mb-8 shadow-soft">
                      <h2 className="text-2xl font-semibold mb-6">Step 2: Choose Your Package</h2>
                      <p className="text-[#6E6A66] mb-8">
                        Select a design package that fits your style and budget.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {packageTypes.map((pkg) => (
                          <Card 
                            key={pkg.id} 
                            className={`bg-[#FAFAF8] border border-[#E8E4DF] h-full ${packageType === pkg.id ? 'ring-2 ring-[#8B7355]' : ''}`}
                            onClick={() => setPackageType(pkg.id as "basic" | "premium" | "luxury")}
                            style={{ cursor: 'pointer' }}
                          >
                            <CardHeader className="pb-2">
                              <div 
                                className="w-full h-1.5 rounded-full mb-3"
                                style={{ backgroundColor: pkg.color }}
                              ></div>
                              <CardTitle className="text-lg text-[#1A1A1A]">{pkg.name}</CardTitle>
                              <CardDescription className="text-[#6E6A66]">
                                {pkg.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 mt-2">
                                {pkg.features.map((feature, index) => (
                                  <li key={index} className="flex items-start">
                                    <Check className="h-5 w-5 text-[#8B7355] flex-shrink-0 mr-2 mt-0.5" />
                                    <span className="text-sm text-[#6E6A66]">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                            <CardFooter className="border-t border-[#E8E4DF] pt-4">
                              <Button 
                                variant={packageType === pkg.id ? "default" : "outline"}
                                className={`w-full ${packageType === pkg.id ? "bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]" : "border-[#E8E4DF] text-[#6E6A66]"}`}
                                onClick={() => setPackageType(pkg.id as "basic" | "premium" | "luxury")}
                              >
                                {packageType === pkg.id ? "Selected" : "Select Package"}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" className="text-[#6E6A66]" onClick={handleBack}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]"
                      >
                        Next: Your Details
                      </Button>
                    </div>
                  </div>
                  
                  {/* Step 3: Contact Information */}
                  <div className={currentStep === 3 ? 'block' : 'hidden'}>
                    <div className="bg-white border border-[#E8E4DF] rounded-card p-6 mb-8 shadow-soft">
                      <h2 className="text-2xl font-semibold mb-6">Step 3: Your Details</h2>
                      <p className="text-[#6E6A66] mb-8">
                        Please provide your contact information to receive your detailed quote.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name"
                            placeholder="Enter your full name" 
                            className="bg-white border-[#E8E4DF] mt-1"
                            value={contactInfo.name}
                            onChange={handleContactInfoChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email"
                            type="email" 
                            placeholder="Enter your email" 
                            className="bg-white border-[#E8E4DF] mt-1" 
                            value={contactInfo.email}
                            onChange={handleContactInfoChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone"
                            placeholder="Enter your phone number" 
                            className="bg-white border-[#E8E4DF] mt-1" 
                            value={contactInfo.phone}
                            onChange={handleContactInfoChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city"
                            placeholder="Enter your city" 
                            className="bg-white border-[#E8E4DF] mt-1" 
                            value={contactInfo.city}
                            onChange={handleContactInfoChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#FAFAF8] rounded-card border border-[#E8E4DF] p-6 mb-8">
                      <h3 className="text-xl font-semibold mb-4">Your Estimate Summary</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-medium mb-2 text-[#1A1A1A]">Selected Rooms</h4>
                          <div className="space-y-2">
                            {roomTypes.map((room) => (
                              selectedRooms[room.id] && (
                                <div key={room.id} className="flex justify-between">
                                  <span className="text-[#6E6A66]">{room.name} ({roomSizes[room.id] || room.minArea} sqft)</span>
                                  <span className="font-medium text-[#1A1A1A]">
                                    {formatCurrency((roomSizes[room.id] || room.minArea) * room.pricePerSqFt[packageType])}
                                  </span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                        
                        <Separator className="bg-[#E8E4DF]" />
                        
                        <div>
                          <h4 className="text-lg font-medium mb-2 text-[#1A1A1A]">Design Package</h4>
                          <div className="flex justify-between">
                            <span className="text-[#6E6A66]">
                              {packageTypes.find(pkg => pkg.id === packageType)?.name} Package
                            </span>
                            <span className="font-medium text-[#8B7355]">
                              Selected
                            </span>
                          </div>
                        </div>
                        
                        <Separator className="bg-[#E8E4DF]" />
                        
                        <div className="pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold text-[#1A1A1A]">Total Estimate</span>
                            <span className="text-xl font-bold text-[#8B7355]">
                              {formatCurrency(totalEstimate)}
                            </span>
                          </div>
                          <p className="text-sm text-[#999] mt-2">
                            * This is an estimate. Final pricing may vary based on detailed measurements and specific requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" className="text-[#6E6A66]" onClick={handleBack}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="bg-[#8B7355] text-black hover:bg-[#6E5A42]"
                        disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone || !contactInfo.city}
                      >
                        Get My Detailed Quote
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* Quote Success View */
                <div className="bg-white border border-[#E8E4DF] rounded-card p-8 text-center shadow-soft">
                  <div className="w-20 h-20 mx-auto bg-[#8B7355]/20 rounded-full flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-[#8B7355]" />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold font-cormorant mb-4 text-[#1A1A1A]">Thank You!</h2>
                  
                  <p className="text-[#6E6A66] text-lg mb-8 max-w-xl mx-auto">
                    We've received your request for a detailed quote. Our design experts will get in touch with you within 24 hours.
                  </p>
                  
                  <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card max-w-md mx-auto mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Your Estimate Summary</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#6E6A66]">Selected Rooms:</span>
                      <span>{getSelectedRoomCount()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#6E6A66]">Design Package:</span>
                      <span>{packageTypes.find(pkg => pkg.id === packageType)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#E8E4DF]">
                      <span className="font-semibold text-[#1A1A1A]">Estimated Total:</span>
                      <span className="font-bold text-[#8B7355]">{formatCurrency(totalEstimate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                      <Download className="mr-2 h-4 w-4" />
                      Download Estimate
                    </Button>
                    <Link href="/">
                      <Button className="bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 bg-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold font-cormorant mb-8 text-center text-[#1A1A1A]">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">How accurate is this estimate?</h3>
                  <p className="text-[#6E6A66]">
                    This calculator provides a ballpark estimate based on standard measurements and quality. For a precise quote, our design consultants will visit your home to take detailed measurements and understand your specific requirements.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">What does the package price include?</h3>
                  <p className="text-[#6E6A66]">
                    The package prices include design consultation, materials, manufacturing, and installation. Additional costs may apply for specific customizations, specialized materials, or structural modifications.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">How long will my project take to complete?</h3>
                  <p className="text-[#6E6A66]">
                    Project timelines vary based on the scope of work. A typical 2-3 bedroom home interior project takes 45-90 days to complete from design approval to installation.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Do you offer any discounts or promotions?</h3>
                  <p className="text-[#6E6A66]">
                    Yes, we run seasonal promotions and offer special discounts for full home interiors. Our design consultants will inform you about ongoing offers during your consultation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold font-cormorant mb-4 text-[#1A1A1A]">
                  Ready to Transform Your Space?
                </h2>
                <p className="text-[#6E6A66]">
                  Book a free consultation with our design experts today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]">
                  <Calculator className="mr-2 h-4 w-4" />
                  Try Other Calculators
                </Button>
                <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                  <Home className="mr-2 h-4 w-4" />
                  Book Home Visit
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
  );
}