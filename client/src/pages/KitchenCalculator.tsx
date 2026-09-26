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
import { ChevronRight, Utensils, Check, Calculator, Download, ArrowRight, Ruler } from "lucide-react";

import pricingData from "@/data/pricing.json";

export default function KitchenCalculator() {
  const { layouts, materialGrades, options } = pricingData.kitchen;
  
  const [selectedLayout, setSelectedLayout] = useState<string>("l-shaped");
  const [kitchenDimensions, setKitchenDimensions] = useState({
    width: 10,
    depth: 2.5
  });
  const [materialGrade, setMaterialGrade] = useState<"basic" | "premium" | "luxury">("premium");
  const [countertopType, setCountertopType] = useState<string>("granite");
  const [appliancePackage, setAppliancePackage] = useState<string>("standard-package");
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
    if (!selectedLayout) return;
    
    const layout = layouts.find(l => l.id === selectedLayout);
    if (!layout) return;
    
    // Calculate cabinet units based on dimensions
    const width = kitchenDimensions.width;
    const depth = kitchenDimensions.depth;
    
    let unitCount = 0;
    
    // Calculate unit count based on layout type
    switch (selectedLayout) {
      case "straight":
        unitCount = Math.ceil(width / 2); // 1 unit every 2 feet
        break;
      case "l-shaped":
        unitCount = Math.ceil((width * 1.5) / 2); // 1.5x the width for L-shape
        break;
      case "u-shaped":
        unitCount = Math.ceil((width * 2) / 2); // 2x the width for U-shape
        break;
      case "parallel":
        unitCount = Math.ceil((width * 2) / 2); // 2x the width for parallel
        break;
      case "island":
        unitCount = Math.ceil((width * 2.2) / 2); // 2.2x the width for island
        break;
      case "peninsula":
        unitCount = Math.ceil((width * 1.8) / 2); // 1.8x the width for peninsula
        break;
      default:
        unitCount = Math.ceil(width / 2);
    }
    
    // Get base price per unit
    const grade = materialGrades.find(g => g.id === materialGrade);
    let basePrice = grade ? grade.pricePerUnit * unitCount : 0;
    
    // Apply countertop multiplier
    const countertop = options.countertops.find(c => c.id === countertopType);
    if (countertop) {
      basePrice *= countertop.priceMultiplier[materialGrade];
    }
    
    // Add appliance costs
    const appliance = options.appliances.find(a => a.id === appliancePackage);
    const appliancePrice = appliance ? appliance.price : 0;
    
    setTotalEstimate(basePrice + appliancePrice);
  }, [selectedLayout, kitchenDimensions, materialGrade, countertopType, appliancePackage]);
  
  const handleDimensionChange = (dimension: 'width' | 'depth', value: number) => {
    const layout = layouts.find(l => l.id === selectedLayout);
    if (!layout) return;
    
    // Ensure the value is within min/max constraints
    const constrainedValue = dimension === 'width' 
      ? Math.max(layout.minWidth, Math.min(layout.maxWidth, value))
      : Math.max(layout.minDepth, Math.min(layout.maxDepth, value));
    
    setKitchenDimensions(prev => ({
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
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const revealQuote = () => {
    setShowQuote(true);
    trackCalculatorUse("kitchen", totalEstimate);
  };
  
  const submitFormToGoogleSheets = async () => {
    try {
      // Google Script URL - use the same one as other forms
      const scriptURL = "https://script.google.com/macros/s/AKfycbw_CsG5qUH22QoyuPhMUZQ2bGX0GeEz35wHDhNkz8Pyrzajb49AVdEn0i5fA_pTmgEyAA/exec";
      
      // Get the selected layout, material grade, and appliance details
      const selectedLayoutDetails = layouts.find(l => l.id === selectedLayout)?.name || "";
      const cabinetMaterialDetails = materialGrades.find(g => g.id === materialGrade)?.name || "";
      const countertopMaterialDetails = options.countertops.find(c => c.id === countertopType)?.name || "";
      const appliancePackageDetails = options.appliances.find(a => a.id === appliancePackage)?.name || "";
      
      // Build dimensions string
      const dimensionsStr = `${kitchenDimensions.width}ft × ${kitchenDimensions.depth}ft`;
      
      // Build options string
      const optionsStr = `Cabinet: ${cabinetMaterialDetails}, Countertop: ${countertopMaterialDetails}, Appliances: ${appliancePackageDetails}`;
      
      // Build URL with query parameters
      const url = new URL(scriptURL);
      
      // Add form data as query parameters
      url.searchParams.append("formType", "calculator");
      url.searchParams.append("calculatorType", "kitchen");
      url.searchParams.append("name", contactInfo.name);
      url.searchParams.append("email", contactInfo.email);
      url.searchParams.append("phone", contactInfo.phone);
      url.searchParams.append("city", contactInfo.city);
      url.searchParams.append("selectedType", selectedLayoutDetails);
      url.searchParams.append("dimensions", dimensionsStr);
      url.searchParams.append("materialGrade", cabinetMaterialDetails);
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
          console.log("Kitchen calculator form submitted successfully:", xhr.responseText);
          // Show success message by showing the quote
          revealQuote();
        } else {
          console.error("Error submitting kitchen calculator form:", xhr.statusText);
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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const kitchenFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a modular kitchen cost in Bengaluru?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Modular kitchen costs in Bengaluru typically start from ₹1.5 lakh for a basic layout and can go up to ₹8 lakh+ for luxury finishes. Our calculator gives you an instant estimate based on your layout, size, and material choices.",
        },
      },
      {
        "@type": "Question",
        name: "What factors affect kitchen interior design costs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our calculator estimates costs based on your layout type, dimensions, material quality, countertop selection, and appliance package. Prices are calculated per unit of cabinetry needed for your kitchen layout.",
        },
      },
      {
        "@type": "Question",
        name: "Does FeatherWood offer installation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, FeatherWood provides end-to-end modular kitchen installation including plumbing, electrical work, cabinet fitting, and finishing. Installation typically takes 7-14 days depending on complexity.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customise the finish and materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. You can choose from multiple material grades, countertop options, and hardware finishes. Our design consultants will help you select the perfect combination for your home and budget.",
        },
      },
    ],
  };
  
  return (
    <PageLayout seo={{ title: "Kitchen Price Calculator", description: "Estimate the cost of your modular kitchen with FeatherWood's calculator.", canonical: "/calculator/kitchen" }}>

        {/* Breadcrumbs */}
        <div className="bg-[#FAFAF8] border-b border-[#E8E4DF] py-4">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="flex items-center text-sm text-[#6E6A66]">
              <Link href="/">
                <span className="hover:text-[#8B7355] cursor-pointer">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-[#8B7355]">Kitchen Price Calculator</span>
            </div>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-[#FAFAF8] to-[#FAFAF8]">
          <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-cormorant mb-4">
                Kitchen Price Calculator
              </h1>
              <p className="text-[#6E6A66] text-lg mb-8">
                Estimate the cost of your dream kitchen with our interactive calculator.
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
                        <span className="text-sm">Kitchen Layout</span>
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
                  
                  {/* Step 1: Kitchen Layout */}
                  <div className={currentStep === 1 ? 'block' : 'hidden'}>
                    <div className="bg-white border border-[#E8E4DF] rounded-card p-6 mb-8 shadow-soft">
                      <h2 className="text-2xl font-semibold mb-6">Step 1: Choose Your Kitchen Layout</h2>
                      <p className="text-[#6E6A66] mb-8">
                        Select a layout that best fits your space and specify the dimensions.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {layouts.map((layout) => (
                          <Card 
                            key={layout.id} 
                            className={`bg-[#FAFAF8] border border-[#E8E4DF] overflow-hidden h-full ${selectedLayout === layout.id ? 'ring-2 ring-[#8B7355]' : ''}`}
                            onClick={() => setSelectedLayout(layout.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={layout.image} 
                                alt={layout.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg text-[#1A1A1A]">{layout.name}</CardTitle>
                                <Button 
                                  variant={selectedLayout === layout.id ? "default" : "outline"}
                                  size="sm"
                                  className={selectedLayout === layout.id ? "bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]" : "border-[#E8E4DF] text-[#6E6A66]"}
                                  onClick={() => setSelectedLayout(layout.id)}
                                >
                                  {selectedLayout === layout.id ? "Selected" : "Select"}
                                </Button>
                              </div>
                              <CardDescription className="text-[#6E6A66]">
                                {layout.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                      
                      {selectedLayout && (
                        <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card">
                          <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Kitchen Dimensions</h3>
                          <p className="text-[#6E6A66] mb-6">
                            Please specify the dimensions of your kitchen.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="kitchen-width">Width (feet)</Label>
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1 text-[#8B7355]" />
                                  <span className="font-medium text-[#1A1A1A]">{kitchenDimensions.width} ft</span>
                                </div>
                              </div>
                              <Slider
                                id="kitchen-width"
                                value={[kitchenDimensions.width]}
                                min={layouts.find(l => l.id === selectedLayout)?.minWidth || 5}
                                max={layouts.find(l => l.id === selectedLayout)?.maxWidth || 20}
                                step={0.5}
                                className="mt-2"
                                onValueChange={(value) => handleDimensionChange('width', value[0])}
                              />
                              <div className="flex justify-between mt-1 text-xs text-[#A29B93]">
                                <span>{layouts.find(l => l.id === selectedLayout)?.minWidth || 5} ft</span>
                                <span>{layouts.find(l => l.id === selectedLayout)?.maxWidth || 20} ft</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="kitchen-depth">Depth (feet)</Label>
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1 text-[#8B7355]" />
                                  <span className="font-medium text-[#1A1A1A]">{kitchenDimensions.depth} ft</span>
                                </div>
                              </div>
                              <Slider
                                id="kitchen-depth"
                                value={[kitchenDimensions.depth]}
                                min={layouts.find(l => l.id === selectedLayout)?.minDepth || 2}
                                max={layouts.find(l => l.id === selectedLayout)?.maxDepth || 4}
                                step={0.1}
                                className="mt-2"
                                onValueChange={(value) => handleDimensionChange('depth', value[0])}
                              />
                              <div className="flex justify-between mt-1 text-xs text-[#A29B93]">
                                <span>{layouts.find(l => l.id === selectedLayout)?.minDepth || 2} ft</span>
                                <span>{layouts.find(l => l.id === selectedLayout)?.maxDepth || 4} ft</span>
                              </div>
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
                        disabled={!selectedLayout}
                      >
                        Next: Choose Materials
                      </Button>
                    </div>
                  </div>
                  
                  {/* Step 2: Materials Selection */}
                  <div className={currentStep === 2 ? 'block' : 'hidden'}>
                    <div className="bg-white border border-[#E8E4DF] rounded-card p-6 mb-8 shadow-soft">
                      <h2 className="text-2xl font-semibold mb-6">Step 2: Choose Materials and Finishes</h2>
                      <p className="text-[#6E6A66] mb-8">
                        Select the materials and finishes for your kitchen.
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
                        
                        {/* Countertop Selection */}
                        <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card">
                          <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Countertop Material</h3>
                          <RadioGroup defaultValue={countertopType} onValueChange={setCountertopType}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {options.countertops.map((countertop) => (
                                <div 
                                  key={countertop.id}
                                  className={`flex items-center p-4 rounded-md border ${countertopType === countertop.id ? 'border-[#8B7355] bg-[#8B7355]/10' : 'border-[#E8E4DF] bg-white'}`}
                                >
                                  <RadioGroupItem 
                                    value={countertop.id} 
                                    id={`countertop-${countertop.id}`}
                                    className="text-[#8B7355] border-[#E8E4DF]"
                                  />
                                  <Label 
                                    htmlFor={`countertop-${countertop.id}`}
                                    className="ml-3 flex-1 cursor-pointer"
                                  >
                                    <span className="font-medium block text-[#1A1A1A]">{countertop.name}</span>
                                    <span className="text-xs text-[#A29B93] block mt-1">
                                      {countertopType === countertop.id ? "Selected" : "Click to select"}
                                    </span>
                                  </Label>
                                  <span className="text-sm font-medium text-[#1A1A1A]">
                                    {countertop.priceMultiplier[materialGrade] > 1 
                                      ? `+${Math.round((countertop.priceMultiplier[materialGrade] - 1) * 100)}%` 
                                      : 'Standard'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {/* Appliance Selection */}
                        <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card">
                          <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Appliance Package</h3>
                          <RadioGroup defaultValue={appliancePackage} onValueChange={setAppliancePackage}>
                            <div className="space-y-4">
                              {options.appliances.map((appliance) => (
                                <div 
                                  key={appliance.id}
                                  className={`flex items-center p-4 rounded-md border ${appliancePackage === appliance.id ? 'border-[#8B7355] bg-[#8B7355]/10' : 'border-[#E8E4DF] bg-white'}`}
                                >
                                  <RadioGroupItem 
                                    value={appliance.id} 
                                    id={`appliance-${appliance.id}`}
                                    className="text-[#8B7355] border-[#E8E4DF]"
                                  />
                                  <Label 
                                    htmlFor={`appliance-${appliance.id}`}
                                    className="ml-3 flex-1 cursor-pointer"
                                  >
                                    <span className="font-medium block text-[#1A1A1A]">{appliance.name}</span>
                                    <span className="text-xs text-[#A29B93] block mt-1">
                                      {appliancePackage === appliance.id ? "Selected" : "Click to select"}
                                    </span>
                                  </Label>
                                  <span className="text-sm font-medium text-[#1A1A1A]">
                                    {appliance.price > 0 
                                      ? formatCurrency(appliance.price) 
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
                          <span className="text-[#6E6A66]">Kitchen Layout</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {layouts.find(l => l.id === selectedLayout)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Dimensions</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {kitchenDimensions.width}ft × {kitchenDimensions.depth}ft
                          </span>
                        </div>
                        
                        <Separator className="bg-[#E8E4DF]" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Material Grade</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {materialGrades.find(g => g.id === materialGrade)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Countertop</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {options.countertops.find(c => c.id === countertopType)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#6E6A66]">Appliance Package</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {options.appliances.find(a => a.id === appliancePackage)?.name}
                            {" "}
                            {appliancePackage !== 'none' && (
                              <span className="text-sm text-[#A29B93]">
                                ({formatCurrency(options.appliances.find(a => a.id === appliancePackage)?.price || 0)})
                              </span>
                            )}
                          </span>
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
                        className="bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]"
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
                  
                  <h2 className="text-2xl md:text-3xl font-bold font-cormorant mb-4">Thank You!</h2>
                  
                  <p className="text-[#6E6A66] text-lg mb-8 max-w-xl mx-auto">
                    We've received your request for a detailed kitchen quote. Our design experts will get in touch with you within 24 hours.
                  </p>
                  
                  <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-6 rounded-card max-w-md mx-auto mb-8">
                    <h3 className="text-xl font-semibold mb-4">Your Kitchen Estimate</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#6E6A66]">Layout:</span>
                      <span>{layouts.find(l => l.id === selectedLayout)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#6E6A66]">Material Grade:</span>
                      <span>{materialGrades.find(g => g.id === materialGrade)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#E8E4DF]">
                      <span className="font-semibold">Estimated Total:</span>
                      <span className="font-bold text-[#8B7355]">{formatCurrency(totalEstimate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                      <Download className="mr-2 h-4 w-4" />
                      Download Estimate
                    </Button>
                    <Link href="/">
                      <Button className="bg-[#8B7355] text-black hover:bg-[#6E5A42]">
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
              <h2 className="text-2xl md:text-3xl font-bold font-cormorant mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">How much does a modular kitchen cost in Bengaluru?</h3>
                  <p className="text-[#6E6A66]">
                    Modular kitchen costs in Bengaluru typically start from ₹1.5 lakh for a basic layout and can go up to ₹8 lakh+ for luxury finishes. Our calculator gives you an instant estimate based on your layout, size, and material choices.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">What factors affect kitchen interior design costs?</h3>
                  <p className="text-[#6E6A66]">
                    Our calculator estimates costs based on your layout type, dimensions, material quality, countertop selection, and appliance package. Prices are calculated per unit of cabinetry needed for your kitchen layout.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Does FeatherWood offer installation?</h3>
                  <p className="text-[#6E6A66]">
                    Yes, FeatherWood provides end-to-end modular kitchen installation including plumbing, electrical work, cabinet fitting, and finishing. Installation typically takes 7-14 days depending on complexity.
                  </p>
                </div>
                
                <div className="bg-white border border-[#E8E4DF] p-6 rounded-card">
                  <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">Can I customise the finish and materials?</h3>
                  <p className="text-[#6E6A66]">
                    Absolutely. You can choose from multiple material grades, countertop options, and hardware finishes. Our design consultants will help you select the perfect combination for your home and budget.
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
                  Ready for Your Dream Kitchen?
                </h2>
                <p className="text-[#6E6A66]">
                  Book a free consultation with our kitchen design experts today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#8B7355] text-[#1A1A1A] hover:bg-[#6E5A42]">
                  <Calculator className="mr-2 h-4 w-4" />
                  Try Other Calculators
                </Button>
                <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                  <Utensils className="mr-2 h-4 w-4" />
                  View Kitchen Designs
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
  );
}