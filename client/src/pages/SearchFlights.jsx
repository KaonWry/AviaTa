import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { 
  Plane,
  Clock,
  ArrowRight,
  Filter,
  ChevronDown,
  ChevronUp,
  Luggage,
  Utensils,
  Wifi,
  Zap,
  SlidersHorizontal,
  X,
  Calendar,
  Users,
  MapPin
} from "lucide-react";
import { FlightSearchCard } from "../components/ui/flight-search-card";
import { FlightResultCard } from "../components/ui/flight-result-card";

// Format price to IDR
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// Format time
function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calculate duration
function calculateDuration(departure, arrival) {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}j ${minutes}m`;
}

// Flight amenities icons
const amenityIcons = {
  baggage: Luggage,
  meal: Utensils,
  wifi: Wifi,
  entertainment: Zap
};

// Filter Sidebar Component
function FilterSidebar({ filters, setFilters, airlines }) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    time: true,
    airlines: true,
    stops: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </h3>
        <button 
          onClick={() => setFilters({})}
          className="text-xs text-primary hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="border-t border-border pt-4">
        <button 
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-sm font-medium text-foreground"
        >
          Harga
          {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.price && (
          <div className="mt-3 space-y-2">
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.maxPrice || 10000000}
              onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Rp 0</span>
              <span>{formatPrice(filters.maxPrice || 10000000)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Departure Time */}
      <div className="border-t border-border pt-4">
        <button 
          onClick={() => toggleSection('time')}
          className="w-full flex items-center justify-between text-sm font-medium text-foreground"
        >
          Waktu Keberangkatan
          {expandedSections.time ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.time && (
          <div className="mt-3 space-y-2">
            {[
              { id: 'morning', label: 'Pagi (06:00 - 12:00)', range: [6, 12] },
              { id: 'afternoon', label: 'Siang (12:00 - 18:00)', range: [12, 18] },
              { id: 'evening', label: 'Malam (18:00 - 00:00)', range: [18, 24] },
            ].map((time) => (
              <label key={time.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.departureTime?.includes(time.id) || false}
                  onChange={(e) => {
                    const current = filters.departureTime || [];
                    setFilters({
                      ...filters,
                      departureTime: e.target.checked 
                        ? [...current, time.id]
                        : current.filter(t => t !== time.id)
                    });
                  }}
                  className="rounded border-border accent-primary"
                />
                <span className="text-muted-foreground">{time.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Airlines */}
      <div className="border-t border-border pt-4">
        <button 
          onClick={() => toggleSection('airlines')}
          className="w-full flex items-center justify-between text-sm font-medium text-foreground"
        >
          Maskapai
          {expandedSections.airlines ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.airlines && (
          <div className="mt-3 space-y-2">
            {airlines.map((airline) => (
              <label key={airline.code} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.airlines?.includes(airline.code) || false}
                  onChange={(e) => {
                    const current = filters.airlines || [];
                    setFilters({
                      ...filters,
                      airlines: e.target.checked 
                        ? [...current, airline.code]
                        : current.filter(a => a !== airline.code)
                    });
                  }}
                  className="rounded border-border accent-primary"
                />
                <span className="text-muted-foreground">{airline.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Direct Only */}
      <div className="border-t border-border pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.directOnly || false}
            onChange={(e) => setFilters({ ...filters, directOnly: e.target.checked })}
            className="rounded border-border accent-primary"
          />
          <span className="text-foreground font-medium">Hanya Penerbangan Langsung</span>
        </label>
      </div>
    </div>
  );
}

// Sort Options
function SortOptions({ sortBy, setSortBy }) {
  const options = [
    { value: 'price_asc', label: 'Harga Terendah' },
    { value: 'price_desc', label: 'Harga Tertinggi' },
    { value: 'departure_asc', label: 'Keberangkatan Tercepat' },
    { value: 'duration_asc', label: 'Durasi Tersingkat' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Urutkan:</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Flight Card Component
function FlightCard({ flight, onSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Airline Info */}
          <div className="flex items-center gap-3 md:w-40">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {flight.airline.logo ? (
                <img src={flight.airline.logo} alt={flight.airline.name} className="w-8 h-8 object-contain" />
              ) : (
                <Plane className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{flight.airline.name}</p>
              <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
            </div>
          </div>

          {/* Flight Times */}
          <div className="flex-1 flex items-center gap-4">
            {/* Departure */}
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatTime(flight.departureTime)}</p>
              <p className="text-sm text-muted-foreground">{flight.origin.code}</p>
            </div>

            {/* Duration & Route */}
            <div className="flex-1 flex flex-col items-center">
              <p className="text-xs text-muted-foreground mb-1">{calculateDuration(flight.departureTime, flight.arrivalTime)}</p>
              <div className="w-full flex items-center gap-2">
                <div className="flex-1 h-px bg-border" />
                <Plane className="w-4 h-4 text-primary rotate-90" />
                <div className="flex-1 h-px bg-border" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {flight.stops === 0 ? 'Langsung' : `${flight.stops} Transit`}
              </p>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatTime(flight.arrivalTime)}</p>
              <p className="text-sm text-muted-foreground">{flight.destination.code}</p>
            </div>
          </div>

          {/* Price & Select */}
          <div className="flex flex-col items-end gap-2 md:w-48">
            <p className="text-2xl font-bold text-primary">{formatPrice(flight.price)}</p>
            <p className="text-xs text-muted-foreground">/orang</p>
            <button
              onClick={() => onSelect(flight)}
              className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Pilih
            </button>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {isExpanded ? 'Sembunyikan' : 'Lihat'} Detail
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-muted/30"
          >
            <div className="p-4 md:p-6 space-y-4">
              {/* Route Details */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-px h-16 bg-border" />
                  <div className="w-3 h-3 rounded-full border-2 border-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="font-medium text-foreground">{formatTime(flight.departureTime)} - {flight.origin.name}</p>
                    <p className="text-sm text-muted-foreground">{flight.origin.city}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{formatTime(flight.arrivalTime)} - {flight.destination.name}</p>
                    <p className="text-sm text-muted-foreground">{flight.destination.city}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-4">
                {flight.amenities?.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Zap;
                  return (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Empty State
function EmptyFlights() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Plane className="w-16 h-16 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Tidak Ada Penerbangan Ditemukan</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Coba ubah tanggal atau tujuan penerbangan Anda untuk menemukan lebih banyak pilihan.
      </p>
    </div>
  );
}

// Search Summary Header
function SearchSummary({ from, to, date, passengers }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{from || 'Asal'}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{to || 'Tujuan'}</span>
        </div>
        <div className="w-px h-4 bg-border hidden md:block" />
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{date || 'Pilih tanggal'}</span>
        </div>
        <div className="w-px h-4 bg-border hidden md:block" />
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{passengers || 1} Penumpang</span>
        </div>
      </div>
    </div>
  );
}

// Main Search Page
export function SearchFlights() {
  const [searchParams] = useSearchParams();
  const [showSearchCard, setShowSearchCard] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('price_asc');
  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const prevParamsRef = useRef({ from: null, to: null, departure: null });

  // Get search params
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departure = searchParams.get('departure') || '';
  const passengers = parseInt(searchParams.get('adults') || '1') + 
                     parseInt(searchParams.get('children') || '0');

  // Mock airlines for filter
  const airlines = [
    { code: 'GA', name: 'Garuda Indonesia' },
    { code: 'SQ', name: 'Singapore Airlines' },
    { code: 'AK', name: 'AirAsia' },
    { code: 'JT', name: 'Lion Air' },
    { code: 'QG', name: 'Citilink' },
  ];

  // Mock flight data - In production, this would come from API
  useEffect(() => {
    let isMounted = true;
    
    // Check if params actually changed to avoid unnecessary re-fetches
    const paramsChanged = 
      prevParamsRef.current.from !== from ||
      prevParamsRef.current.to !== to ||
      prevParamsRef.current.departure !== departure;
    
    if (paramsChanged) {
      prevParamsRef.current = { from, to, departure };
    }
    
    // Simulate API call
    const timer = setTimeout(() => {
      if (!isMounted) return;
      const mockFlights = [
        {
          id: 1,
          flightNumber: 'GA402',
          airline: { code: 'GA', name: 'Garuda Indonesia', logo: null },
          origin: { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta' },
          destination: { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali' },
          departureTime: '2025-12-24T08:00:00',
          arrivalTime: '2025-12-24T10:50:00',
          departureTerminal: '3',
          arrivalTerminal: 'D',
          price: 1500000,
          stops: 0,
          flightClass: 'Economy',
          baggage: 20,
          aircraft: 'Boeing 737-800',
          seatLayout: '3-3',
          seatPitch: '31',
          hasWifi: true,
          hasEntertainment: true,
          hasPower: true,
          hasMeal: true,
          isRefundable: true,
          isReschedulable: true,
          rescheduleFee: 350000,
          promos: [
            { title: '12.12 Super Sale', shortTitle: '12.12 Sale', description: 'Unlock Exclusive Deals only on 12.12 Super Sale' },
            { title: 'First Flight Discount', shortTitle: 'First Flight', description: 'Use code FLYAVIATA to get up to Rp 250.000 off', code: 'FLYAVIATA' }
          ]
        },
        {
          id: 2,
          flightNumber: 'JT32',
          airline: { code: 'JT', name: 'Lion Air', logo: null },
          origin: { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta' },
          destination: { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali' },
          departureTime: '2025-12-24T09:30:00',
          arrivalTime: '2025-12-24T12:20:00',
          departureTerminal: '1A',
          arrivalTerminal: 'D',
          price: 850000,
          stops: 0,
          flightClass: 'Economy',
          baggage: 0,
          aircraft: 'Boeing 737-900ER',
          seatLayout: '3-3',
          seatPitch: '29',
          hasWifi: false,
          hasEntertainment: false,
          hasPower: false,
          hasMeal: false,
          isRefundable: false,
          isReschedulable: true,
          rescheduleFee: 150000,
          promos: []
        },
        {
          id: 3,
          flightNumber: 'QG802',
          airline: { code: 'QG', name: 'Citilink', logo: null },
          origin: { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta' },
          destination: { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali' },
          departureTime: '2025-12-24T14:00:00',
          arrivalTime: '2025-12-24T16:50:00',
          departureTerminal: '2D',
          arrivalTerminal: 'D',
          price: 750000,
          stops: 0,
          flightClass: 'Economy',
          baggage: 0,
          aircraft: 'Airbus A320',
          seatLayout: '3-3',
          seatPitch: '28',
          hasWifi: false,
          hasEntertainment: false,
          hasPower: false,
          hasMeal: false,
          isRefundable: false,
          isReschedulable: true,
          rescheduleFee: 100000,
          promos: [
            { title: 'Weekend Deal', shortTitle: 'Weekend Deal', description: 'Get extra 10% off for weekend flights' }
          ]
        },
        {
          id: 4,
          flightNumber: 'GA836',
          airline: { code: 'GA', name: 'Garuda Indonesia', logo: null },
          origin: { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta' },
          destination: { code: 'SIN', name: 'Changi International Airport', city: 'Singapore' },
          departureTime: '2025-12-24T06:15:00',
          arrivalTime: '2025-12-24T09:00:00',
          departureTerminal: '3',
          arrivalTerminal: '3',
          price: 2500000,
          stops: 0,
          flightClass: 'Economy',
          baggage: 30,
          aircraft: 'Airbus A330-300',
          seatLayout: '2-4-2',
          seatPitch: '32',
          hasWifi: true,
          hasEntertainment: true,
          hasPower: true,
          hasMeal: true,
          isRefundable: true,
          isReschedulable: true,
          rescheduleFee: 500000,
          promos: [
            { title: 'International Route Promo', shortTitle: 'Intl Promo', description: 'Special price for international routes', code: 'GOFLYINT' }
          ]
        },
        {
          id: 5,
          flightNumber: 'QZ260',
          airline: { code: 'QZ', name: 'AirAsia Indonesia', logo: null },
          origin: { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta' },
          destination: { code: 'SIN', name: 'Changi International Airport', city: 'Singapore' },
          departureTime: '2025-12-24T16:30:00',
          arrivalTime: '2025-12-24T19:20:00',
          departureTerminal: '2F',
          arrivalTerminal: '4',
          price: 2400800,
          stops: 0,
          flightClass: 'Economy',
          baggage: 0,
          aircraft: 'Airbus A320-100/200',
          seatLayout: '3-3',
          seatPitch: '28',
          hasWifi: true,
          hasEntertainment: false,
          hasPower: false,
          hasMeal: false,
          isRefundable: false,
          isReschedulable: true,
          rescheduleFee: 773099,
          promos: [
            { title: '12.12 Super Sale', shortTitle: '12.12 Sale', description: 'Unlock Exclusive Deals only on 12.12 Super Sale' },
            { title: 'Code FLYOVERSEANOW for your first flight!', shortTitle: 'First Flight', description: 'Booking your first flight? Use the code to get up to Rp 250.000 off', code: 'FLYOVERSEANOW' }
          ]
        },
        {
          id: 6,
          flightNumber: 'SQ951',
          airline: { code: 'SQ', name: 'Singapore Airlines', logo: null },
          origin: { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta' },
          destination: { code: 'SIN', name: 'Changi International Airport', city: 'Singapore' },
          departureTime: '2025-12-24T10:30:00',
          arrivalTime: '2025-12-24T13:15:00',
          departureTerminal: '3',
          arrivalTerminal: '2',
          price: 3200000,
          stops: 0,
          flightClass: 'Economy',
          baggage: 30,
          aircraft: 'Boeing 787-10',
          seatLayout: '3-3-3',
          seatPitch: '32',
          hasWifi: true,
          hasEntertainment: true,
          hasPower: true,
          hasMeal: true,
          isRefundable: true,
          isReschedulable: true,
          rescheduleFee: 800000,
          promos: []
        },
      ];

      setFlights(mockFlights);
      setIsLoading(false);
    }, 1000);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [from, to, departure]);

  // Filter and sort flights
  const filteredFlights = flights
    .filter(flight => {
      if (filters.maxPrice && flight.price > filters.maxPrice) return false;
      if (filters.airlines?.length && !filters.airlines.includes(flight.airline.code)) return false;
      if (filters.directOnly && flight.stops > 0) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'departure_asc': return new Date(a.departureTime) - new Date(b.departureTime);
        case 'duration_asc': {
          const durationA = new Date(a.arrivalTime) - new Date(a.departureTime);
          const durationB = new Date(b.arrivalTime) - new Date(b.departureTime);
          return durationA - durationB;
        }
        default: return 0;
      }
    });

  const handleSelectFlight = (flight) => {
    // Navigate to booking page or show booking modal
    console.log('Selected flight:', flight);
    alert(`Anda memilih ${flight.airline.name} ${flight.flightNumber}\nHarga: ${formatPrice(flight.price)}`);
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-8">
      <div className="container mx-auto px-4">
        {/* Search Summary */}
        <SearchSummary from={from} to={to} date={departure} passengers={passengers} />

        {/* Toggle Search Form */}
        <button
          onClick={() => setShowSearchCard(!showSearchCard)}
          className="mb-6 flex items-center gap-2 text-sm text-primary hover:underline"
        >
          {showSearchCard ? 'Sembunyikan' : 'Ubah'} Pencarian
          {showSearchCard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Collapsible Search Card */}
        <AnimatePresence>
          {showSearchCard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <FlightSearchCard />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 shrink-0">
            <FilterSidebar 
              key="filter-sidebar"
              filters={filters} 
              setFilters={setFilters} 
              airlines={airlines}
            />
          </aside>

          {/* Flight Results */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Mencari penerbangan...' : `${filteredFlights.length} penerbangan ditemukan`}
              </p>
              <SortOptions sortBy={sortBy} setSortBy={setSortBy} />
            </div>

            {/* Flight List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-1/6" />
                      </div>
                      <div className="h-8 bg-muted rounded w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFlights.length > 0 ? (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightResultCard 
                    key={flight.id} 
                    flight={flight} 
                    onSelect={handleSelectFlight}
                  />
                ))}
              </div>
            ) : (
              <EmptyFlights />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default SearchFlights;
