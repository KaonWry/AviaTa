import { useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Plane,
  Luggage,
  RefreshCw,
  ShieldCheck,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}

// Ambil value dari 2 kemungkinan bentuk data (biar aman)
function pick(obj, pathA, pathB, fallback = "") {
  const get = (o, p) =>
    p.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), o);
  return get(obj, pathA) ?? get(obj, pathB) ?? fallback;
}

function buildTicketOptions(flight) {
  const base = Number(flight?.price || 0);

  // 3 tipe saja (simple)
  return [
    {
      id: "eco_basic",
      tag: "Basic",
      name: "Economy",
      price: base,
      cabinKg: 7,
      baggageKg: 0,
      isRefundable: false,
      isReschedulable: true,
      perks: [
        { icon: Luggage, text: "Cabin baggage 7 kg" },
        { icon: Luggage, text: "Checked baggage 0 kg" },
        { icon: RefreshCw, text: "Reschedule with fees" },
      ],
    },
    {
      id: "eco_value",
      tag: "Best Value",
      name: "Economy + Bagasi",
      price: Math.round(base * 1.12),
      cabinKg: 7,
      baggageKg: 20,
      isRefundable: false,
      isReschedulable: true,
      perks: [
        { icon: Luggage, text: "Cabin baggage 7 kg" },
        { icon: Luggage, text: "Checked baggage 20 kg" },
        { icon: RefreshCw, text: "Reschedule with fees" },
      ],
    },
    {
      id: "eco_flexi",
      tag: "Recommended",
      name: "Economy Flexi",
      price: Math.round(base * 1.25),
      cabinKg: 7,
      baggageKg: 20,
      isRefundable: true,
      isReschedulable: true,
      perks: [
        { icon: Luggage, text: "Cabin baggage 7 kg" },
        { icon: Luggage, text: "Checked baggage 20 kg" },
        { icon: RefreshCw, text: "Reschedule with fees" },
        { icon: ShieldCheck, text: "Refundable (conditions apply)" },
      ],
    },
  ];
}

export default function TicketTypeModal({ open, onClose, flight, onSelect }) {
  const scrollerRef = useRef(null);

  const options = useMemo(() => buildTicketOptions(flight), [flight]);

  const airlineName = pick(flight, "airline.name", "airline?.name", "Airline");
  const airlineLogo = pick(flight, "airline.logo", "airline?.logo", "");
  const originCode = pick(flight, "origin.code", "originCode", "");
  const originCity = pick(flight, "origin.city", "originCity", "");
  const destCode = pick(flight, "destination.code", "destinationCode", "");
  const destCity = pick(flight, "destination.city", "destinationCity", "");
  const depTime = flight?.departureTime
    ? new Date(flight.departureTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "";
  const arrTime = flight?.arrivalTime
    ? new Date(flight.arrivalTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "";

  const scrollBy = (dx) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {open && !!flight && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          {/* Panel */}
          <motion.div
            className="relative w-[min(1100px,92vw)] max-h-[88vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-foreground">Select ticket type</h3>
              </div>
              <div className="text-sm text-muted-foreground hidden md:block">
                {originCity || originCode} → {destCity || destCode}
              </div>
            </div>

            {/* Top flight strip */}
            <div className="px-6 pt-5">
              <div className="border border-border rounded-xl p-4 bg-muted/20">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
                      {airlineLogo ? (
                        <img src={airlineLogo} alt={airlineName} className="w-8 h-8 object-contain" />
                      ) : (
                        <Plane className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{airlineName}</div>
                      <div className="text-xs text-muted-foreground">Economy</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground">{depTime}</div>
                      <div className="text-xs text-muted-foreground">{originCode}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground mb-1">Direct</div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-px bg-border" />
                        <Plane className="w-4 h-4 text-primary rotate-90" />
                        <div className="w-10 h-px bg-border" />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground">{arrTime}</div>
                      <div className="text-xs text-muted-foreground">{destCode}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Info className="w-4 h-4" />
                    Flight Details
                  </button>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="relative px-6 pb-6 pt-5">
              {/* Arrow nav (mirip screenshot) */}
              <button
                type="button"
                onClick={() => scrollBy(-340)}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-border shadow items-center justify-center hover:bg-muted"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(340)}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-border shadow items-center justify-center hover:bg-muted"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                ref={scrollerRef}
                className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
              >
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className="min-w-[300px] max-w-[300px] bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-foreground">
                          {opt.name}
                          <span className="text-xs text-muted-foreground"> • {opt.tag}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-end justify-between">
                        <div className="text-2xl font-bold text-foreground">{formatPrice(opt.price)}</div>
                        <div className="text-xs text-muted-foreground">/pax</div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      {opt.perks.map((p, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <p.icon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <span>{p.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelect?.({
                            ...flight,
                            // override hasil pilihan tiket
                            ticketType: opt.id,
                            fareName: opt.name,
                            price: opt.price,
                            baggage: opt.baggageKg,
                            cabinBaggage: opt.cabinKg,
                            isRefundable: opt.isRefundable,
                            isReschedulable: opt.isReschedulable,
                          });
                        }}
                        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-muted-foreground mt-2">
                * Opsi tiket dibatasi 3 jenis (Basic / Bagasi / Flexi) sesuai request.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
