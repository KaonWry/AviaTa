import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

// Animated Skeleton Card for loading state
function SkeletonCard({ index }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden"
    >
      {/* Image skeleton with shimmer effect */}
      <MotionDiv 
        className="h-[120px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"
        animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <div className="p-4 space-y-2">
        <MotionDiv 
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded w-3/4"
          animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
        />
        <MotionDiv 
          className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded w-1/2"
          animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
        />
      </div>
    </MotionDiv>
  );
}

// Destination Card with Hover Effects - Optimized for AviaTa Flight Booking
export function DestinationCard({ title, description, image, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group/card relative bg-white rounded-xl border border-[#E0E0E0] overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-[#4A70A9]/10 hover:border-[#4A70A9]/30"
      )}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[#4A70A9]/5 to-transparent pointer-events-none z-10" />
      
      {/* Image Container */}
      <div className="relative h-[120px] overflow-hidden">
        {/* Always render a nice placeholder behind the image */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#8FABD4] to-[#4A70A9] flex items-center justify-center">
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

        {image && imgOk && (
          <img 
            src={image} 
            alt={title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgOk(false)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110",
              "transition-opacity duration-300",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
          />
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
    </MotionArticle>
  );
}

// Destination Grid with Animated Loading Skeleton
export function DestinationGrid({ destinations, loading, emptyMessage }) {
  if (loading) {
    return (
      <MotionDiv 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(4)].map((_, idx) => (
          <SkeletonCard key={idx} index={idx} />
        ))}
      </MotionDiv>
    );
  }

  if (!destinations || destinations.length === 0) {
    return (
      <MotionDiv 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-4 text-center py-10 text-sm text-gray-500"
      >
        {emptyMessage || "Tidak ada destinasi tersedia."}
      </MotionDiv>
    );
  }

  return (
    <MotionDiv 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {destinations.map((item, idx) => (
        <DestinationCard
          key={idx}
          title={item.title}
          description={item.desc}
          image={item.image}
          index={idx}
        />
      ))}
    </MotionDiv>
  );
}

export default DestinationCard;
