import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ArrowLeftRight, 
  Users, 
  ChevronDown,
  Minus,
  Plus,
  Search
} from "lucide-react";
import { cn } from "../../lib/utils";
import { FlightDatePicker } from "./flight-date-picker";
import { AirportSearchInput } from "./airport-search-input";

// Trip Type Toggle Component
function TripTypeToggle({ tripType, setTripType }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        type="button"
        onClick={() => setTripType("one-way")}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          tripType === "one-way"
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-transparent border border-border text-foreground hover:bg-muted"
        )}
      >
        Sekali Jalan
      </button>
      <button
        type="button"
        onClick={() => setTripType("round-trip")}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          tripType === "round-trip"
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-transparent border border-border text-foreground hover:bg-muted"
        )}
      >
        Pulang-Pergi
      </button>
    </div>
  );
}



// Swap Button Component
function SwapButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] w-10 h-10 rounded-full bg-card border-2 border-primary/50 shadow-xl flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 active:scale-95 transition-all duration-200 group cursor-pointer"
      aria-label="Tukar bandara keberangkatan dan tujuan"
    >
      <ArrowLeftRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
    </button>
  );
}

// Passenger Counter Component
function PassengerCounter({ label, description, count, onIncrement, onDecrement, min = 0 }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="font-medium text-foreground">{count}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {description && <div className="text-xs text-muted-foreground/70">{description}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count <= min}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onIncrement}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Class Selection Button
function ClassButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:border-primary/50"
      )}
    >
      {label}
    </button>
  );
}

// Passenger Dropdown Component
function PassengerDropdown({ passengers, setPassengers, flightClass, setFlightClass }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  
  const classLabels = {
    economy: "Ekonomi",
    "premium-economy": "Premium Ekonomi",
    business: "Bisnis",
    first: "First Class"
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors group"
      >
        <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="flex-1 text-left text-sm text-foreground">
          {totalPassengers} Penumpang, {classLabels[flightClass]}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-popover border border-border rounded-lg shadow-lg z-50"
          >
            {/* Passenger Counters */}
            <div className="space-y-3 pb-4 border-b border-border">
              <PassengerCounter
                label="Dewasa"
                description="12 tahun ke atas"
                count={passengers.adults}
                onIncrement={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))}
                onDecrement={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                min={1}
              />
              <PassengerCounter
                label="Anak-anak"
                description="2-11 tahun"
                count={passengers.children}
                onIncrement={() => setPassengers(p => ({ ...p, children: p.children + 1 }))}
                onDecrement={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
              />
              <PassengerCounter
                label="Bayi"
                description="Di bawah 2 tahun"
                count={passengers.infants}
                onIncrement={() => setPassengers(p => ({ ...p, infants: p.infants + 1 }))}
                onDecrement={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
              />
            </div>

            {/* Class Selection */}
            <div className="pt-4">
              <div className="grid grid-cols-2 gap-2">
                <ClassButton
                  label="Ekonomi"
                  selected={flightClass === "economy"}
                  onClick={() => setFlightClass("economy")}
                />
                <ClassButton
                  label="Premium Ekonomi"
                  selected={flightClass === "premium-economy"}
                  onClick={() => setFlightClass("premium-economy")}
                />
                <ClassButton
                  label="Bisnis"
                  selected={flightClass === "business"}
                  onClick={() => setFlightClass("business")}
                />
                <ClassButton
                  label="First"
                  selected={flightClass === "first"}
                  onClick={() => setFlightClass("first")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Flight Search Card Component
export function FlightSearchCard({ className }) {
  const [tripType, setTripType] = useState("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [flightClass, setFlightClass] = useState("economy");

  const handleSwap = () => {
    // Swap display values
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
    // Swap airport objects
    const tempAirport = fromAirport;
    setFromAirport(toAirport);
    setToAirport(tempAirport);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build search params with airport codes if available
    const params = new URLSearchParams({
      from: fromAirport?.code || from,
      to: toAirport?.code || to,
      fromCity: fromAirport?.city || "",
      toCity: toAirport?.city || "",
      departure: departureDate,
      ...(tripType === "round-trip" && { return: returnDate }),
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      class: flightClass,
      tripType
    });
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className={cn("bg-card rounded-2xl shadow-xl p-6 border border-border overflow-visible", className)}>
      {/* Trip Type Toggle */}
      <TripTypeToggle tripType={tripType} setTripType={setTripType} />

      <form onSubmit={handleSubmit} className="space-y-4 overflow-visible">
        {/* From / To Row */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 overflow-visible">
          <AirportSearchInput
            type="departure"
            placeholder="Terbang dari mana?"
            value={from}
            onChange={setFrom}
            onAirportSelect={(airport) => setFromAirport(airport)}
            name="from"
            id="from"
          />
          
          {/* Swap Button - Positioned in the middle */}
          <SwapButton onClick={handleSwap} />
          
          <AirportSearchInput
            type="arrival"
            placeholder="Mau ke mana?"
            value={to}
            onChange={setTo}
            onAirportSelect={(airport) => setToAirport(airport)}
            name="to"
            id="to"
          />
        </div>

        {/* Date & Passengers Row */}
        <div className={cn(
          "grid gap-4",
          tripType === "round-trip" 
            ? "grid-cols-1 md:grid-cols-3" 
            : "grid-cols-1 md:grid-cols-2"
        )}>
          <FlightDatePicker
            label="Keberangkatan"
            placeholder="Pilih tanggal"
            selectedDate={departureDate}
            onDateSelect={setDepartureDate}
          />
          
          {tripType === "round-trip" && (
            <FlightDatePicker
              label="Kepulangan"
              placeholder="Pilih tanggal"
              selectedDate={returnDate}
              onDateSelect={setReturnDate}
            />
          )}
          
          <PassengerDropdown
            passengers={passengers}
            setPassengers={setPassengers}
            flightClass={flightClass}
            setFlightClass={setFlightClass}
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full md:w-auto md:min-w-[200px] mx-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          <Search className="w-5 h-5" />
          CARI PENERBANGAN
        </button>
      </form>
    </div>
  );
}

export default FlightSearchCard;
