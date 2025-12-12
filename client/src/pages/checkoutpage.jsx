import FlightSummary from "../components/flights/FlightSummary";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top step bar */}
      <div className="bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-sm font-medium text-foreground">
            ✅ Your trip details
          </div>
          <div className="text-sm font-medium text-primary">
            2 Payment
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground">Contact Details (for E-ticket/Voucher)</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">First / Given Name*</label>
                <input className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Family Name / Last Name*</label>
                <input className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Mobile Number*</label>
                <input className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background" placeholder="+62..." />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email*</label>
                <input className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground">Traveler Details</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Title*</label>
                <select className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background">
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                </select>
              </div>
              <div />
              <div>
                <label className="text-sm text-muted-foreground">First Name*</label>
                <input className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Last Name*</label>
                <input className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background" />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <aside className="lg:sticky lg:top-6 h-fit">
          <FlightSummary />
        </aside>
      </div>
    </div>
  );
}
