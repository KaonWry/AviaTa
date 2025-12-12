import React, { useMemo, useState } from "react";
import { useFlightSelection } from "../../context/FlightSelectionContext";
import { Plane } from "lucide-react";

export default function FlightSummary() {
  const { selectedFlight } = useFlightSelection();
  const [installments, setInstallments] = useState(false);

  if (!selectedFlight) return null;

  const dateObj = new Date(selectedFlight.departureTime);
  const arrivalObj = new Date(selectedFlight.arrivalTime);
  const dateStr = dateObj.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const depTime = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const arrTime = arrivalObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const durationMs = arrivalObj - dateObj;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationStr = `${hours}h ${minutes}m`;

  const price = Number(selectedFlight.price || 0);

  const points = useMemo(() => {
    // simple: 1 point per 1.000 rupiah (biar mirip Traveloka feel)
    return Math.max(0, Math.floor(price / 1000));
  }, [price]);

  return (
    <div className="space-y-4">
      {/* Flight Summary card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">Flight Summary</h4>
          <button type="button" className="text-sm text-primary hover:underline">
            Details
          </button>
        </div>

        <div className="text-xs text-muted-foreground mb-2">Depart</div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-foreground">
              {selectedFlight.originCity} ({selectedFlight.originCode})
            </div>
            <div className="text-xs text-muted-foreground">{dateStr}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground">{durationStr}</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-10 h-px bg-border" />
              <Plane className="w-4 h-4 text-primary rotate-90" />
              <div className="w-10 h-px bg-border" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">Direct</div>
          </div>

          <div className="text-right">
            <div className="font-semibold text-foreground">
              {selectedFlight.destinationCity} ({selectedFlight.destinationCode})
            </div>
            <div className="text-xs text-muted-foreground">{dateStr}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <img
            src={selectedFlight.airline?.logo}
            alt={selectedFlight.airline?.name}
            className="w-6 h-6 object-contain rounded bg-white border"
          />
          <div className="text-sm font-medium text-foreground">{selectedFlight.airline?.name}</div>
          <div className="text-xs text-muted-foreground">
            {selectedFlight.fareName || selectedFlight.className || "Economy"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            Reschedule Available
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            {selectedFlight.isRefundable ? "Refundable" : "Non-Refundable"}
          </span>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {depTime} → {arrTime}
        </div>
      </div>

      {/* Price Details card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Price Details</h4>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Price you pay</div>
          <div className="text-lg font-bold text-primary">
            Rp {price.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-full bg-muted">Earn {points} Points</span>
          <span className="px-2 py-1 rounded-full bg-muted">Earn {points * 15} Priority XP</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Show price as installments</div>

          <button
            type="button"
            onClick={() => setInstallments((v) => !v)}
            className={`w-12 h-7 rounded-full border border-border px-1 flex items-center transition-colors ${
              installments ? "bg-primary/20" : "bg-muted/40"
            }`}
            aria-pressed={installments}
          >
            <span
              className={`w-5 h-5 rounded-full bg-background shadow transition-transform ${
                installments ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
