import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar,
  ArrowRight,
  Moon
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/auth-context";
import { AccountSidebar } from "../components/ui/account-sidebar";

// Empty State Component
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-24 h-24 mb-4 flex items-center justify-center">
        <Icon className="w-16 h-16 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}

// Reschedule Banner
function RescheduleBanner() {
  return (
    <div className="bg-primary rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between p-6">
        <div className="flex items-center gap-6">
          <div className="text-primary-foreground">
            <div className="text-2xl font-bold tracking-wide">easy</div>
            <div className="text-xl font-bold tracking-wider">RESCHEDULE</div>
          </div>
        </div>
        <div className="text-primary-foreground text-right mt-4 md:mt-0">
          <h3 className="font-bold text-lg">AviaTa Easy Reschedule</h3>
          <p className="text-sm opacity-90">
            Mengubah jadwal penerbangan bukan masalah.
          </p>
          <p className="text-sm opacity-90">
            Kami pastikan jadi mudah.
          </p>
          <button className="mt-2 text-sm font-semibold underline hover:no-underline">
            Pelajari selengkapnya
          </button>
        </div>
      </div>
    </div>
  );
}

// Order Card Component (for when there are orders)
function OrderCard({ order }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{order.date}</span>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          order.status === "active" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          order.status === "completed" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
          order.status === "cancelled" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        )}>
          {order.statusLabel}
        </span>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="text-lg font-bold text-foreground">{order.from}</div>
        <ArrowRight className="w-5 h-5 text-muted-foreground" />
        <div className="text-lg font-bold text-foreground">{order.to}</div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {order.airline} • {order.passengers} Penumpang
        </div>
        <Link 
          to={`/account/orders/${order.id}`}
          className="text-sm text-primary hover:underline font-medium"
        >
          Lihat Detail
        </Link>
      </div>
    </motion.div>
  );
}

// Sleeping Icon Component
function SleepingIcon() {
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center">
        <Moon className="w-12 h-12 text-primary/50" />
      </div>
      <div className="absolute -top-2 -right-2 text-2xl animate-bounce">💤</div>
    </div>
  );
}

// Main Orders Page
export function Orders() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mock orders data - empty for now
  const activeOrders = [];
  const purchaseHistory = [];

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Reschedule Banner */}
            <RescheduleBanner />

            {/* Active Orders Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">E-tiket & Voucher Aktif</h2>
              
              {activeOrders.length > 0 ? (
                <div className="grid gap-4">
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <SleepingIcon />
                  <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                    Belum Ada Pesanan
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Seluruh pesanan Anda akan muncul di sini, tapi kini Anda belum punya satu pun. 
                    Mari buat pesanan via homepage!
                  </p>
                  <Link 
                    to="/"
                    className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Cari Penerbangan
                  </Link>
                </div>
              )}
            </div>

            {/* Purchase History Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Daftar Pembelian</h2>
              
              <Link 
                to="/account/purchases"
                className="text-sm text-primary hover:underline"
              >
                Lihat Riwayat Pembelian
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
