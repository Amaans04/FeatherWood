import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
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
          setShowQuote(true);
        } else {
          console.error("Error submitting kitchen calculator form:", xhr.statusText);
          // Still show the quote even if the submission fails
          setShowQuote(true);
        }
      };
      
      xhr.onerror = function() {
        console.error("Network error during form submission");
        // Still show the quote even if there's a network error
        setShowQuote(true);
      };
      
      // Send the request
      xhr.send();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      // Still show the quote even if there's an error
      setShowQuote(true);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <>
      <Helmet>
        <title>Kitchen Price Calculator | FeatherWood</title>
        <meta name="description" content="Calculate the estimated cost of your kitchen renovation project with our easy-to-use online calculator." />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#0A0A0A]">
        {/* Breadcrumbs */}
        <div className="bg-[#121212] py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-[#C4C4C4]">
              <Link href="/">
                <span className="hover:text-[#FFD700] cursor-pointer">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-[#FFD700]">Kitchen Price Calculator</span>
            </div>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-[#151515] to-[#0A0A0A]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-4">
                Kitchen Price Calculator
              </h1>
              <p className="text-[#C4C4C4] text-lg mb-8">
                Estimate the cost of your dream kitchen with our interactive calculator.
              </p>
            </div>
          </div>
        </section>
        
        {/* Calculator Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              
              {!showQuote ? (
                <>
                  {/* Progress Indicator */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                      <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#FFD700]' : 'text-[#666]'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 1 ? 'bg-[#FFD700] text-black' : 'bg-[#333] text-[#666]'}`}>
                          1
                        </div>
                        <span className="text-sm">Kitchen Layout</span>
                      </div>
                      
                      <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-[#FFD700]' : 'bg-[#333]'}`}></div>
                      
                      <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#FFD700]' : 'text-[#666]'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 2 ? 'bg-[#FFD700] text-black' : 'bg-[#333] text-[#666]'}`}>
                          2
                        </div>
                        <span className="text-sm">Materials</span>
                      </div>
                      
                      <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-[#FFD700]' : 'bg-[#333]'}`}></div>
                      
                      <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#FFD700]' : 'text-[#666]'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 3 ? 'bg-[#FFD700] text-black' : 'bg-[#333] text-[#666]'}`}>
                          3
                        </div>
                        <span className="text-sm">Your Details</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 1: Kitchen Layout */}
                  <div className={currentStep === 1 ? 'block' : 'hidden'}>
                    <div className="bg-[#151515] rounded-md p-6 mb-8">
                      <h2 className="text-2xl font-semibold mb-6">Step 1: Choose Your Kitchen Layout</h2>
                      <p className="text-[#C4C4C4] mb-8">
                        Select a layout that best fits your space and specify the dimensions.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {layouts.map((layout) => (
                          <Card 
                            key={layout.id} 
                            className={`bg-[#222] border-[#333] overflow-hidden h-full ${selectedLayout === layout.id ? 'ring-2 ring-[#FFD700]' : ''}`}
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
                                <CardTitle className="text-lg">{layout.name}</CardTitle>
                                <Button 
                                  variant={selectedLayout === layout.id ? "default" : "outline"}
                                  size="sm"
                                  className={selectedLayout === layout.id ? "bg-[#FFD700] text-black hover:bg-[#E5C100]" : "border-[#444]"}
                                  onClick={() => setSelectedLayout(layout.id)}
                                >
                                  {selectedLayout === layout.id ? "Selected" : "Select"}
                                </Button>
                              </div>
                              <CardDescription className="text-[#C4C4C4]">
                                {layout.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                      
                      {selectedLayout && (
                        <div className="bg-[#222] p-6 rounded-md">
                          <h3 className="text-xl font-semibold mb-4">Kitchen Dimensions</h3>
                          <p className="text-[#C4C4C4] mb-6">
                            Please specify the dimensions of your kitchen.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="kitchen-width">Width (feet)</Label>
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1 text-[#FFD700]" />
                                  <span className="font-medium">{kitchenDimensions.width} ft</span>
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
                              <div className="flex justify-between mt-1 text-xs text-[#999]">
                                <span>{layouts.find(l => l.id === selectedLayout)?.minWidth || 5} ft</span>
                                <span>{layouts.find(l => l.id === selectedLayout)?.maxWidth || 20} ft</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="kitchen-depth">Depth (feet)</Label>
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1 text-[#FFD700]" />
                                  <span className="font-medium">{kitchenDimensions.depth} ft</span>
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
                              <div className="flex justify-between mt-1 text-xs text-[#999]">
                                <span>{layouts.find(l => l.id === selectedLayout)?.minDepth || 2} ft</span>
                                <span>{layouts.find(l => l.id === selectedLayout)?.maxDepth || 4} ft</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" className="text-[#C4C4C4]" disabled>
                        Back
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="bg-[#FFD700] text-black hover:bg-[#E5C100]"
                        disabled={!selectedLayout}
                      >
                        Next: Choose Materials
                      </Button>
                    </div>
                  </div>
                  
                  {/* Step 2: Materials Selection */}
                  <div className={currentStep === 2 ? 'block' : 'hidden'}>
                    <div className="bg-[#151515] rounded-md p-6 mb-8">
                      <h2 className="text-2xl font-semibold mb-6">Step 2: Choose Materials and Finishes</h2>
                      <p className="text-[#C4C4C4] mb-8">
                        Select the materials and finishes for your kitchen.
                      </p>
                      
                      <div className="space-y-8">
                        {/* Material Grade Selection */}
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Material Grade</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {materialGrades.map((grade) => (
                              <Card 
                                key={grade.id} 
                                className={`bg-[#222] border-[#333] h-full ${materialGrade === grade.id ? 'ring-2 ring-[#FFD700]' : ''}`}
                                onClick={() => setMaterialGrade(grade.id as "basic" | "premium" | "luxury")}
                                style={{ cursor: 'pointer' }}
                              >
                                <CardHeader className="pb-2">
                                  <div 
                                    className="w-full h-1.5 rounded-full mb-3"
                                    style={{ backgroundColor: grade.color }}
                                  ></div>
                                  <CardTitle className="text-lg">{grade.name}</CardTitle>
                                  <CardDescription className="text-[#C4C4C4]">
                                    {grade.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2 mt-2">
                                    {grade.features.map((feature, index) => (
                                      <li key={index} className="flex items-start">
                                        <Check className="h-5 w-5 text-[#FFD700] flex-shrink-0 mr-2 mt-0.5" />
                                        <span className="text-sm text-[#C4C4C4]">{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                                <CardFooter className="border-t border-[#333] pt-4">
                                  <Button 
                                    variant={materialGrade === grade.id ? "default" : "outline"}
                                    className={`w-full ${materialGrade === grade.id ? "bg-[#FFD700] text-black hover:bg-[#E5C100]" : "border-[#444]"}`}
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
                        <div className="bg-[#222] p-6 rounded-md">
                          <h3 className="text-xl font-semibold mb-4">Countertop Material</h3>
                          <RadioGroup defaultValue={countertopType} onValueChange={setCountertopType}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {options.countertops.map((countertop) => (
                                <div 
                                  key={countertop.id}
                                  className={`flex items-center p-4 rounded-md border ${countertopType === countertop.id ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-[#333] bg-[#1A1A1A]'}`}
                                >
                                  <RadioGroupItem 
                                    value={countertop.id} 
                                    id={`countertop-${countertop.id}`}
                                    className="text-[#FFD700] border-[#444]"
                                  />
                                  <Label 
                                    htmlFor={`countertop-${countertop.id}`}
                                    className="ml-3 flex-1 cursor-pointer"
                                  >
                                    <span className="font-medium block">{countertop.name}</span>
                                    <span className="text-xs text-[#999] block mt-1">
                                      {countertopType === countertop.id ? "Selected" : "Click to select"}
                                    </span>
                                  </Label>
                                  <span className="text-sm font-medium">
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
                        <div className="bg-[#222] p-6 rounded-md">
                          <h3 className="text-xl font-semibold mb-4">Appliance Package</h3>
                          <RadioGroup defaultValue={appliancePackage} onValueChange={setAppliancePackage}>
                            <div className="space-y-4">
                              {options.appliances.map((appliance) => (
                                <div 
                                  key={appliance.id}
                                  className={`flex items-center p-4 rounded-md border ${appliancePackage === appliance.id ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-[#333] bg-[#1A1A1A]'}`}
                                >
                                  <RadioGroupItem 
                                    value={appliance.id} 
                                    id={`appliance-${appliance.id}`}
                                    className="text-[#FFD700] border-[#444]"
                                  />
                                  <Label 
                                    htmlFor={`appliance-${appliance.id}`}
                                    className="ml-3 flex-1 cursor-pointer"
                                  >
                                    <span className="font-medium block">{appliance.name}</span>
                                    <span className="text-xs text-[#999] block mt-1">
                                      {appliancePackage === appliance.id ? "Selected" : "Click to select"}
                                    </span>
                                  </Label>
                                  <span className="text-sm font-medium">
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
                      <Button variant="ghost" className="text-[#C4C4C4]" onClick={handleBack}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="bg-[#FFD700] text-black hover:bg-[#E5C100]"
                      >
                        Next: Your Details
                      </Button>
                    </div>
                  </div>
                  
                  {/* Step 3: Contact Information */}
                  <div className={currentStep === 3 ? 'block' : 'hidden'}>
                    <div className="bg-[#151515] rounded-md p-6 mb-8">
                      <h2 className="text-2xl font-semibold mb-6">Step 3: Your Details</h2>
                      <p className="text-[#C4C4C4] mb-8">
                        Please provide your contact information to receive your detailed quote.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name"
                            placeholder="Enter your full name" 
                            className="bg-[#222] border-[#444] mt-1"
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
                            className="bg-[#222] border-[#444] mt-1" 
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
                            className="bg-[#222] border-[#444] mt-1" 
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
                            className="bg-[#222] border-[#444] mt-1" 
                            value={contactInfo.city}
                            onChange={handleContactInfoChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#222] rounded-md p-6 mb-8">
                      <h3 className="text-xl font-semibold mb-4">Your Estimate Summary</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[#C4C4C4]">Kitchen Layout</span>
                          <span className="font-medium">
                            {layouts.find(l => l.id === selectedLayout)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#C4C4C4]">Dimensions</span>
                          <span className="font-medium">
                            {kitchenDimensions.width}ft × {kitchenDimensions.depth}ft
                          </span>
                        </div>
                        
                        <Separator className="bg-[#333]" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#C4C4C4]">Material Grade</span>
                          <span className="font-medium">
                            {materialGrades.find(g => g.id === materialGrade)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#C4C4C4]">Countertop</span>
                          <span className="font-medium">
                            {options.countertops.find(c => c.id === countertopType)?.name}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[#C4C4C4]">Appliance Package</span>
                          <span className="font-medium">
                            {options.appliances.find(a => a.id === appliancePackage)?.name}
                            {" "}
                            {appliancePackage !== 'none' && (
                              <span className="text-sm text-[#999]">
                                ({formatCurrency(options.appliances.find(a => a.id === appliancePackage)?.price || 0)})
                              </span>
                            )}
                          </span>
                        </div>
                        
                        <Separator className="bg-[#333]" />
                        
                        <div className="pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">Total Estimate</span>
                            <span className="text-xl font-bold text-[#FFD700]">
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
                      <Button variant="ghost" className="text-[#C4C4C4]" onClick={handleBack}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleNext}
                        className="bg-[#FFD700] text-black hover:bg-[#E5C100]"
                        disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone || !contactInfo.city}
                      >
                        Get My Detailed Quote
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* Quote Success View */
                <div className="bg-[#151515] rounded-md p-8 text-center">
                  <div className="w-20 h-20 mx-auto bg-[#FFD700]/20 rounded-full flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-[#FFD700]" />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-4">Thank You!</h2>
                  
                  <p className="text-[#C4C4C4] text-lg mb-8 max-w-xl mx-auto">
                    We've received your request for a detailed kitchen quote. Our design experts will get in touch with you within 24 hours.
                  </p>
                  
                  <div className="bg-[#222] p-6 rounded-md max-w-md mx-auto mb-8">
                    <h3 className="text-xl font-semibold mb-4">Your Kitchen Estimate</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#C4C4C4]">Layout:</span>
                      <span>{layouts.find(l => l.id === selectedLayout)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#C4C4C4]">Material Grade:</span>
                      <span>{materialGrades.find(g => g.id === materialGrade)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#333]">
                      <span className="font-semibold">Estimated Total:</span>
                      <span className="font-bold text-[#FFD700]">{formatCurrency(totalEstimate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="border-[#FFD700] text-[#FFD700]">
                      <Download className="mr-2 h-4 w-4" />
                      Download Estimate
                    </Button>
                    <Link href="/">
                      <Button className="bg-[#FFD700] text-black hover:bg-[#E5C100]">
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
        <section className="py-12 bg-[#151515]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                <div className="bg-[#222] p-6 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">How is the kitchen price calculated?</h3>
                  <p className="text-[#C4C4C4]">
                    Our calculator estimates costs based on your layout type, dimensions, material quality, countertop selection, and appliance package. Prices are calculated per unit of cabinetry needed for your kitchen layout.
                  </p>
                </div>
                
                <div className="bg-[#222] p-6 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">What's included in a modular kitchen?</h3>
                  <p className="text-[#C4C4C4]">
                    Our modular kitchens include base cabinets, wall cabinets, countertops, backsplash, handles, and hardware. Appliances are included only if you select an appliance package. Plumbing and electrical work may incur additional costs.
                  </p>
                </div>
                
                <div className="bg-[#222] p-6 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">How long does kitchen installation take?</h3>
                  <p className="text-[#C4C4C4]">
                    Kitchen installation typically takes 7-14 days, depending on complexity and size. This includes removing old fittings, plumbing work, electrical work, cabinet installation, and finishing touches.
                  </p>
                </div>
                
                <div className="bg-[#222] p-6 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Do you offer kitchen renovation services?</h3>
                  <p className="text-[#C4C4C4]">
                    Yes, we offer complete kitchen renovation services including demolition, plumbing, electrical work, and installation. Our designers can work with your existing space to transform it completely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-[#222]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-4">
                  Ready for Your Dream Kitchen?
                </h2>
                <p className="text-[#C4C4C4]">
                  Book a free consultation with our kitchen design experts today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#FFD700] text-black hover:bg-[#E5C100]">
                  <Calculator className="mr-2 h-4 w-4" />
                  Try Other Calculators
                </Button>
                <Button variant="outline" className="border-[#FFD700] text-[#FFD700]">
                  <Utensils className="mr-2 h-4 w-4" />
                  View Kitchen Designs
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <BackToTop />
    </>
  );
}