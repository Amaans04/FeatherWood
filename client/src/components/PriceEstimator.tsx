import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Sofa, BookOpen, Bed, ChefHat } from 'lucide-react';

// Define the schema for the form
const estimateFormSchema = z.object({
  category: z.string(),
  roomWidth: z.number().min(1, { message: "Width must be at least 1 foot" }).max(100),
  roomLength: z.number().min(1, { message: "Length must be at least 1 foot" }).max(100),
  roomHeight: z.number().min(7, { message: "Height must be at least 7 feet" }).max(30),
  style: z.string(),
  material: z.string(),
  features: z.array(z.string()).optional(),
});

type EstimateFormValues = z.infer<typeof estimateFormSchema>;

// Category data
const categories = [
  { id: 'modular-kitchen', name: 'Modular Kitchen', icon: <ChefHat className="h-8 w-8" />, basePrice: 5000 },
  { id: 'living-room', name: 'Living Room', icon: <Sofa className="h-8 w-8" />, basePrice: 3500 },
  { id: 'bedroom', name: 'Bedroom', icon: <Bed className="h-8 w-8" />, basePrice: 2800 },
  { id: 'study', name: 'Study Room', icon: <BookOpen className="h-8 w-8" />, basePrice: 2200 },
  { id: 'full-home', name: 'Full Home', icon: <Home className="h-8 w-8" />, basePrice: 12000 },
];

// Style options
const styleOptions = [
  { id: 'modern', name: 'Modern', priceMultiplier: 1.2 },
  { id: 'traditional', name: 'Traditional', priceMultiplier: 1.0 },
  { id: 'contemporary', name: 'Contemporary', priceMultiplier: 1.1 },
  { id: 'minimalist', name: 'Minimalist', priceMultiplier: 0.9 },
  { id: 'luxury', name: 'Luxury', priceMultiplier: 1.5 },
];

// Material options
const materialOptions = [
  { id: 'wood', name: 'Wood', priceMultiplier: 1.2 },
  { id: 'mdf', name: 'MDF', priceMultiplier: 0.8 },
  { id: 'plywood', name: 'Plywood', priceMultiplier: 1.0 },
  { id: 'metal', name: 'Metal', priceMultiplier: 1.3 },
  { id: 'glass', name: 'Glass Accents', priceMultiplier: 1.4 },
];

// Feature options
const featureOptions = [
  { id: 'cabinets', name: 'Extra Cabinets', price: 800 },
  { id: 'lighting', name: 'Premium Lighting', price: 600 },
  { id: 'smart-features', name: 'Smart Home Features', price: 1200 },
  { id: 'custom-finish', name: 'Custom Finish', price: 900 },
];

enum EstimatorStep {
  CATEGORY_SELECTION = 0,
  ROOM_DETAILS = 1,
  MATERIAL_STYLE = 2,
  PRICE_BREAKDOWN = 3,
  SUMMARY = 4,
}

