import React from "react";
import { Check, Plane } from "lucide-react";

export default function BookingHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO AVIATA */}
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Plane className="w-5 h-5" />
           </div>
           <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">AviaTa</h1>
              <p className="text-[10px] text-muted-foreground leading-none">Flight Booking</p>
           </div>
        </div>

        {/* STEPPER */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-foreground">Your trip details</span>
          </div>
          <div className="h-[1px] w-12 bg-border"></div>
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span className="text-sm font-medium text-muted-foreground">Payment</span>
          </div>
        </div>

        <div className="w-[100px] hidden md:block"></div>
      </div>
    </header>
  );
}