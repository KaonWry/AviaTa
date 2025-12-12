import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import TicketTypeModal from "./TicketTypeModal";
import { 
  Plane,
  Luggage,
  Utensils,
  Wifi,
  Zap,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Clock,
  Calendar,
  Tag,
  RefreshCw,
  AlertCircle,
  Info,
  Gift,
  CreditCard,
  Shield,
  Armchair,
  PlugZap,
  Tv
} from "lucide-react";

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

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
}

// Calculate duration
function calculateDuration(departure, arrival) {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}j ${minutes}m`;
}

// Tab Button Component
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

// Flight Details Tab Content
function FlightDetailsTab({ flight }) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Timeline */}
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
          {/* Departure */}
          <div>
            <p className="font-semibold text-foreground">{flight.origin.city} ({flight.origin.code})</p>
            <p className="text-sm text-muted-foreground">{flight.origin.name}</p>
            <p className="text-sm text-muted-foreground">Terminal {flight.departureTerminal || '2'}</p>
          </div>

          {/* Flight Info */}
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
              <div className="flex items-center gap-2 text-sm">
                {flight.hasWifi ? (
                  <>
                    <Wifi className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">WiFi available</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 text-muted-foreground opacity-50" />
                    <span className="text-muted-foreground">No WiFi</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {flight.hasEntertainment ? (
                  <>
                    <Tv className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">In-flight entertainment</span>
                  </>
                ) : (
                  <>
                    <Tv className="w-4 h-4 text-muted-foreground opacity-50" />
                    <span className="text-muted-foreground">No entertainment</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {flight.hasPower ? (
                  <>
                    <PlugZap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Power/USB available</span>
                  </>
                ) : (
                  <>
                    <PlugZap className="w-4 h-4 text-muted-foreground opacity-50" />
                    <span className="text-muted-foreground">No power port</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Armchair className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{flight.seatPitch || '28'}-inches Seat pitch</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {calculateDuration(flight.departureTime, flight.arrivalTime)}
          </div>

          {/* Arrival */}
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

// Fare & Benefits Tab Content
function FareBenefitsTab({ flight }) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Conditions */}
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

      {/* Special Deals */}
      {flight.promos && flight.promos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Special Deals</h4>
          {flight.promos.map((promo, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Gift className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{promo.title}</p>
                <p className="text-sm text-muted-foreground">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Refund Tab Content
function RefundTab({ flight }) {
  const [activeSection, setActiveSection] = useState('policy');

  const sections = [
    { id: 'policy', label: 'Your Refund Policy' },
    { id: 'estimation', label: 'Refund Estimation' },
    { id: 'process', label: 'Refund Process' },
    { id: 'other', label: 'Other Refund Info' },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{flight.airline.name}</span>
          </div>
          <span className="text-sm text-muted-foreground">{flight.flightClass || 'Economy'}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {flight.origin.city} → {flight.destination.city}
        </p>
        <div className="flex items-center gap-2 mt-3">
          {flight.isRefundable ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium text-sm">Refundable</span>
            </>
          ) : (
            <>
              <X className="w-4 h-4 text-red-500" />
              <span className="text-red-600 font-medium text-sm">Non-Refundable</span>
            </>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <div className="md:w-56 shrink-0 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                activeSection === section.id
                  ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'policy' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Your Refund Policy</h4>
              {flight.isRefundable ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    You can request a refund for this ticket. The refund amount will depend on when you submit the request.
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-500/10 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> An admin fee may apply to all refund requests.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    However, should you need to refund your ticket due to reasons beyond your control, you will still be able to submit a refund request:
                  </p>
                  <div className="space-y-2 mt-4">
                    <p className="text-sm text-muted-foreground">Reasons beyond your control include:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Flight canceled by airline</li>
                      <li>Flight rescheduled by airline</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'estimation' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Refund Estimation</h4>
              <div className="bg-muted/30 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Time Before Departure</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-2 text-foreground">&gt; 72 hours</td>
                      <td className="py-2 text-right text-foreground">{flight.isRefundable ? '75%' : '0%'}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2 text-foreground">24 - 72 hours</td>
                      <td className="py-2 text-right text-foreground">{flight.isRefundable ? '50%' : '0%'}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-foreground">&lt; 24 hours</td>
                      <td className="py-2 text-right text-foreground">{flight.isRefundable ? '25%' : '0%'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'process' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Refund Process</h4>
              <ol className="space-y-4">
                {[
                  { step: 1, title: 'Submit Request', desc: 'Go to My Bookings and select the booking you want to refund' },
                  { step: 2, title: 'Review', desc: 'Our team will review your refund request within 1-3 business days' },
                  { step: 3, title: 'Approval', desc: 'Once approved, the refund will be processed' },
                  { step: 4, title: 'Receive Refund', desc: 'Refund will be credited to your original payment method within 7-14 business days' },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeSection === 'other' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Other Refund Info</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Refunds for bookings paid with points will be returned as points
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Partial refunds are available for multi-passenger bookings
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Admin fees are non-refundable
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reschedule Tab Content
function RescheduleTab({ flight }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate deadline (48 hours before departure)
  const departureDate = new Date(flight.departureTime);
  const deadline = new Date(departureDate.getTime() - 48 * 60 * 60 * 1000);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Reschedule Status */}
      <div className={`rounded-xl p-4 ${flight.isReschedulable ? 'bg-green-50 dark:bg-green-500/10' : 'bg-red-50 dark:bg-red-500/10'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${flight.isReschedulable ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
            {flight.isReschedulable ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <h4 className={`font-semibold ${flight.isReschedulable ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {flight.isReschedulable ? 'Reschedule with fees' : 'Reschedule not available'}
            </h4>
            {flight.isReschedulable && (
              <>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  <span>Reschedule fee starts from <strong className="text-foreground">{formatPrice(flight.rescheduleFee || 150000)}/pax</strong></span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  If you reschedule to a higher-priced flight, an <strong>additional fee will apply</strong> to cover the price difference.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Deadline */}
      {flight.isReschedulable && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mt-0.5" />
          <div>
            <p>You can submit a reschedule request before</p>
            <p className="font-semibold text-foreground">
              {deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {deadline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} Jakarta Time
            </p>
            <p className="text-xs text-muted-foreground">or 48 hours before departure time</p>
          </div>
        </div>
      )}

      {/* Service Fee Notice */}
      {flight.isReschedulable && (
        <p className="text-sm text-muted-foreground italic">
          A AviaTa service fee of <strong>{formatPrice(60000)}</strong> /pax/route will apply for rescheduling.
        </p>
      )}

      {/* Info Button */}
      {flight.isReschedulable && (
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors">
          <Info className="w-4 h-4" />
          How does rescheduling fees work?
        </button>
      )}

      {/* Collapsible Sections */}
      <div className="space-y-3">
        <div className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('regular')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
          >
            <span className="font-medium text-foreground">Important details to know for Regular Reschedule</span>
            {expandedSections.regular ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandedSections.regular && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-2 text-sm text-muted-foreground">
                  <p>• Reschedule can only be done for the same route</p>
                  <p>• New flight date must be within 1 year from original booking</p>
                  <p>• Class upgrade may incur additional fees</p>
                  <p>• Reschedule is subject to seat availability</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('policies')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
          >
            <span className="font-medium text-foreground">Regular Reschedule policies for flight facilities</span>
            {expandedSections.policies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandedSections.policies && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-2 text-sm text-muted-foreground">
                  <p>• Baggage allowance follows the new ticket's policy</p>
                  <p>• Seat selection may need to be re-selected</p>
                  <p>• Meal preferences will be reset</p>
                  <p>• Add-ons may not be transferable</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Promos Tab Content
function PromosTab({ flight }) {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h4 className="font-semibold text-foreground">Available Promos</h4>
      
      {flight.promos && flight.promos.length > 0 ? (
        <div className="space-y-3">
          {flight.promos.map((promo, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-primary/20">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-foreground">{promo.title}</h5>
                <p className="text-sm text-muted-foreground mt-1">{promo.description}</p>
                {promo.code && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                    <span className="text-xs text-muted-foreground">Code:</span>
                    <span className="font-mono font-semibold text-primary">{promo.code}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No promos available for this flight</p>
        </div>
      )}
    </div>
  );
}

// Main Flight Result Card Component
export function FlightResultCard({ flight, onSelect }) {
  const [ticketOpen, setTicketOpen] = useState(false);
  const [activeFlight, setActiveFlight] = useState(null);

  const tabs = [
    { id: 'details', label: 'Flight Details' },
    { id: 'fare', label: 'Fare & Benefits' },
    { id: 'refund', label: 'Refund' },
    { id: 'reschedule', label: 'Reschedule' },
    { id: 'promos', label: 'Promos', icon: Gift },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
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
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                  <Luggage className="w-3 h-3" />
                  {flight.baggage || 0}kg
                </div>
                {flight.hasWifi && (
                  <Wifi className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
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

            {/* Arrival */}
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
          <div className="flex items-center overflow-x-auto no-scrollbar">
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

            className="ml-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            Choose
          </button>
        </div>
      </div>

      {/* Expanded Tab Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-muted/20"
          >
            {activeTab === 'details' && <FlightDetailsTab flight={flight} />}
            {activeTab === 'fare' && <FareBenefitsTab flight={flight} />}
            {activeTab === 'refund' && <RefundTab flight={flight} />}
            {activeTab === 'reschedule' && <RescheduleTab flight={flight} />}
            {activeTab === 'promos' && <PromosTab flight={flight} />}
            
            {/* Close Button */}
            <div className="px-4 pb-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </button>
            </div>
            <TicketTypeModal
              open={ticketOpen}
              flight={activeFlight}
              onClose={() => {
                setTicketOpen(false);
                setActiveFlight(null);
              }}
              onSelect={(picked) => {
                setTicketOpen(false);
                setActiveFlight(null);
                onSelect?.(picked); // lanjut flow kamu (set selected flight, navigate, dll)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FlightResultCard;
