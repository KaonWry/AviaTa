import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import TicketTypeModal from "./TicketTypeModal"; 
import { 
  Plane,
  Luggage,
  Gift,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Wifi,
  PlugZap,
  Tv,
  Armchair,
  RefreshCw,
  Info,
  Tag,
  Clock
} from "lucide-react";

// --- HELPER FUNCTIONS ---
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
}

function calculateDuration(departure, arrival) {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}j ${minutes}m`;
}

// --- SUB COMPONENTS ---

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active 
          ? 'text-primary border-primary' 
          : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
      }`}
    >
      {children}
    </button>
  );
}

function FlightDetailsTab({ flight }) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-foreground">{formatTime(flight.departureTime)}</div>
          <div className="text-xs text-muted-foreground">{formatDate(flight.departureTime)}</div>
          <div className="w-3 h-3 rounded-full bg-primary mt-2" />
          <div className="w-0.5 h-32 bg-border my-2" />
          <div className="w-3 h-3 rounded-full border-2 border-primary bg-background" />
          <div className="text-sm font-medium text-foreground mt-2">{formatTime(flight.arrivalTime)}</div>
          <div className="text-xs text-muted-foreground">{formatDate(flight.arrivalTime)}</div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <p className="font-semibold text-foreground">{flight.origin.city} ({flight.origin.code})</p>
            <p className="text-sm text-muted-foreground">{flight.origin.name}</p>
            <p className="text-sm text-muted-foreground">Terminal {flight.departureTerminal || '2'}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{flight.airline.name}</span>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                {flight.airline.code}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {flight.flightNumber} • {flight.flightClass || 'Economy'}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Luggage className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Baggage {flight.baggage || '0'} kg</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Luggage className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Cabin baggage 7 kg</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Plane className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{flight.aircraft || 'Airbus A320'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Armchair className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{flight.seatLayout || '3-3'} Seat layout</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {calculateDuration(flight.departureTime, flight.arrivalTime)}
          </div>

          <div>
            <p className="font-semibold text-foreground">{flight.destination.city} ({flight.destination.code})</p>
            <p className="text-sm text-muted-foreground">{flight.destination.name}</p>
            <p className="text-sm text-muted-foreground">Terminal {flight.arrivalTerminal || '4'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FareBenefitsTab({ flight }) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-muted/30 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Plane className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{flight.airline.name}</p>
            <p className="text-sm text-muted-foreground">
              {flight.origin.city} → {flight.destination.city} • {flight.flightClass || 'Economy'}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm">
            {flight.isRefundable ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">Refundable</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-medium">Non-Refundable</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {flight.isReschedulable ? (
              <>
                <RefreshCw className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">Reschedule Available</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-medium">No Reschedule</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RefundTab({ flight }) {
  return (
    <div className="p-4 md:p-6">
       <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Refund Policy</h4>
          <p className="text-sm text-muted-foreground">
            {flight.isRefundable 
              ? "This flight is refundable. Terms and conditions apply." 
              : "This flight is non-refundable."}
          </p>
       </div>
    </div>
  );
}

function RescheduleTab({ flight }) {
  return (
    <div className="p-4 md:p-6">
       <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Reschedule Policy</h4>
          <p className="text-sm text-muted-foreground">
            {flight.isReschedulable 
              ? "Reschedule is available with a fee." 
              : "Reschedule is not available for this flight."}
          </p>
       </div>
    </div>
  );
}

function PromosTab({ flight }) {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h4 className="font-semibold text-foreground">Available Promos</h4>
      {flight.promos && flight.promos.length > 0 ? (
        <div className="space-y-3">
          {flight.promos.map((promo, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
              <Gift className="w-5 h-5 text-primary mt-1" />
              <div>
                <h5 className="font-semibold text-foreground">{promo.title}</h5>
                <p className="text-sm text-muted-foreground">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No promos available.</p>
      )}
    </div>
  );
}


// --- MAIN COMPONENT ---
export function FlightResultCard({ flight, onSelect }) {
  const [ticketOpen, setTicketOpen] = useState(false);
  const [activeFlight, setActiveFlight] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const tabs = [
    { id: 'details', label: 'Flight Details' },
    { id: 'fare', label: 'Fare & Benefits' },
    { id: 'refund', label: 'Refund' },
    { id: 'reschedule', label: 'Reschedule' },
    { id: 'promos', label: 'Promos', icon: Gift },
  ];

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow relative"
    >
      {/* Header - Always Visible */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Airline Info */}
          <div className="flex items-center gap-3 md:w-44">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {flight.airline.logo ? (
                <img src={flight.airline.logo} alt={flight.airline.name} className="w-8 h-8 object-contain" />
              ) : (
                <Plane className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{flight.airline.name}</p>
              <div className="flex items-center gap-1 mt-0.5 px-1.5 py-0.5 bg-muted rounded w-fit">
                 <Luggage className="w-3 h-3 text-muted-foreground" />
                 <span className="text-xs text-muted-foreground">{flight.baggage || 0}kg</span>
              </div>
            </div>
          </div>

          {/* Flight Times */}
          <div className="flex-1 flex items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatTime(flight.departureTime)}</p>
              <p className="text-sm text-muted-foreground">{flight.origin.code}</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <p className="text-xs text-muted-foreground mb-1">
                {calculateDuration(flight.departureTime, flight.arrivalTime)}
              </p>
              <div className="w-full flex items-center gap-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatTime(flight.arrivalTime)}</p>
              <p className="text-sm text-muted-foreground">{flight.destination.code}</p>
            </div>
          </div>

          {/* Price & Select */}
          <div className="flex flex-col items-end gap-1 md:w-48">
            <p className="text-2xl font-bold text-primary">{formatPrice(flight.price)}</p>
            <p className="text-xs text-muted-foreground">/pax</p>
          </div>
        </div>

        {/* Promo Tags */}
        {flight.promos && flight.promos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {flight.promos.slice(0, 2).map((promo, idx) => (
              <div 
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
              >
                <Gift className="w-3 h-3" />
                {promo.shortTitle || promo.title}
              </div>
            ))}
          </div>
        )}

        {/* Tabs & Choose Button */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center overflow-x-auto no-scrollbar gap-2">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={isExpanded && activeTab === tab.id}
                onClick={() => {
                  if (!isExpanded) {
                    setIsExpanded(true);
                  }
                  setActiveTab(tab.id);
                }}
              >
                <span className="flex items-center gap-1.5">
                  {tab.label}
                  {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                </span>
              </TabButton>
            ))}
          </div>
          
          <button
            onClick={() => {
              setActiveFlight(flight); 
              setTicketOpen(true);    
            }}
            className="ml-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0 shadow-lg shadow-primary/20"
          >
            Choose
          </button>
        </div>
      </div>

      {/* Expanded Tab Content (LOGIC LENGKAP) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-muted/20"
          >
            {/* INI BAGIAN YANG TADI HILANG */}
            {activeTab === 'details' && <FlightDetailsTab flight={flight} />}
            {activeTab === 'fare' && <FareBenefitsTab flight={flight} />}
            {activeTab === 'refund' && <RefundTab flight={flight} />}
            {activeTab === 'reschedule' && <RescheduleTab flight={flight} />}
            {activeTab === 'promos' && <PromosTab flight={flight} />}
            
            <div className="px-4 pb-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    
    {/* MODAL BERADA DI LUAR CARD AGAR TIDAK TERSEMBUNYI */}
    <TicketTypeModal
      open={ticketOpen}
      flight={flight}
      onClose={() => {
        setTicketOpen(false);
        setActiveFlight(null);
      }}
      onSelect={(picked) => {
        setTicketOpen(false);
        setActiveFlight(null);
        onSelect?.(picked); 
      }}
    />
    </>
  );
}

export default FlightResultCard;