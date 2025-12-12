"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "./input";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PlaneTakeoff,
  PlaneLanding,
  MapPin,
  Building2,
  Clock,
} from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Custom hook for debouncing values
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Airport data structure
 * @typedef {Object} Airport
 * @property {string} id - Unique identifier
 * @property {string} code - Airport IATA code (e.g., CGK, DPS)
 * @property {string} name - Airport name
 * @property {string} city - City name
 * @property {string} country - Country name
 * @property {string} [description] - Optional description
 */

// Popular Indonesian airports with real data
const defaultAirports = [
  {
    id: "1",
    code: "CGK",
    name: "Soekarno-Hatta International Airport",
    city: "Jakarta",
    country: "Indonesia",
    description: "Bandara utama Indonesia",
  },
  {
    id: "2",
    code: "DPS",
    name: "Ngurah Rai International Airport",
    city: "Bali (Denpasar)",
    country: "Indonesia",
    description: "Bandara wisata Bali",
  },
  {
    id: "3",
    code: "SUB",
    name: "Juanda International Airport",
    city: "Surabaya",
    country: "Indonesia",
    description: "Bandara utama Jawa Timur",
  },
  {
    id: "4",
    code: "JOG",
    name: "Yogyakarta International Airport",
    city: "Yogyakarta",
    country: "Indonesia",
    description: "Bandara baru Yogyakarta",
  },
  {
    id: "5",
    code: "UPG",
    name: "Sultan Hasanuddin International Airport",
    city: "Makassar",
    country: "Indonesia",
    description: "Bandara utama Sulawesi",
  },
  {
    id: "6",
    code: "KNO",
    name: "Kualanamu International Airport",
    city: "Medan",
    country: "Indonesia",
    description: "Bandara utama Sumatera Utara",
  },
  {
    id: "7",
    code: "BPN",
    name: "Sultan Aji Muhammad Sulaiman Airport",
    city: "Balikpapan",
    country: "Indonesia",
    description: "Bandara utama Kalimantan Timur",
  },
  {
    id: "8",
    code: "PDG",
    name: "Minangkabau International Airport",
    city: "Padang",
    country: "Indonesia",
    description: "Bandara utama Sumatera Barat",
  },
  {
    id: "9",
    code: "PLM",
    name: "Sultan Mahmud Badaruddin II Airport",
    city: "Palembang",
    country: "Indonesia",
    description: "Bandara utama Sumatera Selatan",
  },
  {
    id: "10",
    code: "SRG",
    name: "Ahmad Yani International Airport",
    city: "Semarang",
    country: "Indonesia",
    description: "Bandara utama Jawa Tengah",
  },
  {
    id: "11",
    code: "SOC",
    name: "Adisumarmo International Airport",
    city: "Solo",
    country: "Indonesia",
    description: "Bandara kota Solo",
  },
  {
    id: "12",
    code: "BDO",
    name: "Husein Sastranegara Airport",
    city: "Bandung",
    country: "Indonesia",
    description: "Bandara kota Bandung",
  },
  {
    id: "13",
    code: "LOP",
    name: "Lombok International Airport",
    city: "Lombok",
    country: "Indonesia",
    description: "Bandara wisata Lombok",
  },
  {
    id: "14",
    code: "BTH",
    name: "Hang Nadim International Airport",
    city: "Batam",
    country: "Indonesia",
    description: "Bandara utama Kepulauan Riau",
  },
  {
    id: "15",
    code: "PNK",
    name: "Supadio International Airport",
    city: "Pontianak",
    country: "Indonesia",
    description: "Bandara utama Kalimantan Barat",
  },
];

/**
 * AirportSearchInput - Searchable dropdown for airport selection
 * 
 * @param {Object} props
 * @param {string} props.type - "departure" or "arrival" 
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.value - Current selected value (airport code or display text)
 * @param {function} props.onChange - Callback when airport is selected
 * @param {function} props.onAirportSelect - Callback with full airport object
 * @param {Airport[]} props.airports - List of airports to search from
 * @param {string} props.label - Optional label above input
 * @param {string} props.name - Input name attribute
 * @param {string} props.id - Input id attribute
 * @param {string} props.className - Additional CSS classes
 */
