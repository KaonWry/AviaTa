import React from "react";
import { cn } from "../../lib/utils";

// Destination Card with Hover Effects - Optimized for AviaTa Flight Booking
export function DestinationCard({ title, description, image, index = 0 }) {
  return (
    <article
      className={cn(
        "group/card relative bg-white rounded-xl border border-[#E0E0E0] overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-[#4A70A9]/10 hover:border-[#4A70A9]/30",
        "hover:-translate-y-1"
      )}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[#4A70A9]/5 to-transparent pointer-events-none z-10" />
      
      {/* Image Container */}
      <div className="relative h-[120px] overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#8FABD4] to-[#4A70A9] flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-white/60" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </div>
        )}
        
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-4">
        {/* Animated Left Border */}
        <div className="absolute left-0 top-4 h-6 w-1 rounded-r-full bg-[#E0E0E0] group-hover/card:h-10 group-hover/card:bg-[#4A70A9] transition-all duration-300" />
        
        {/* Title */}
        <h3 className="text-sm font-semibold text-[#333] pl-3 group-hover/card:translate-x-1 transition-transform duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-xs text-[#666] mt-1 pl-3 group-hover/card:text-[#4A70A9] transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Bottom Action Hint */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 origin-left" />
    </article>
  );
}

// Destination Grid with Hover Effects
export function DestinationGrid({ destinations, loading, emptyMessage }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden animate-pulse"
          >
            <div className="h-[120px] bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!destinations || destinations.length === 0) {
    return (
      <div className="col-span-4 text-center py-10 text-sm text-gray-500">
        {emptyMessage || "Tidak ada destinasi tersedia."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {destinations.map((item, idx) => (
        <DestinationCard
          key={idx}
          title={item.title}
          description={item.desc}
          image={item.image}
          index={idx}
        />
      ))}
    </div>
  );
}

export default DestinationCard;
