
import React from "react";
import { useFlightSelection } from "../../context/FlightSelectionContext";
import { Plane, Clock } from "lucide-react";

export default function FlightSummary() {
  const { selectedFlight } = useFlightSelection();

  if (!selectedFlight) return null;

  // Format date and time
  const dateObj = new Date(selectedFlight.departureTime);
  const arrivalObj = new Date(selectedFlight.arrivalTime);
  const dateStr = dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  const depTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const arrTime = arrivalObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const durationMs = arrivalObj - dateObj;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationStr = `${hours}h ${minutes}m`;

  // Example badges (customize as needed)
  const badges = [
    <span key="reschedule" className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium mr-2">Reschedule Available</span>,
    <span key="nonref" className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">Non-Refundable</span>
  ];

  return (
    <div className="bg-white border border-border rounded-xl p-5 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded">Depart</span>
        <span className="text-xs text-muted-foreground">{dateStr}</span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-base">{selectedFlight.originCity} ({selectedFlight.originCode})</span>
        <Plane className="w-4 h-4 text-primary mx-1" />
        <span className="font-medium text-base">{selectedFlight.destinationCity} ({selectedFlight.destinationCode})</span>
      </div>
      <div className="flex items-center gap-4 mb-2">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-foreground">{depTime}</span>
          <span className="text-xs text-muted-foreground">{selectedFlight.originCode}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-1">{durationStr}</span>
          <div className="flex items-center gap-1">
            <div className="w-8 h-px bg-border" />
            <Plane className="w-4 h-4 text-primary rotate-90" />
            <div className="w-8 h-px bg-border" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-foreground">{arrTime}</span>
          <span className="text-xs text-muted-foreground">{selectedFlight.destinationCode}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <img src={selectedFlight.airline?.logo} alt={selectedFlight.airline?.name} className="w-6 h-6 object-contain rounded bg-white border" />
        <span className="text-sm font-medium">{selectedFlight.airline?.name}</span>
        <span className="text-xs text-muted-foreground">{selectedFlight.className || 'Economy'}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {badges}
      </div>
      <div className="flex items-center justify-between mt-4 border-t pt-3">
        <span className="text-sm font-semibold">Price Details</span>
        <span className="text-lg font-bold text-primary">Rp {selectedFlight.price?.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}