function AirportSearchInput({
  type = "departure",
  placeholder = "Cari bandara atau kota",
  value = "",
  onChange,
  onAirportSelect,
  airports = defaultAirports,
  label,
  name,
  id,
  className,
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(query, 200);

  const IconComponent = type === "departure" ? PlaneTakeoff : PlaneLanding;

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`recent-airports-${type}`);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, [type]);

  // Filter airports based on query
  useEffect(() => {
    if (!isFocused) {
      setResults([]);
      return;
    }

    if (!debouncedQuery) {
      // Show recent searches first, then popular airports
      const recentIds = recentSearches.map(r => r.id);
      const popularAirports = airports.filter(a => !recentIds.includes(a.id)).slice(0, 5);
      setResults([...recentSearches.slice(0, 3), ...popularAirports]);
      return;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const filtered = airports.filter((airport) => {
      const searchableText = `${airport.code} ${airport.name} ${airport.city} ${airport.country}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    setResults(filtered.slice(0, 8));
  }, [debouncedQuery, isFocused, airports, recentSearches]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setSelectedAirport(null);
    onChange?.(newValue);
  };

  const handleAirportSelect = (airport) => {
    const displayValue = `${airport.city} (${airport.code})`;
    setQuery(displayValue);
    setSelectedAirport(airport);
    setIsFocused(false);
    
    // Save to recent searches
    const newRecent = [airport, ...recentSearches.filter(r => r.id !== airport.id)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem(`recent-airports-${type}`, JSON.stringify(newRecent));
    
    // Callbacks
    onChange?.(displayValue);
    onAirportSelect?.(airport);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedAirport(null);
    onChange?.("");
    inputRef.current?.focus();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: {
        duration: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-muted-foreground mb-1.5 block"
        >
          {label}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 border rounded-lg transition-all duration-200",
            "bg-background hover:border-primary/50",
            isFocused 
              ? "border-primary ring-2 ring-primary/20" 
              : "border-border",
            "group"
          )}
        >
          <IconComponent 
            className={cn(
              "w-5 h-5 transition-colors shrink-0",
              isFocused ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )} 
          />
          
          <input
            ref={inputRef}
            type="text"
            id={id}
            name={name}
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
            autoComplete="off"
          />

          {/* Clear / Search Icon */}
          <div className="flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <span className="sr-only">Clear</span>
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Dropdown Results */}
        <AnimatePresence>
          {isFocused && results.length > 0 && (
            <motion.div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {/* Recent Searches Header */}
              {!debouncedQuery && recentSearches.length > 0 && (
                <div className="px-4 py-2 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Pencarian Terakhir</span>
                  </div>
                </div>
              )}

              {/* Airport List */}
              <ul className="max-h-[300px] overflow-y-auto py-2">
                {results.map((airport, index) => {
                  const isRecent = recentSearches.some(r => r.id === airport.id) && !debouncedQuery;
                  
                  return (
                    <motion.li
                      key={airport.id}
                      variants={itemVariants}
                      layout
                    >
                      <button
                        type="button"
                        onClick={() => handleAirportSelect(airport)}
                        className={cn(
                          "w-full px-4 py-3 flex items-start gap-3 text-left",
                          "hover:bg-muted/70 transition-colors cursor-pointer",
                          "focus:outline-none focus:bg-muted/70",
                          index < results.length - 1 && "border-b border-border/50"
                        )}
                      >
                        {/* Icon */}
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          isRecent 
                            ? "bg-amber-500/10 text-amber-500" 
                            : "bg-primary/10 text-primary"
                        )}>
                          {isRecent ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Building2 className="w-5 h-5" />
                          )}
                        </div>

                        {/* Airport Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {airport.code}
                            </span>
                            <span className="text-sm text-muted-foreground truncate">
                              {airport.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {airport.city}, {airport.country}
                            </span>
                          </div>
                          {airport.description && (
                            <span className="text-xs text-muted-foreground/70 mt-1 block">
                              {airport.description}
                            </span>
                          )}
                        </div>

                        {/* Country Flag Placeholder */}
                        <div className="shrink-0">
                          <span className="text-lg">🇮🇩</span>
                        </div>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Footer */}
              <div className="px-4 py-2 bg-muted/30 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd>
                    <span>untuk navigasi</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
                    <span>untuk pilih</span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        <AnimatePresence>
          {isFocused && debouncedQuery && results.length === 0 && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl z-50 p-8 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Tidak ada bandara ditemukan untuk "<span className="font-medium text-foreground">{debouncedQuery}</span>"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Coba kata kunci lain seperti kode bandara atau nama kota
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { AirportSearchInput, defaultAirports };
