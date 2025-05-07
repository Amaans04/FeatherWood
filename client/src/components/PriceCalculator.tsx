import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useApiLoading } from '@/hooks/useApiLoading';

const words = ['Wardrobe', 'Full Home', 'Kitchen'];

export default function PriceCalculator() {
  const [currentWord, setCurrentWord] = useState(0);
  const [, setLocation] = useLocation();
  const { withLoading } = useApiLoading();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCalculate = async (type: string) => {
    // Use the loading system when navigating to calculators
    await withLoading(async () => {
      // Simulate API data loading before navigation (optional)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to the appropriate calculator
      switch(type) {
        case 'fullhome':
          setLocation('/home-interior-price-calculator');
          break;
        case 'kitchen':
          setLocation('/kitchen-price-calculator');
          break;
        case 'wardrobe':
          setLocation('/wardrobe-price-calculator');
          break;
      }
    });
  };

  return (
    <section className="py-16 px-4 bg-[#0A0A0A]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#F5F5F5] mb-4 flex justify-center items-center gap-2">
            Get the estimate for your{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[#FFD700] min-w-[180px] inline-block font-playfair"
              >
                {words[currentWord]}
              </motion.span>
            </AnimatePresence>
          </h2>
          <p className="text-[#C4C4C4]">Calculate the approximate cost of doing up your home interiors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#151515] border border-[#333] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#F5F5F5] text-center">Full Home Interior</h3>
            <p className="text-[#C4C4C4] mb-4 text-center">Know the estimate price for your full home interiors</p>
            <Button 
              className="w-full bg-[#FFD700] text-black hover:bg-[#E5C100]"
              onClick={() => handleCalculate('fullhome')}
            >
              CALCULATE
            </Button>
          </div>

          <div className="bg-[#151515] border border-[#333] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 18L5 18L5 5L19 5L19 18L16 18"></path>
                  <path d="M12 18V13"></path>
                  <path d="M12 8V10"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#F5F5F5] text-center">Kitchen</h3>
            <p className="text-[#C4C4C4] mb-4 text-center">Get an approximate costing for your kitchen interior.</p>
            <Button 
              className="w-full bg-[#FFD700] text-black hover:bg-[#E5C100]"
              onClick={() => handleCalculate('kitchen')}
            >
              CALCULATE
            </Button>
          </div>

          <div className="bg-[#151515] border border-[#333] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#F5F5F5] text-center">Wardrobe</h3>
            <p className="text-[#C4C4C4] mb-4 text-center">Our estimate for your dream wardrobe</p>
            <Button 
              className="w-full bg-[#FFD700] text-black hover:bg-[#E5C100]"
              onClick={() => handleCalculate('wardrobe')}
            >
              CALCULATE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
