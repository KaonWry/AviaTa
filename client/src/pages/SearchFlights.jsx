import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFlightSelection } from "../context/FlightSelectionContext";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { 
  Plane,
  Clock,
  ArrowRight,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
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
import { PremiumCheckbox } from "../components/ui/premium-checkbox";

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

function matchesDepartureTimeFilter(flight, selectedRanges) {
  if (!Array.isArray(selectedRanges) || selectedRanges.length === 0) return true;

  const departure = new Date(flight?.departureTime);
  if (Number.isNaN(departure.getTime())) return false;

  const hour = departure.getHours();
  const ranges = {
    morning: [6, 12],
    afternoon: [12, 18],
    evening: [18, 24],
  };

  return selectedRanges.some((key) => {
    const range = ranges[key];
    if (!range) return false;
    const [start, end] = range;
    return hour >= start && hour < end;
  });
}

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
          <div className="mt-3 space-y-3">
            {[
              { id: 'morning', label: 'Pagi (06:00 - 12:00)', range: [6, 12] },
              { id: 'afternoon', label: 'Siang (12:00 - 18:00)', range: [12, 18] },
              { id: 'evening', label: 'Malam (18:00 - 00:00)', range: [18, 24] },
            ].map((time) => (
              <PremiumCheckbox
                key={time.id}
                id={`time-${time.id}`}
                label={time.label}
                checked={filters.departureTime?.includes(time.id) || false}
                onChange={() => {
                  const current = filters.departureTime || [];
                  const isChecked = current.includes(time.id);
                  setFilters({
                    ...filters,
                    departureTime: isChecked 
                      ? current.filter(t => t !== time.id)
                      : [...current, time.id]
                  });
                }}
                size="sm"
                variant="compact"
              />
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
          <div className="mt-3 space-y-3">
            {airlines.map((airline) => (
              <PremiumCheckbox
                key={airline.code}
                id={`airline-${airline.code}`}
                label={airline.name}
                checked={filters.airlines?.includes(airline.code) || false}
                onChange={() => {
                  const current = filters.airlines || [];
                  const isChecked = current.includes(airline.code);
                  setFilters({
                    ...filters,
                    airlines: isChecked 
                      ? current.filter(a => a !== airline.code)
                      : [...current, airline.code]
                  });
                }}
                size="sm"
                variant="compact"
              />
            ))}
          </div>
        )}
      </div>

      {/* Direct Only */}
      <div className="border-t border-border pt-4">
        <PremiumCheckbox
          id="direct-only"
          label="Hanya Penerbangan Langsung"
          description="Tampilkan penerbangan tanpa transit"
          checked={filters.directOnly || false}
          onChange={() => setFilters({ ...filters, directOnly: !filters.directOnly })}
          size="sm"
        />
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
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Semua tanggal';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{from || 'Semua Kota'}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{to || 'Semua Tujuan'}</span>
        </div>
        <div className="w-px h-4 bg-border hidden md:block" />
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{formatDate(date)}</span>
        </div>
        <div className="w-px h-4 bg-border hidden md:block" />
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{passengers || 1} Penumpang</span>
        </div>
        {(!from && !to && !date) && (
          <>
            <div className="w-px h-4 bg-border hidden md:block" />
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Menampilkan semua penerbangan
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// Main Search Page
export function SearchFlights() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSearchCard, setShowSearchCard] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('price_asc');
  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const prevParamsRef = useRef({ from: null, to: null, departure: null, page: null });

  // Get search params
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departure = searchParams.get('departure') || '';
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';
  const infants = searchParams.get('infants') || '0';
  const flightClass = searchParams.get('class') || 'economy';
  const page = parseInt(searchParams.get('page')) || 1;
  const passengers = parseInt(adults) + parseInt(children);

  // Fetch airlines for filter
  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/airlines');
        const data = await response.json();
        if (data.airlines) {
          setAirlines(data.airlines.map(a => ({ code: a.code, name: a.name })));
        }
      } catch (err) {
        console.error('Failed to fetch airlines:', err);
        // Fallback airlines
        setAirlines([
          { code: 'GA', name: 'Garuda Indonesia' },
          { code: 'SQ', name: 'Singapore Airlines' },
          { code: 'QZ', name: 'AirAsia Indonesia' },
          { code: 'JT', name: 'Lion Air' },
          { code: 'QG', name: 'Citilink' },
        ]);
      }
    };
    fetchAirlines();
  }, []);

  // Fetch flights from API
  useEffect(() => {
    let isMounted = true;
    
    const fetchFlights = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        if (departure) params.append('departure', departure);
        params.append('adults', adults);
        params.append('children', children);
        params.append('infants', infants);
        params.append('flightClass', flightClass);
        params.append('page', page.toString());
        params.append('limit', '10');
        
        // Add sorting
        if (sortBy.includes('price')) {
          params.append('sortBy', 'base_price');
          params.append('sortOrder', sortBy === 'price_asc' ? 'ASC' : 'DESC');
        } else if (sortBy === 'departure_asc') {
          params.append('sortBy', 'departure_time');
          params.append('sortOrder', 'ASC');
        }

        const response = await fetch(`http://localhost:3001/api/flights/search?${params.toString()}`);
        const data = await response.json();

        if (!isMounted) return;

        if (data.success && data.flights) {
          // Update pagination info
          if (data.pagination) {
            setPagination(data.pagination);
          }
          
          // Add some default promos based on conditions
          const flightsWithPromos = data.flights.map(flight => {
            const promos = [];
            
            // Add 12.12 promo for December flights
            const depDate = new Date(flight.departureTime);
            if (depDate.getMonth() === 11) { // December
              promos.push({
                title: '12.12 Super Sale',
                shortTitle: '12.12 Sale',
                description: 'Unlock Exclusive Deals only on 12.12 Super Sale'
              });
            }

            // Add first flight promo
            if (flight.isRefundable) {
              promos.push({
                title: 'First Flight Discount',
                shortTitle: 'First Flight',
                description: 'Use code FLYAVIATA to get up to Rp 250.000 off',
                code: 'FLYAVIATA'
              });
            }

            return { ...flight, promos };
          });

          setFlights(flightsWithPromos);
        } else {
          setFlights([]);
        }
      } catch (err) {
        console.error('Failed to fetch flights:', err);
        if (isMounted) {
          setError('Gagal memuat data penerbangan. Pastikan server berjalan.');
          setFlights([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Check if params changed
    const paramsChanged = 
      prevParamsRef.current.from !== from ||
      prevParamsRef.current.to !== to ||
      prevParamsRef.current.departure !== departure ||
      prevParamsRef.current.page !== page;
    
    if (paramsChanged) {
      prevParamsRef.current = { from, to, departure, page };
    }

    fetchFlights();
    
    return () => {
      isMounted = false;
    };
  }, [from, to, departure, adults, children, infants, flightClass, page, sortBy]);

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort flights
  const filteredFlights = flights
    .filter(flight => {
      const maxPrice = filters.maxPrice == null ? null : Number(filters.maxPrice);
      const flightPrice = Number(flight?.price ?? flight?.base_price ?? 0);
      if (Number.isFinite(maxPrice) && flightPrice > maxPrice) return false;
      if (filters.airlines?.length && !filters.airlines.includes(flight.airline.code)) return false;
      if (filters.directOnly && flight.stops > 0) return false;
      if (!matchesDepartureTimeFilter(flight, filters.departureTime)) return false;
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

  const navigate = useNavigate();
  const { setSelectedFlight } = useFlightSelection();

  const handleSelectFlight = (flight) => {
    const normalizedFlightId = typeof flight?.id === 'string' ? Number(flight.id) : flight?.id;

    // Save selected flight to context and redirect to Passengers page
    setSelectedFlight({
      ...flight,
      id: normalizedFlightId,
      originCity: flight.origin?.city,
      originCode: flight.origin?.code,
      destinationCity: flight.destination?.city,
      destinationCode: flight.destination?.code,
      className: flight.className || 'Economy',
      totalPassengers: parseInt(adults) + parseInt(children) + parseInt(infants),
      flightClassCode: flightClass,
    });
    navigate('/account/passengers');
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-8">
      <div className="container mx-auto px-4">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

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
                {isLoading ? 'Mencari penerbangan...' : (
                  <>
                    <span className="font-medium text-foreground">{pagination.totalItems}</span> penerbangan ditemukan
                    {pagination.totalPages > 1 && (
                      <span> • Halaman {pagination.currentPage} dari {pagination.totalPages}</span>
                    )}
                  </>
                )}
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6 pb-4">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                              pageNum === pagination.currentPage
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-card hover:bg-muted'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
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
