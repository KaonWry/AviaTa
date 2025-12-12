import { motion, AnimatePresence } from 'framer-motion';

// Full page loading dengan animasi pesawat terbang
export function PageLoader({ isLoading = true, message = "Memuat halaman..." }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-[#FBFBFB] to-[#E6E9F0] z-50 flex flex-col items-center justify-center"
        >
          {/* Animated Plane */}
          <motion.div
            className="relative"
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Plane SVG */}
            <motion.svg
              className="w-24 h-24 text-[#4A70A9]"
              fill="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </motion.svg>

            {/* Trail effect */}
            <motion.div
              className="absolute -left-12 top-1/2 -translate-y-1/2 flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#8FABD4] rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Brand */}
          <motion.div
            className="mt-8 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-8 h-8 rounded-full bg-[#4A70A9]" />
            <span className="text-2xl font-bold text-[#333]">AviaTa</span>
          </motion.div>

          {/* Loading text */}
          <motion.p
            className="mt-4 text-[#666] text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {message}
          </motion.p>

          {/* Loading dots */}
          <div className="mt-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#4A70A9] rounded-full"
                animate={{ y: [-4, 4, -4], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mini loader untuk button atau inline loading
export function InlineLoader({ size = "md", color = "#4A70A9" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          opacity="0.3"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          strokeDashoffset="75"
        />
      </svg>
    </motion.div>
  );
}

// Skeleton untuk search results
export function SearchResultSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-xl shadow-md p-4"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Airline logo */}
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-full"
              animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Flight info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded"
                  animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="h-0.5 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded"
                  animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.div
                className="h-3 w-32 mx-auto bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded"
                animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
              />
            </div>

            {/* Price */}
            <motion.div
              className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded"
              animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default PageLoader;
