import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Ticket,
  SlidersHorizontal,
  Calendar,
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/auth-context";
import { AccountSidebar } from "../components/ui/account-sidebar";

// Date Filter Buttons
function DateFilterButtons({ activeFilter, setActiveFilter }) {
  const currentDate = new Date();
  const currentMonthLabel = currentDate.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
  const prevMonthLabel = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleString('id-ID', { month: 'short', year: 'numeric' });

  const filters = [
    { id: "90days", label: "Past 90 Days" },
    { id: "current", label: currentMonthLabel },
    { id: "prev", label: prevMonthLabel },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeFilter === filter.id
              ? "bg-primary text-primary-foreground"
              : "bg-background border border-border text-foreground hover:bg-muted"
          )}
        >
          {filter.label}
        </button>
      ))}
      
      {/* Filter Button */}
      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors">
        <SlidersHorizontal className="w-4 h-4" />
        Filter
      </button>
    </div>
  );
}

// Custom Date Picker Modal
function CustomDateModal({ isOpen, onClose, onApply }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const MotionDiv = motion.div;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Pilih Rentang Tanggal</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Dari</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Sampai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>
          <button
            onClick={() => {
              onApply(startDate, endDate);
              onClose();
            }}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Terapkan
          </button>
        </div>
      </MotionDiv>
    </div>
  );
}

// Cash Register / Sleeping Illustration
function EmptyIllustration() {
  return (
    <div className="relative w-32 h-32">
      {/* Background receipt/document */}
      <div className="absolute inset-0 bg-muted/50 rounded-lg" />
      
      {/* Cash register */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-16 bg-linear-to-b from-gray-300 to-gray-400 rounded-lg shadow-md">
        {/* Screen */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-6 bg-gray-200 rounded-sm" />
        {/* Buttons */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-500" />
          <div className="w-2 h-2 rounded-full bg-gray-500" />
          <div className="w-2 h-2 rounded-full bg-gray-500" />
        </div>
      </div>
      
      {/* Sleeping Zzz */}
      <div className="absolute -top-2 right-2 text-2xl animate-bounce">
        <span className="bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">zzz</span>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyPurchases() {
  return (
    <div className="flex items-start gap-6 py-8">
      <EmptyIllustration />
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2">No Purchases Found</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          You haven&apos;t made any purchases within the past 30 days. If you have made any purchases previously, use Filter to see them.
        </p>
        <Link 
          to="/"
          className="text-sm text-primary hover:underline font-medium"
        >
          Make a New Purchase
        </Link>
      </div>
    </div>
  );
}

// Purchase Item Card (for when there are purchases)
function PurchaseCard({ purchase }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Ticket className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{purchase.title}</h4>
          <p className="text-sm text-muted-foreground">{purchase.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-foreground">Rp {purchase.amount.toLocaleString('id-ID')}</p>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          purchase.status === "success" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          purchase.status === "pending" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          purchase.status === "failed" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        )}>
          {purchase.status === "success" ? "Berhasil" : purchase.status === "pending" ? "Pending" : "Gagal"}
        </span>
      </div>
    </div>
  );
}

// Main Purchase List Page
export function PurchaseList() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("90days");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const [purchases, setPurchases] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;
    const kickoff = setTimeout(() => {
      if (!isMounted) return;
      setFetching(true);
      setFetchError("");
    }, 0);

    fetch(`http://localhost:3001/api/user/purchases?id=${encodeURIComponent(String(user.id))}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Gagal memuat purchase list.");
        }
        if (isMounted) setPurchases(Array.isArray(data.purchases) ? data.purchases : []);
      })
      .catch((err) => {
        if (isMounted) setFetchError(err?.message || "Gagal memuat purchase list.");
      })
      .finally(() => {
        if (isMounted) setFetching(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(kickoff);
    };
  }, [user?.id]);

  const filteredPurchases = useMemo(() => {
    const now = new Date();

    const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

    const withinRange = (dateObj, start, end) => {
      if (!dateObj || Number.isNaN(dateObj.getTime())) return false;
      if (start && dateObj < start) return false;
      if (end && dateObj > end) return false;
      return true;
    };

    let start = null;
    let end = null;
    if (activeFilter === "90days") {
      start = new Date(now);
      start.setDate(start.getDate() - 90);
      end = now;
    } else if (activeFilter === "current") {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else if (activeFilter === "prev") {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start = startOfMonth(prev);
      end = endOfMonth(prev);
    } else if (activeFilter === "custom" && customRange.start && customRange.end) {
      start = new Date(customRange.start);
      end = new Date(customRange.end);
      end.setHours(23, 59, 59, 999);
    }

    if (!start && !end) return purchases;
    return purchases.filter((p) => {
      const d = new Date(p.date);
      return withinRange(d, start, end);
    });
  }, [activeFilter, purchases, customRange.end, customRange.start]);

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleFilterChange = (filterId) => {
    if (filterId === "custom") {
      setShowCustomDate(true);
    } else {
      setActiveFilter(filterId);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header with link to My Booking */}
            <div className="flex items-center gap-3 text-sm">
              <Ticket className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Find all your e-tickets and vouchers on{" "}
                <Link to="/account/orders" className="text-primary hover:underline font-medium">
                  My Booking
                </Link>
              </span>
            </div>

            {/* Date Filters */}
            <DateFilterButtons 
              activeFilter={activeFilter} 
              setActiveFilter={handleFilterChange} 
            />

            {/* Purchases List */}
            <div className="bg-card border border-border rounded-xl p-6">
              {fetchError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400">
                  {fetchError}
                </div>
              )}

              {fetching ? (
                <div className="text-sm text-muted-foreground">Memuat...</div>
              ) : filteredPurchases.length > 0 ? (
                <div>
                  {filteredPurchases.map((purchase) => (
                    <PurchaseCard key={purchase.id} purchase={purchase} />
                  ))}
                </div>
              ) : (
                <EmptyPurchases />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Date Modal */}
      <CustomDateModal
        isOpen={showCustomDate}
        onClose={() => setShowCustomDate(false)}
        onApply={(start, end) => {
          setCustomRange({ start, end });
          setActiveFilter("custom");
        }}
      />
    </div>
  );
}

export default PurchaseList;
