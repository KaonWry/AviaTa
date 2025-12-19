import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { useFlightSelection } from "../context/FlightSelectionContext";
import FlightSummary from "../components/ui/FlightSummary";

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedFlight } = useFlightSelection();
  const [finalizing, setFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState("");

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

  const handleFinalizePurchase = async () => {
    const numericUserId = Number.parseInt(String(user?.id), 10);
    const numericFlightId = Number.parseInt(String(selectedFlight?.id), 10);

    if (!user?.id) {
      setFinalizeError("Silakan login terlebih dahulu.");
      return;
    }
    if (!selectedFlight?.id) {
      setFinalizeError("Tidak ada flight yang dipilih.");
      return;
    }
    if (!Number.isFinite(numericUserId)) {
      setFinalizeError("Sesi login kamu tidak valid. Silakan logout lalu login kembali.");
      return;
    }
    if (!Number.isFinite(numericFlightId)) {
      setFinalizeError("Data flight tidak valid. Silakan pilih flight lagi.");
      return;
    }

    setFinalizing(true);
    setFinalizeError("");
    try {
      const res = await fetch("http://localhost:3001/api/purchases/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: numericUserId,
          flight_id: numericFlightId,
          flight_class_code: selectedFlight.flightClassCode,
          total_passengers: selectedFlight.totalPassengers || 1,
          trip_type: "one-way",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFinalizeError(data.error || "Gagal memfinalisasi pembelian.");
        return;
      }
      navigate("/account/purchases");
    } catch {
      setFinalizeError("Gagal memfinalisasi pembelian.");
    } finally {
      setFinalizing(false);
    }
  };

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

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground">Finalize</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pembayaran dilewati untuk sementara. Klik tombol di bawah untuk menyimpan pembelian tiket ke akun Anda.
            </p>
            {finalizeError && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-sm">
                {finalizeError}
              </div>
            )}
            <button
              type="button"
              className="mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              onClick={handleFinalizePurchase}
              disabled={finalizing}
            >
              {finalizing ? "Memproses..." : "Finalize Purchase"}
            </button>
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