const PriceEstimator = () => {
  const [currentStep, setCurrentStep] = useState<EstimatorStep>(EstimatorStep.CATEGORY_SELECTION);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const form = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues: {
      roomWidth: 10,
      roomLength: 12,
      roomHeight: 9,
      style: 'modern',
      material: 'wood',
      features: [],
    },
  });

  // Calculate price based on inputs
  const calculatePrice = (data: EstimateFormValues) => {
    // Find the selected category
    const category = categories.find(cat => cat.id === data.category);
    if (!category) return 0;

    // Calculate area in square feet
    const squareFeet = data.roomWidth * data.roomLength;
    
    // Base price from the category
    let price = category.basePrice;
    
    // Add area factor
    price += squareFeet * 15; // $15 per sq ft
    
    // Apply style multiplier
    const selectedStyle = styleOptions.find(style => style.id === data.style);
    if (selectedStyle) {
      price *= selectedStyle.priceMultiplier;
    }
    
    // Apply material multiplier
    const selectedMaterial = materialOptions.find(material => material.id === data.material);
    if (selectedMaterial) {
      price *= selectedMaterial.priceMultiplier;
    }
    
    // Add feature costs
    if (data.features && data.features.length > 0) {
      data.features.forEach(featureId => {
        const feature = featureOptions.find(f => f.id === featureId);
        if (feature) {
          price += feature.price;
        }
      });
    }
    
    return Math.round(price);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    form.setValue('category', categoryId);
    setCurrentStep(EstimatorStep.ROOM_DETAILS);
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => {
      if (prev.includes(featureId)) {
        return prev.filter(id => id !== featureId);
      } else {
        return [...prev, featureId];
      }
    });
    
    const currentFeatures = form.getValues('features') || [];
    if (currentFeatures.includes(featureId)) {
      form.setValue('features', currentFeatures.filter(id => id !== featureId));
    } else {
      form.setValue('features', [...currentFeatures, featureId]);
    }
  };

  const nextStep = () => {
    if (currentStep < EstimatorStep.SUMMARY) {
      setCurrentStep(currentStep + 1);
      
      // If moving to price breakdown, calculate the price
      if (currentStep + 1 === EstimatorStep.PRICE_BREAKDOWN) {
        const formData = form.getValues();
        const calculatedPrice = calculatePrice(formData);
        setFinalPrice(calculatedPrice);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > EstimatorStep.CATEGORY_SELECTION) {
      setCurrentStep(currentStep - 1);
    }
  };

  const openEstimator = () => {
    setIsModalOpen(true);
  };

  const closeEstimator = () => {
    setIsModalOpen(false);
    setCurrentStep(EstimatorStep.CATEGORY_SELECTION);
    form.reset();
    setSelectedCategory(null);
    setSelectedFeatures([]);
  };

  const submitEstimate = () => {
    // In a real application, you might submit to an API here
    console.log('Estimate submitted:', form.getValues(), 'Price:', finalPrice);
    setCurrentStep(EstimatorStep.SUMMARY);
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case EstimatorStep.CATEGORY_SELECTION:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Choose Your Design Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className={`cursor-pointer hover:border-accent transition-all ${
                    selectedCategory === category.id ? 'border-2 border-secondary' : 'border border-muted'
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="mb-4 text-secondary">
                      {category.icon}
                    </div>
                    <h4 className="font-medium text-center">{category.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case EstimatorStep.ROOM_DETAILS:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Configure Your Space</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Room Width (feet)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    defaultValue={[form.getValues('roomWidth')]}
                    min={5}
                    max={40}
                    step={1}
                    onValueChange={(value) => form.setValue('roomWidth', value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{form.getValues('roomWidth')}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Room Length (feet)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    defaultValue={[form.getValues('roomLength')]}
                    min={5}
                    max={40}
                    step={1}
                    onValueChange={(value) => form.setValue('roomLength', value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{form.getValues('roomLength')}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Ceiling Height (feet)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    defaultValue={[form.getValues('roomHeight')]}
                    min={7}
                    max={15}
                    step={0.5}
                    onValueChange={(value) => form.setValue('roomHeight', value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{form.getValues('roomHeight')}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case EstimatorStep.MATERIAL_STYLE:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Choose Style & Materials</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Design Style</Label>
                <Select 
                  defaultValue={form.getValues('style')}
                  onValueChange={(value) => form.setValue('style', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map((style) => (
                      <SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Primary Material</Label>
                <Select 
                  defaultValue={form.getValues('material')}
                  onValueChange={(value) => form.setValue('material', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialOptions.map((material) => (
                      <SelectItem key={material.id} value={material.id}>{material.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Additional Features</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {featureOptions.map((feature) => (
                    <div 
                      key={feature.id}
                      className={`p-3 rounded border cursor-pointer ${
                        selectedFeatures.includes(feature.id) 
                          ? 'border-secondary bg-secondary/10' 
                          : 'border-muted'
                      }`}
                      onClick={() => handleFeatureToggle(feature.id)}
                    >
                      <div className="flex justify-between">
                        <span>{feature.name}</span>
                        <span className="text-secondary">${feature.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case EstimatorStep.PRICE_BREAKDOWN:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Price Breakdown</h3>
            <div className="text-center mb-6">
              <p className="text-sm">Estimated Price</p>
              <p className="text-4xl font-playfair font-bold text-secondary">${finalPrice.toLocaleString()}</p>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Base price</span>
                <span>
                  ${categories.find(c => c.id === form.getValues('category'))?.basePrice.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Room size factor ({form.getValues('roomWidth')} × {form.getValues('roomLength')} sq ft)</span>
                <span>${(form.getValues('roomWidth') * form.getValues('roomLength') * 15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Style: {styleOptions.find(s => s.id === form.getValues('style'))?.name}</span>
                <span>
                  {styleOptions.find(s => s.id === form.getValues('style'))?.priceMultiplier}x multiplier
                </span>
              </div>
              <div className="flex justify-between">
                <span>Material: {materialOptions.find(m => m.id === form.getValues('material'))?.name}</span>
                <span>
                  {materialOptions.find(m => m.id === form.getValues('material'))?.priceMultiplier}x multiplier
                </span>
              </div>
              {selectedFeatures.length > 0 && (
                <>
                  <div className="border-t pt-2 font-medium">Additional Features</div>
                  {selectedFeatures.map(featureId => {
                    const feature = featureOptions.find(f => f.id === featureId);
                    return (
                      <div key={featureId} className="flex justify-between">
                        <span>{feature?.name}</span>
                        <span>${feature?.price}</span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        );
        
      case EstimatorStep.SUMMARY:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Estimate Summary</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-center mb-6">
                <p className="text-sm">Your Final Estimate</p>
                <p className="text-4xl font-playfair font-bold text-secondary">${finalPrice.toLocaleString()}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Category</p>
                  <p>{categories.find(c => c.id === form.getValues('category'))?.name}</p>
                </div>
                
                <div>
                  <p className="font-medium">Room Dimensions</p>
                  <p>{form.getValues('roomWidth')}ft × {form.getValues('roomLength')}ft × {form.getValues('roomHeight')}ft</p>
                </div>
                
                <div>
                  <p className="font-medium">Style & Material</p>
                  <p>
                    {styleOptions.find(s => s.id === form.getValues('style'))?.name} with 
                    {' '}{materialOptions.find(m => m.id === form.getValues('material'))?.name}
                  </p>
                </div>
                
                {selectedFeatures.length > 0 && (
                  <div>
                    <p className="font-medium">Additional Features</p>
                    <p>{selectedFeatures.map(fId => 
                      featureOptions.find(f => f.id === fId)?.name
                    ).join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>One of our design consultants will contact you within 24 hours to discuss your estimate and schedule a detailed consultation.</p>
            </div>
          </div>
        );
    }
  };

  // Modal or full screen component
  return (
    <>
      <Button 
        onClick={openEstimator}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Get Estimate
      </Button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair font-bold">Design Estimate Calculator</h2>
                <Button variant="ghost" size="icon" onClick={closeEstimator}>×</Button>
              </div>
              
              {/* Step Indicator */}
              <div className="mb-8">
                <div className="flex justify-between">
                  {Object.keys(EstimatorStep).filter(k => isNaN(Number(k))).map((step, index) => (
                    <div 
                      key={step}
                      className={`flex flex-col items-center ${
                        index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          index < currentStep 
                            ? 'bg-secondary text-secondary-foreground' 
                            : index === currentStep 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs hidden md:block">
                        {step.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative mt-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-0.5 w-full bg-muted"></div>
                  </div>
                  <div 
                    className="relative h-0.5 bg-secondary transition-all duration-300" 
                    style={{ 
                      width: `${(currentStep / (Object.keys(EstimatorStep).length / 2 - 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-8">
                {renderStepContent()}
              </div>
              
              <div className="flex justify-between">
                {currentStep > EstimatorStep.CATEGORY_SELECTION ? (
                  <Button variant="outline" onClick={prevStep}>Back</Button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < EstimatorStep.PRICE_BREAKDOWN ? (
                  <Button onClick={nextStep}>Continue</Button>
                ) : currentStep === EstimatorStep.PRICE_BREAKDOWN ? (
                  <Button 
                    onClick={submitEstimate}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    Get Final Quote
                  </Button>
                ) : (
                  <Button 
                    onClick={closeEstimator}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    Finish
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceEstimator;