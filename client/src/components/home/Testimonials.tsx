import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, StarHalf } from "lucide-react";
import { Testimonial } from "@shared/schema";

const renderStars = (rating: number = 0) => {
  // Convert rating from 0-50 to 0-5 scale
  const normalizedRating = rating / 10;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  
  return (
    <div className="flex text-accent mb-4">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="fill-current" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={`empty-${i}`} />
      ))}
    </div>
  );
};

const Testimonials: React.FC = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { limit: 3 }],
  });

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg opacity-80">Discover why our clients trust us with their homes and furniture needs.</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white bg-opacity-10 p-8 rounded-lg animate-pulse h-64"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-300">Error loading testimonials. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-white bg-opacity-10 p-8 rounded-lg">
                {renderStars(testimonial.rating)}
                <p className="mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full ${testimonial.initials === 'MR' ? 'bg-secondary' : 'bg-accent'} mr-4 flex items-center justify-center text-white font-bold`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="opacity-80 text-sm">{testimonial.projectType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
