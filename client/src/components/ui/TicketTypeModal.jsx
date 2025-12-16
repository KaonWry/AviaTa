import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck, CheckCircle2, AlertCircle, Info } from "lucide-react";

// Helper format uang
const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

function buildTicketOptions(flight) {
  const base = Number(flight?.price || 0);
  return [
    {
      id: "eco_basic",
      tag: "Basic",
      labelColor: "text-gray-700",
      price: base,
      points: Math.floor(base / 1000),
      benefits: [
        { text: "Cabin baggage 7 kg", included: true },
        { text: "Checked baggage 0 kg", included: false },
        { text: "Reschedule with fees", included: true },
        { text: "Non-refundable", included: false, alert: true },
      ]
    },
    {
      id: "eco_value",
      tag: "Best Value",
      labelColor: "text-blue-600",
      price: base + 185000,
      points: Math.floor((base + 185000) / 1000),
      badgeText: "BEST VALUE",
      badgeColor: "bg-blue-600",
      recommended: true,
      benefits: [
        { text: "Cabin baggage 7 kg", included: true },
        { text: "Checked baggage 20 kg", included: true },
        { text: "Reschedule with fees", included: true },
        { text: "Non-refundable", included: false, alert: true },
      ]
    },
    {
      id: "eco_flexi",
      tag: "Recommended",
      labelColor: "text-purple-600",
      price: base + 450000,
      points: Math.floor((base + 450000) / 1000),
      badgeText: "RECOMMENDED",
      badgeColor: "bg-purple-600",
      benefits: [
        { text: "Cabin baggage 7 kg", included: true },
        { text: "Checked baggage 20 kg", included: true },
        { text: "Reschedule with fees", included: true },
        { text: "Refundable", included: true, highlight: true },
      ]
    },
  ];
}

export default function TicketTypeModal({ open, onClose, flight, onSelect }) {
  if (!open || !flight) return null;

  const options = useMemo(() => buildTicketOptions(flight), [flight]);
  
  const depTime = new Date(flight.departureTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
  const arrTime = new Date(flight.arrivalTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(flight.departureTime).toLocaleDateString("id-ID", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  
  const duration = (() => {
    const diff = new Date(flight.arrivalTime) - new Date(flight.departureTime);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  })();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Gelap */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
          />

          {/* SIDE DRAWER (Muncul dari Kanan) */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[9999] w-full max-w-5xl bg-background shadow-2xl flex flex-col h-full border-l border-border"
          >
            {/* Header Sticky */}
            <div className="px-6 py-4 border-b border-border flex items-center gap-4 bg-background sticky top-0 z-20">
              <button onClick={onClose} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-6 h-6 text-foreground" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-foreground">Select Ticket Type</h2>
                <p className="text-sm text-muted-foreground">{flight.origin.city} → {flight.destination.city} • {dateStr}</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-muted/30 p-6">
              
              {/* Info Penerbangan Ringkas */}
              <div className="bg-card border border-border rounded-xl p-5 mb-8 shadow-sm">
                 <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <img src={flight.airline?.logo} alt="logo" className="w-10 h-10 object-contain" />
                       <div>
                          <div className="font-bold text-foreground">{flight.airline?.name}</div>
                          <div className="text-xs text-muted-foreground">Economy • {flight.flightNumber}</div>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 text-center">
                       <div>
                          <div className="text-xl font-bold text-foreground">{depTime}</div>
                          <div className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full mt-1">{flight.origin.code}</div>
                       </div>
                       <div className="flex flex-col items-center w-24">
                          <span className="text-xs text-muted-foreground mb-1">{duration}</span>
                          <div className="w-full h-[1px] bg-border relative"></div>
                          <span className="text-[10px] text-muted-foreground mt-1">Direct</span>
                       </div>
                       <div>
                          <div className="text-xl font-bold text-foreground">{arrTime}</div>
                          <div className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full mt-1">{flight.destination.code}</div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Grid Pilihan Tiket */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">
                {options.map((opt) => (
                  <div 
                    key={opt.id} 
                    className={`
                      relative flex flex-col bg-card rounded-xl border-2 transition-all duration-200 
                      ${opt.recommended ? "border-blue-500 shadow-lg shadow-blue-500/10" : "border-border hover:border-primary/50"}
                    `}
                  >
                    {opt.badgeText && (
                       <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm ${opt.badgeColor}`}>
                          {opt.badgeText}
                       </div>
                    )}

                    <div className="p-5 border-b border-border/50">
                      <div className="flex justify-between items-start mb-1">
                         <div>
                            <div className="text-xs text-muted-foreground font-medium">Economy</div>
                            <div className={`font-bold text-base ${opt.labelColor}`}>{opt.tag}</div>
                         </div>
                         <div className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-yellow-500 text-white flex items-center justify-center text-[8px]">P</span> {opt.points}
                         </div>
                      </div>
                      <div className="text-2xl font-bold text-foreground mt-4">
                        {formatRupiah(opt.price)}
                        <span className="text-xs font-normal text-muted-foreground ml-1">/pax</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3.5 flex-1">
                      {opt.benefits.map((benefit, idx) => (
                        <div key={idx} className={`flex items-start gap-3 text-sm leading-tight ${benefit.included ? "text-foreground" : "text-muted-foreground/60"}`}>
                          {benefit.included ? (
                             benefit.highlight ? <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> 
                             : <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          ) : (
                             benefit.alert ? <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                             : <div className="w-4 h-4 rounded-full border border-muted-foreground/40 shrink-0 mt-0.5" />
                          )}
                          <span className={benefit.included ? "font-medium" : "line-through decoration-muted-foreground/40"}>
                            {benefit.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Button (SEMUA SAMA WARNANYA SEKARANG) */}
                    <div className="p-4 pt-0 mt-auto">
                      <button
                        onClick={() => onSelect({...flight, ...opt})}
                        className="w-full py-2.5 rounded-full font-bold text-sm transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}