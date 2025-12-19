import React, { useState } from "react";
import { useFlightSelection } from "../../context/FlightSelectionContext"; 
import { ChevronDown, Armchair } from "lucide-react";

export default function FlightSummary() {
  const { selectedFlight } = useFlightSelection();
  const [installments, setInstallments] = useState(false);

  if (!selectedFlight) return null;

  // --- FORMAT DATA ---
  const depDateObj = new Date(selectedFlight.departureTime);
  const arrDateObj = new Date(selectedFlight.arrivalTime);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":");
  };

  const durationMs = arrDateObj - depDateObj;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationStr = `${hours}h ${minutes}m`;

  const price = Number(selectedFlight.price || 0);
  const points = Math.floor(price / 1080);
  const xp = (points * 15).toLocaleString("id-ID");

  return (
    <div className="space-y-4 font-sans text-foreground">
      
      {/* CARD 1 */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-base">Flight Summary</h4>
          <button type="button" className="text-xs font-bold text-primary hover:underline">
            Details
          </button>
        </div>

        <div className="mb-3">
           <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-1 rounded">
             Depart
           </span>
        </div>

        <div className="flex justify-between items-start mb-4">
           <div>
              <div className="font-bold text-sm">
                {selectedFlight.originCity} ({selectedFlight.originCode})
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{formatDate(depDateObj)}</div>
              <div className="text-[13px] font-bold mt-1">{formatTime(depDateObj)}</div>
           </div>

           <div className="flex-1 flex flex-col items-center px-4 mt-0.5">
              <div className="text-[11px] text-muted-foreground mb-1">{durationStr}</div>
              <div className="flex items-center w-full relative justify-center">
                 <div className="absolute w-full h-[1px] bg-border top-1/2"></div>
                 <span className="relative bg-card px-2 text-[10px] text-muted-foreground z-10">Direct</span>
              </div>
           </div>

           <div className="text-right">
              <div className="font-bold text-sm">
                {selectedFlight.destinationCity} ({selectedFlight.destinationCode})
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{formatDate(arrDateObj)}</div>
              <div className="text-[13px] font-bold mt-1">{formatTime(arrDateObj)}</div>
           </div>
        </div>

        <div className="flex items-start gap-2 border-t border-border pt-3">
           <img src={selectedFlight.airline?.logo} alt="logo" className="w-5 h-5 object-contain" />
           <div>
              <div className="text-xs font-bold">{selectedFlight.airline?.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                 <Armchair className="w-3 h-3 text-primary" />
                 <span>Original • {selectedFlight.className || "Economy"}</span>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
           <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-[10px] font-bold border border-border">
             {selectedFlight.isRefundable ? "Refundable" : "Non-Refundable"}
           </span>
        </div>
      </div>

      {/* CARD 2: PRICE */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-base">Price Details</h4>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">Price you pay</div>
          <button className="flex items-center gap-1 text-[16px] font-bold text-orange-500">
            Rp {price.toLocaleString("id-ID")}
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <div className="text-xs font-medium text-foreground">Show price as installments</div>
          <button
            type="button"
            onClick={() => setInstallments(!installments)}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${installments ? 'bg-primary' : 'bg-muted'}`}
          >
            <span className={`absolute left-0.5 top-0.5 w-4 h-4 bg-card rounded-full shadow transform transition-transform duration-200 ease-in-out ${installments ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}