"use client";

import { useState, useEffect, useRef } from "react";
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

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Data default hanya dipakai jika API mati total
const defaultAirports = [
  { id: "1", code: "CGK", name: "Soekarno-Hatta International Airport", city: "Jakarta", country: "Indonesia" },
  { id: "2", code: "DPS", name: "Ngurah Rai International Airport", city: "Bali (Denpasar)", country: "Indonesia" },
];

function AirportSearchInput({
  type = "departure",
  placeholder = "Cari bandara atau kota",
  value = "",
  onChange,
  onAirportSelect,
  airports: propAirports,
  label,
  name,
  id,
  className,
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [airportsData, setAirportsData] = useState(propAirports || defaultAirports);
  // eslint-disable-next-line no-unused-vars
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(query, 200);

  const IconComponent = type === "departure" ? PlaneTakeoff : PlaneLanding;

  // 1. FETCH DATA (Diperbaiki)
  useEffect(() => {
    if (propAirports) {
      setAirportsData(propAirports);
      return;
    }

    const fetchAirports = async () => {
      setIsLoadingAirports(true);
      try {
        console.log("🚀 Memulai fetch data bandara...");
        const response = await fetch('http://localhost:3001/api/airports');
        
        if (!response.ok) throw new Error("Gagal koneksi ke backend");

        const data = await response.json();
        
        // Logic pintar: deteksi apakah data itu Array atau Object { airports: [] }
        const airportList = Array.isArray(data) ? data : (data.airports || []);

        console.log(` BERHASIL LOAD: ${airportList.length} bandara dari Database!`);

        if (airportList.length > 0) {
          const formattedAirports = airportList.map((airport, index) => ({
            id: airport.id?.toString() || (index + 1).toString(),
            code: airport.code,
            name: airport.name,
            city: airport.city,
            country: airport.country,
          }));
          setAirportsData(formattedAirports);
        }
      } catch (err) {
        console.error(' ERROR API:', err);
      } finally {
        setIsLoadingAirports(false);
      }
    };

    fetchAirports();
  }, [propAirports]);

  // Sync value prop
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem(`recent-airports-${type}`);
    if (stored) {
      try { setRecentSearches(JSON.parse(stored)); } catch { setRecentSearches([]); }
    }
  }, [type]);

  // 2. FILTER & DISPLAY LOGIC (Diperbaiki limitnya)
  useEffect(() => {
    if (!isFocused) {
      setResults([]);
      return;
    }

    // KASUS 1: Belum ngetik apa-apa (Show All / Popular)
    if (!debouncedQuery) {
      const recentIds = recentSearches.map(r => r.id);
      
      // MODIFIKASI: Limit dinaikkan dari 5 ke 50 biar kelihatan banyak
      const allOtherAirports = airportsData
        .filter(a => !recentIds.includes(a.id))
        .slice(0, 50); 
      
      setResults([...recentSearches.slice(0, 5), ...allOtherAirports]);
      return;
    }

    // KASUS 2: Sedang mencari
    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const filtered = airportsData.filter((airport) => {
      const searchableText = `${airport.code} ${airport.name} ${airport.city} ${airport.country}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    // MODIFIKASI: Limit hasil pencarian dinaikkan dari 8 ke 20
    setResults(filtered.slice(0, 20));

  }, [debouncedQuery, isFocused, airportsData, recentSearches]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
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
    
    const newRecent = [airport, ...recentSearches.filter(r => r.id !== airport.id)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem(`recent-airports-${type}`, JSON.stringify(newRecent));
    
    onChange?.(displayValue);
    onAirportSelect?.(airport);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedAirport(null);
    onChange?.("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative z-[50]", className)} style={{ isolation: 'isolate' }}>
      {label && <label htmlFor={id} className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>}
      
      <div className="relative">
        <div className={cn(
            "flex items-center gap-3 px-4 py-3 border rounded-lg transition-all duration-200",
            "bg-background hover:border-primary/50",
            isFocused ? "border-primary ring-2 ring-primary/20" : "border-border",
            "group"
          )}>
          <IconComponent className={cn("w-5 h-5 transition-colors shrink-0", isFocused ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
          
          <input
            ref={inputRef}
            type="text"
            id={id}
            name={name}
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
            autoComplete="off"
          />

          <div className="flex items-center gap-2">
            {query && (
              <button type="button" onClick={handleClear} className="p-1 hover:bg-muted rounded-full transition-colors">
                <span className="sr-only">Clear</span>
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <AnimatePresence>
          {isFocused && results.length > 0 && (
            <motion.div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl z-[9999] overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* MODIFIKASI: Tinggi dropdown diperbesar biar muat banyak */}
              <ul className="max-h-[350px] overflow-y-auto py-1 scrollbar-thin">
                {results.map((airport, index) => {
                  const isRecent = recentSearches.some(r => r.id === airport.id) && !debouncedQuery;
                  return (
                    <li key={`${airport.id}-${index}`}>
                      <button
                        type="button"
                        onClick={() => handleAirportSelect(airport)}
                        className={cn(
                          "w-full px-3 py-2.5 flex items-start gap-2.5 text-left hover:bg-muted/70 transition-colors cursor-pointer",
                          index < results.length - 1 && "border-b border-border/30"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isRecent ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary")}>
                          {isRecent ? <Clock className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm">{airport.code}</span>
                            <span className="text-xs text-muted-foreground truncate">{airport.name}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground">{airport.city}, {airport.country}</span>
                          </div>
                        </div>
                        <div className="shrink-0 text-xs font-medium text-primary">
                          {airport.country?.substring(0, 2).toUpperCase()}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { AirportSearchInput, defaultAirports };