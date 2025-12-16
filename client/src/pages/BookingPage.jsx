import React, { useState } from "react";
import BookingHeader from "../components/layout/BookingHeader";
import FlightSummary from "../components/ui/FlightSummary";
import { User, AlertTriangle, ChevronDown, Check } from "lucide-react";

export default function BookingPage() {
  const [hasSingleName, setHasSingleName] = useState(false);
  const [passengerSingleName, setPassengerSingleName] = useState(false);

  return (
    <div className="min-h-screen bg-muted/20 font-sans pb-20">
      <BookingHeader />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* KOLOM KIRI (FORM) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CONTACT DETAILS */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Contact Details</h2>
              
              {/* Login Alert */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Logged in as</p>
                  <p className="font-bold text-foreground text-base">Gideon Miracle Sihombing</p>
                </div>
              </div>

              {/* Form Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">First / Given Name & Middle Name<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    defaultValue="Gideon Miracle" 
                    className="w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground font-medium transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Family Name / Last Name<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    defaultValue="Sihombing" 
                    disabled={hasSingleName}
                    className={`w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground font-medium transition-all ${hasSingleName ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setHasSingleName(!hasSingleName)}>
                 <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${hasSingleName ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                    {hasSingleName && <Check className="w-3 h-3 text-primary-foreground" />}
                 </div>
                 <span className="text-sm text-muted-foreground">This passenger has a single name</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Mobile Number<span className="text-red-500">*</span></label>
                  <div className="flex relative">
                    <div className="flex items-center gap-1 px-3 border border-r-0 border-input rounded-l-lg bg-muted">
                       <span className="text-sm font-bold text-muted-foreground">+62</span>
                    </div>
                    <input type="text" className="flex-1 p-2.5 bg-background border border-input rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-medium" placeholder="812345678" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Email<span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    defaultValue="gideonms99@gmail.com" 
                    className="w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground font-medium"
                  />
                </div>
              </div>
            </div>

            {/* TRAVELER DETAILS */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
               <h2 className="text-xl font-bold text-foreground mb-4">Traveler Details</h2>
               
               <div className="mb-6">
                  <h3 className="font-bold text-foreground mb-2">Adult 1</h3>
                  
                  {/* Warning Box */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-3 flex gap-3 text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                     <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                     <div className="space-y-1">
                        <p className="font-bold">Important Notice:</p>
                        <p className="leading-relaxed opacity-90">Name must match passport/ID exactly. Errors may result in boarding refusal or fees.</p>
                     </div>
                  </div>

                  {/* Form Traveler */}
                  <div className="space-y-4">
                     <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-2 space-y-1">
                           <label className="text-xs font-semibold text-muted-foreground">Title<span className="text-red-500">*</span></label>
                           <div className="relative">
                              <select className="w-full p-2.5 bg-background border border-input rounded-lg appearance-none font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                                 <option>Mr.</option>
                                 <option>Mrs.</option>
                                 <option>Ms.</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                           </div>
                        </div>
                        <div className="col-span-12 md:col-span-5 space-y-1">
                           <label className="text-xs font-semibold text-muted-foreground">First Name<span className="text-red-500">*</span></label>
                           <input type="text" className="w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                        </div>
                        <div className="col-span-12 md:col-span-5 space-y-1">
                           <label className="text-xs font-semibold text-muted-foreground">Last Name<span className="text-red-500">*</span></label>
                           <input 
                              type="text" 
                              disabled={passengerSingleName}
                              className={`w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${passengerSingleName ? 'opacity-50' : ''}`} 
                           />
                        </div>
                     </div>

                     <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPassengerSingleName(!passengerSingleName)}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${passengerSingleName ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                           {passengerSingleName && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span className="text-sm text-muted-foreground">This passenger has a single name</span>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-xs font-semibold text-muted-foreground">Date of Birth<span className="text-red-500">*</span></label>
                           <input type="date" className="w-full p-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-semibold text-muted-foreground">Nationality<span className="text-red-500">*</span></label>
                           <div className="relative">
                              <select className="w-full p-2.5 bg-background border border-input rounded-lg appearance-none font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                                 <option>Indonesia</option>
                                 <option>Singapore</option>
                                 <option>Malaysia</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* TOMBOL CONTINUE (Pakai Warna Primary AviaTa) */}
            <div className="flex justify-end pt-4">
               <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-10 rounded-full shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-95 text-lg">
                  Continue to Payment
               </button>
            </div>

          </div>

          {/* KOLOM KANAN (SUMMARY) */}
          <div className="lg:col-span-4">
             <div className="sticky top-24">
                <FlightSummary />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}