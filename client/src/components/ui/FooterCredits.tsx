import React from 'react';

const FooterCredits = () => {
  return (
    <div className="pt-4 border-t border-[#E6E1DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <img
            src="/flauxmedia.png"
            alt="TheFlauxMedia Logo"
            className="h-5 sm:h-6 w-auto"
          />
          <p className="font-body text-xs sm:text-sm text-[#6E6A66] text-center">
            Website designed and developed by{' '}
            <a
              href="https://theflauxmedia.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[#C9B59C] hover:text-[#C9B59C]"
            >
              TheFlauxMedia
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterCredits;

