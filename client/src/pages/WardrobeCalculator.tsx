import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackCalculatorUse } from "@/lib/analytics";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChevronRight, Check, Calculator, Download, ArrowRight, Ruler, DoorClosed } from "lucide-react";

import pricingData from "@/data/pricing.json";

export default function WardrobeCalculator() {
  const { types, materialGrades, options } = pricingData.wardrobe;
  
  const [selectedType, setSelectedType] = useState<string>("sliding");
  const [wardrobeDimensions, setWardrobeDimensions] = useState({
    width: 6,
    height: 7,
    depth: 2
  });
  const [materialGrade, setMaterialGrade] = useState<"basic" | "premium" | "luxury">("premium");
  const [organizerType, setOrganizerType] = useState<string>("enhanced");
  const [accessoryPackage, setAccessoryPackage] = useState<string>("basic-package");
  const [totalEstimate, setTotalEstimate] = useState<number>(0);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    city: ""
  });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showQuote, setShowQuote] = useState<boolean>(false);
  
  // Calculate total estimate whenever selections change
  useEffect(() => {
    if (!selectedType) return;
    
    const type = types.find(t => t.id === selectedType);
    if (!type) return;
    
    // Calculate area in square feet
    const width = wardrobeDimensions.width;
    const height = wardrobeDimensions.height;
    const totalSqFt = width * height;
    
    // Get base price per square foot
    const grade = materialGrades.find(g => g.id === materialGrade);
    let basePrice = grade ? grade.pricePerSqFt * totalSqFt : 0;
    
    // Apply organizer multiplier
    const organizer = options.internalOrganizers.find(o => o.id === organizerType);
    if (organizer) {
      basePrice *= organizer.priceMultiplier;
    }
    
    // Add accessory costs
    const accessory = options.accessories.find(a => a.id === accessoryPackage);
    const accessoryPrice = accessory ? accessory.price : 0;
    
    setTotalEstimate(basePrice + accessoryPrice);
  }, [selectedType, wardrobeDimensions, materialGrade, organizerType, accessoryPackage]);
  
  const handleDimensionChange = (dimension: 'width' | 'height' | 'depth', value: number) => {
    const type = types.find(t => t.id === selectedType);
    if (!type) return;
    
    // Get min/max constraints based on dimension
    let min = 0, max = 0;
    if (dimension === 'width') {
      min = type.minWidth;
      max = type.maxWidth;
    } else if (dimension === 'height') {
      min = type.minHeight;
      max = type.maxHeight;
    } else {
      min = type.minDepth;
      max = type.maxDepth;
    }
    
    // Ensure the value is within constraints
    const constrainedValue = Math.max(min, Math.min(max, value));
    
    setWardrobeDimensions(prev => ({
      ...prev,
      [dimension]: constrainedValue
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

  const revealQuote = () => {
    setShowQuote(true);
    trackCalculatorUse("wardrobe", totalEstimate);
  };
  
  const submitFormToGoogleSheets = async () => {
    try {
      // Google Script URL - use the same one as other forms
      const scriptURL = "https://script.google.com/macros/s/AKfycbw_CsG5qUH22QoyuPhMUZQ2bGX0GeEz35wHDhNkz8Pyrzajb49AVdEn0i5fA_pTmgEyAA/exec";
      
      // Get the selected type, material grade, and organizer details
      const selectedTypeDetails = types.find(t => t.id === selectedType)?.name || "";
      const materialGradeDetails = materialGrades.find(g => g.id === materialGrade)?.name || "";
      const organizerDetails = options.internalOrganizers.find(o => o.id === organizerType)?.name || "";
      const accessoryDetails = options.accessories.find(a => a.id === accessoryPackage)?.name || "";
      
      // Build dimensions string
      const dimensionsStr = `${wardrobeDimensions.width}ft × ${wardrobeDimensions.height}ft × ${wardrobeDimensions.depth}ft`;
      
      // Build options string
      const optionsStr = `${organizerDetails}, ${accessoryDetails}`;
      
      // Build URL with query parameters
      const url = new URL(scriptURL);
      
      // Add form data as query parameters
      url.searchParams.append("formType", "calculator");
      url.searchParams.append("calculatorType", "wardrobe");
      url.searchParams.append("name", contactInfo.name);
      url.searchParams.append("email", contactInfo.email);
      url.searchParams.append("phone", contactInfo.phone);
      url.searchParams.append("city", contactInfo.city);
      url.searchParams.append("selectedType", selectedTypeDetails);
      url.searchParams.append("dimensions", dimensionsStr);
      url.searchParams.append("materialGrade", materialGradeDetails);
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
          console.log("Calculator form submitted successfully:", xhr.responseText);
          // Show success message by showing the quote
          revealQuote();
        } else {
          console.error("Error submitting calculator form:", xhr.statusText);
          // Still show the quote even if the submission fails
          revealQuote();
        }
      };
      
      xhr.onerror = function() {
        console.error("Network error during form submission");
        // Still show the quote even if there's a network error
        revealQuote();
      };
      
      // Send the request
      xhr.send();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      revealQuote();
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
  
  const wardrobeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the difference between wardrobe types?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sliding door wardrobes save space and work well in smaller rooms. Hinged door wardrobes provide full access but require more clearance space. Walk-in wardrobes offer luxurious open storage for larger areas, while corner wardrobes optimize unused corner spaces.",
        },
      },
      {
        "@type": "Question",
        name: "How long does wardrobe installation take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Installation time varies by wardrobe type and complexity. Standard sliding or hinged wardrobes typically take 1-2 days, while walk-in wardrobes may take 3-5 days for complete installation.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customize my wardrobe design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer complete customization options beyond what's shown in the calculator. Our design consultants will work with you to select colors, finishes, handle designs, and specialized storage components to suit your specific needs.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer a warranty on wardrobes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our wardrobes come with a warranty based on the material grade selected: 2 years for Basic, 5 years for Premium, and 10 years for Luxury options. The warranty covers manufacturing defects and hardware issues.",
        },
      },
    ],
  };
  
  return (
    <PageLayout seo={{ title: "Wardrobe Price Calculator Bengaluru", description: "Estimate a custom wardrobe in Bengaluru by size and finish. FeatherWood designs sliding and walk-in wardrobes for modern homes.", canonical: "/wardrobe-price-calculator", structuredData: wardrobeFaqSchema }}>

        {/* Breadcrumbs */}
        <div className="bg-[#FAFAF8] border-b border-[#E8E4DF] py-4">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex items-center text-sm text-[#6E6A66]">
              <Link href="/">
                <span className="hover:text-[#8B7355] cursor-pointer">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-[#8B7355]">Wardrobe Price Calculator</span>
            </div>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-[#FAFAF8] to-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-cormorant mb-4">
                Wardrobe Price Calculator
              </h1>
              <p className="text-[#6E6A66] text-lg mb-8">
                Estimate the cost of your custom wardrobe with our interactive calculator.
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
                        <span className="text-sm">Wardrobe Type</span>
                      </div>
                      
                      <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-[#8B7355]' : 'bg-[#333]'}`}></div>
                      
                      <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#8B7355]' : 'text-[#666]'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 2 ? 'bg-[#8B7355] text-black' : 'bg-[#333] text-[#666]'}`}>
                          2
                        </div>
                        <span className="text-sm">Materials</span>
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
                  
                  {/* Step 1: Wardrobe Type */}
                  <div className={currentStep === 1 ? 'block' : 'hidden'}>
                    <div className="bg-white border border-[#E8E4DF] rounded-card p-6 mb-8 shadow-soft">
                      <h2 className="text-2xl font-semibold mb-6">Step 1: Choose Your Wardrobe Type</h2>
                      <p className="text-[#6E6A66] mb-8">
                        Select a wardrobe type that best fits your needs and specify the dimensions.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {types.map((type) => (
                          <Card 
                            key={type.id} 
                            className={`bg-[#FAFAF8] border border-[#E8E4DF] overflow-hidden h-full ${selectedType === type.id ? 'ring-2 ring-[#8B7355]' : ''}`}
                            onClick={() => setSelectedType(type.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={type.image} 
                                alt={type.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg text-[#1A1A1A]">{type.name}</CardTitle>
                                <Button 
                                  variant={selectedType === type.id ? "default" : "outline"}
                                  size="sm"
                                  className={selectedType === type.id ? "bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]" : "border-[#E8E4DF] text-[#6E6A66]"}
                                  onClick={() => setSelectedType(type.id)}
                                >
                                  {selectedType === type.id ? "Selected" : "Select"}
                                </Button>
                              </div>
                              <CardDescription className="text-[#6E6A66]">
                                {type.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                      
                      {selectedType && (
                        <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card">
                          <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Wardrobe Dimensions</h3>
                          <p className="text-[#6E6A66] mb-6">
                            Please specify the dimensions of your wardrobe.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="wardrobe-width">Width (feet)</Label>
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1 text-[#8B7355]" />
                                  <span className="font-medium text-[#1A1A1A]">{wardrobeDimensions.width} ft</span>
                                </div>
                              </div>
                              <Slider
                                id="wardrobe-width"
                                value={[wardrobeDimensions.width]}
                                min={types.find(t => t.id === selectedType)?.minWidth || 3}
                                max={types.find(t => t.id === selectedType)?.maxWidth || 15}
                                step={0.5}
                                className="mt-2"
                                onValueChange={(value) => handleDimensionChange('width', value[0])}
                              />
                              <div className="flex justify-between mt-1 text-xs text-[#A29B93]">
                                <span>{types.find(t => t.id === selectedType)?.minWidth || 3} ft</span>
                                <span>{types.find(t => t.id === selectedType)?.maxWidth || 15} ft</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="wardrobe-height">Height (feet)</Label>
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1 text-[#8B7355]" />
                                  <span className="font-medium text-[#1A1A1A]">{wardrobeDimensions.height} ft</span>
                                </div>
                              </div>
                              <Slider
                                id="wardrobe-height"
                                value={[wardrobeDimensions.height]}
                                min={types.find(t => t.id === selectedType)?.minHeight || 6}
                                max={types.find(t => t.id === selectedType)?.maxHeight || 9}
                                step={0.5}
                                className="mt-2"
                                onValueChange={(value) => handleDimensionChange('height', value[0])}
                              />
                              <div className="flex justify-between mt-1 text-xs text-[#A29B93]">
                                <span>{types.find(t => t.id === selectedType)?.minHeight || 6} ft</span>
                                <span>{types.find(t => t.id === selectedType)?.maxHeight || 9} ft</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="wardrobe-depth">Depth (feet)</Label>
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1 text-[#8B7355]" />
                                  <span className="font-medium text-[#1A1A1A]">{wardrobeDimensions.depth} ft</span>
                                </div>
                              </div>
                              <Slider
                                id="wardrobe-depth"
                                value={[wardrobeDimensions.depth]}
                                min={types.find(t => t.id === selectedType)?.minDepth || 1.5}
                                max={types.find(t => t.id === selectedType)?.maxDepth || 2.5}
                                step={0.1}
                                className="mt-2"
                                onValueChange={(value) => handleDimensionChange('depth', value[0])}
                              />
                              <div className="flex justify-between mt-1 text-xs text-[#A29B93]">
                                <span>{types.find(t => t.id === selectedType)?.minDepth || 1.5} ft</span>
                                <span>{types.find(t => t.id === selectedType)?.maxDepth || 2.5} ft</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 p-4 bg-[#FAFAF8] rounded-card border border-[#E8E4DF]">
                            <h4 className="text-lg font-medium mb-2 text-[#1A1A1A]">Wardrobe Area</h4>
                            <div className="flex items-center">
                              <span className="text-[#6E6A66]">Total surface area:</span>
                              <span className="ml-auto font-semibold text-[#8B7355]">
                                {wardrobeDimensions.width * wardrobeDimensions.height} sq.ft.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" className="text-[#6E6A66]" disabled>
                        Back
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]"
                        disabled={!selectedType}
                      >
                        Next: Choose Materials
                      </Button>
                    </div>
                  </div>
                  
                  {/* Step 2: Materials Selection */}
                  <div className={currentStep === 2 ? 'block' : 'hidden'}>
                    <div className="bg-white border border-[#E8E4DF] rounded-card p-6 mb-8 shadow-soft">
                      <h2 className="text-2xl font-semibold mb-6">Step 2: Choose Materials and Features</h2>
                      <p className="text-[#6E6A66] mb-8">
                        Select the materials, finishes, and organization features for your wardrobe.
                      </p>
                      
                      <div className="space-y-8">
                        {/* Material Grade Selection */}
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Material Grade</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {materialGrades.map((grade) => (
                              <Card 
                                key={grade.id} 
                                className={`bg-[#FAFAF8] border border-[#E8E4DF] h-full ${materialGrade === grade.id ? 'ring-2 ring-[#8B7355]' : ''}`}
                                onClick={() => setMaterialGrade(grade.id as "basic" | "premium" | "luxury")}
                                style={{ cursor: 'pointer' }}
                              >
                                <CardHeader className="pb-2">
                                  <div 
                                    className="w-full h-1.5 rounded-full mb-3"
                                    style={{ backgroundColor: grade.color }}
                                  ></div>
                                  <CardTitle className="text-lg text-[#1A1A1A]">{grade.name}</CardTitle>
                                  <CardDescription className="text-[#6E6A66]">
                                    {grade.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2 mt-2">
                                    {grade.features.map((feature, index) => (
                                      <li key={index} className="flex items-start">
                                        <Check className="h-5 w-5 text-[#8B7355] flex-shrink-0 mr-2 mt-0.5" />
                                        <span className="text-sm text-[#6E6A66]">{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                                <CardFooter className="border-t border-[#E8E4DF] pt-4">
                                  <Button 
                                    variant={materialGrade === grade.id ? "default" : "outline"}
                                    className={`w-full ${materialGrade === grade.id ? "bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]" : "border-[#E8E4DF] text-[#6E6A66]"}`}
                                    onClick={() => setMaterialGrade(grade.id as "basic" | "premium" | "luxury")}
                                  >
                                    {materialGrade === grade.id ? "Selected" : "Select Grade"}
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        {/* Internal Organization Selection */}
                        <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card">
                          <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Internal Organization</h3>
                          <RadioGroup defaultValue={organizerType} onValueChange={setOrganizerType}>
                            <div className="space-y-4">
                              {options.internalOrganizers.map((organizer) => (
                                <div 
                                  key={organizer.id}
                                  className={`flex items-center p-4 rounded-md border ${organizerType === organizer.id ? 'border-[#8B7355] bg-[#8B7355]/10' : 'border-[#E8E4DF] bg-white'}`}
                                >
                                  <RadioGroupItem 
                                    value={organizer.id} 
                                    id={`organizer-${organizer.id}`}
                                    className="text-[#8B7355] border-[#E8E4DF]"
                                  />
                                  <div className="ml-3 flex-1">
                                    <Label 
                                      htmlFor={`organizer-${organizer.id}`}
                                      className="font-medium block cursor-pointer"
                                    >
                                      {organizer.name}
                                    </Label>
                                    <span className="text-xs text-[#6E6A66] block mt-1">
                                      {organizer.description}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-[#1A1A1A]">
                                    {organizerType === organizer.id ? "Selected" : organizer.priceMultiplier > 1 
                                      ? `+${Math.round((organizer.priceMultiplier - 1) * 100)}%` 
                                      : 'Standard'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Accessories Selection */}
                        <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card">
                          <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Accessories</h3>
                          <RadioGroup defaultValue={accessoryPackage} onValueChange={setAccessoryPackage}>
                            <div className="space-y-4">
                              {options.accessories.map((accessory) => (
                                <div 
                                  key={accessory.id}
                                  className={`flex items-center p-4 rounded-md border ${accessoryPackage === accessory.id ? 'border-[#8B7355] bg-[#8B7355]/10' : 'border-[#E8E4DF] bg-white'}`}
                                >
                                  <RadioGroupItem 
                                    value={accessory.id} 
                                    id={`accessory-${accessory.id}`}
                                    className="text-[#8B7355] border-[#E8E4DF]"
                                  />
                                  <Label 
                                    htmlFor={`accessory-${accessory.id}`}
                                    className="ml-3 flex-1 cursor-pointer"
                                  >
                                    <span className="font-medium block">{accessory.name}</span>
                                    <span className="text-xs text-[#A29B93] block mt-1">
                                      {accessoryPackage === accessory.id ? "Selected" : "Click to select"}
                                    </span>
                                  </Label>
                                  <span className="text-sm font-medium text-[#1A1A1A]">
                                    {accessory.price > 0 
                                      ? formatCurrency(accessory.price) 
                                      : 'No Cost'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
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
                      <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Your Estimate Summary</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Wardrobe Type</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {types.find(t => t.id === selectedType)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Dimensions</span>
                          <span className="font-medium">
                            {wardrobeDimensions.width}ft × {wardrobeDimensions.height}ft × {wardrobeDimensions.depth}ft
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Surface Area</span>
                          <span className="font-medium">
                            {wardrobeDimensions.width * wardrobeDimensions.height} sq.ft.
                          </span>
                        </div>
                        
                        <Separator className="bg-[#333]" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Material Grade</span>
                          <span className="font-medium">
                            {materialGrades.find(g => g.id === materialGrade)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Internal Organization</span>
                          <span className="font-medium">
                            {options.internalOrganizers.find(o => o.id === organizerType)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Accessories</span>
                          <span className="font-medium">
                            {options.accessories.find(a => a.id === accessoryPackage)?.name}
                            {" "}
                            {accessoryPackage !== 'none' && (
                              <span className="text-sm text-[#999]">
                                ({formatCurrency(options.accessories.find(a => a.id === accessoryPackage)?.price || 0)})
                              </span>
                            )}
                          </span>
                        </div>
                        
                        <Separator className="bg-[#333]" />
                        
                        <div className="pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">Total Estimate</span>
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
                    We've received your request for a detailed wardrobe quote. Our design experts will get in touch with you within 24 hours.
                  </p>
                  
                  <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card max-w-md mx-auto mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Your Wardrobe Estimate</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#6E6A66]">Type:</span>
                      <span className="text-[#1A1A1A]">{types.find(t => t.id === selectedType)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#6E6A66]">Material Grade:</span>
                      <span className="text-[#1A1A1A]">{materialGrades.find(g => g.id === materialGrade)?.name}</span>
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
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">What's the difference between wardrobe types?</h3>
                  <p className="text-[#6E6A66]">
                    Sliding door wardrobes save space and work well in smaller rooms. Hinged door wardrobes provide full access but require more clearance space. Walk-in wardrobes offer luxurious open storage for larger areas, while corner wardrobes optimize unused corner spaces.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">How long does wardrobe installation take?</h3>
                  <p className="text-[#6E6A66]">
                    Installation time varies by wardrobe type and complexity. Standard sliding or hinged wardrobes typically take 1-2 days, while walk-in wardrobes may take 3-5 days for complete installation.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Can I customize my wardrobe design?</h3>
                  <p className="text-[#6E6A66]">
                    Yes, we offer complete customization options beyond what's shown in the calculator. Our design consultants will work with you to select colors, finishes, handle designs, and specialized storage components to suit your specific needs.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Do you offer a warranty on wardrobes?</h3>
                  <p className="text-[#6E6A66]">
                    Yes, our wardrobes come with a warranty based on the material grade selected: 2 years for Basic, 5 years for Premium, and 10 years for Luxury options. The warranty covers manufacturing defects and hardware issues.
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
                  Ready for Your Perfect Wardrobe?
                </h2>
                <p className="text-[#6E6A66]">
                  Book a free consultation with our wardrobe design experts today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]">
                  <Calculator className="mr-2 h-4 w-4" />
                  Try Other Calculators
                </Button>
                <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                  <DoorClosed className="mr-2 h-4 w-4" />
                  View Wardrobe Designs
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
  );
}