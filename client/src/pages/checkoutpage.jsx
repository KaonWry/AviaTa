import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/auth-context";
import FlightSummary from "../components/ui/FlightSummary";

export default function CheckoutPage() {
  const { user } = useAuth();

  const initialContact = useMemo(() => {
    const fullName = user?.full_name || user?.name || "";
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return {
        firstName: "",
        lastName: "",
        phone: user?.phone || "",
        email: user?.email || "",
      };
    }
    if (parts.length === 1) {
      return {
        firstName: parts[0],
        lastName: "",
        phone: user?.phone || "",
        email: user?.email || "",
      };
    }
    return {
      firstName: parts.slice(0, -1).join(" "),
      lastName: parts.slice(-1).join(" "),
      phone: user?.phone || "",
      email: user?.email || "",
    };
  }, [user?.full_name, user?.name, user?.email, user?.phone]);

  const [contact, setContact] = useState(initialContact);

  // Keep contact details in sync when session user changes
  useEffect(() => {
    setContact(initialContact);
  }, [initialContact]);

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
                <input
                  className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background"
                  value={contact.firstName}
                  onChange={(e) => setContact((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Family Name / Last Name*</label>
                <input
                  className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background"
                  value={contact.lastName}
                  onChange={(e) => setContact((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Mobile Number*</label>
                <input
                  className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background"
                  placeholder="+62..."
                  value={contact.phone}
                  onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email*</label>
                <input
                  className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-background"
                  value={contact.email}
                  onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                />
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
