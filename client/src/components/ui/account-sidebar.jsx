import { NavLink, useNavigate } from "react-router-dom";
import { 
  Award,
  CreditCard, 
  ClipboardList, 
  Receipt, 
  RotateCcw, 
  Bell, 
  Users, 
  Mail, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/auth-context";

const menuItems = [
  { 
    section: "main",
    items: [
      { name: "Poin Saya", url: "/account/points", icon: Award, badge: "0" },
      { name: "Kartu Saya", url: "/account/cards", icon: CreditCard },
    ]
  },
  {
    section: "orders",
    items: [
      { name: "Pesanan Saya", url: "/account/orders", icon: ClipboardList },
      { name: "Daftar Pembelian", url: "/account/purchases", icon: Receipt },
      { name: "Refunds", url: "/account/refunds", icon: RotateCcw },
    ]
  },
  {
    section: "settings",
    items: [
      { name: "Notifikasi Harga", url: "/account/price-alerts", icon: Bell },
      { name: "Detail Penumpang", url: "/account/passengers", icon: Users },
      { name: "Pengaturan Notifikasi", url: "/account/notifications", icon: Mail },
    ]
  },
  {
    section: "account",
    items: [
      { name: "Akun Saya", url: "/account/settings", icon: Settings },
    ]
  }
];

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AccountSidebar({ className }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={cn("w-full md:w-80 bg-card border border-border rounded-xl overflow-hidden", className)}>
      {/* Profile Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {user?.name || "Guest"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {user?.provider || "Email"}
            </p>
          </div>
        </div>
        
        {/* Priority Badge */}
        <button className="mt-4 w-full flex items-center justify-between px-4 py-2.5 bg-primary rounded-lg text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Kamu adalah <strong>Bronze Priority</strong></span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="py-2">
        {menuItems.map((section, sectionIdx) => (
          <div key={sectionIdx} className={cn(
            sectionIdx > 0 && "border-t border-border mt-2 pt-2"
          )}>
            {section.items.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium border-l-4 border-primary-foreground" 
                    : "text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="text-xs text-muted-foreground">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}

        {/* Logout Button */}
        <div className="border-t border-border mt-2 pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default AccountSidebar;
