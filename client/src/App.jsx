import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { PageLoader } from "./components/ui/page-loader";
import { AnimeNavBar } from "./components/ui/anime-navbar";
import { FooterSection } from "./components/ui/footer-section";
import { ThemeProvider } from "./context/theme-context";
import { AuthProvider } from "./context/auth-context";
import { Home as HomeIcon, Search, Ticket, User } from "lucide-react";

// Lazy load pages untuk better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Orders = lazy(() => import("./pages/Orders"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const Passengers = lazy(() => import("./pages/Passengers"));
const PurchaseList = lazy(() => import("./pages/PurchaseList"));
const SearchFlights = lazy(() => import("./pages/SearchFlights"));

const navItems = [
  { name: "Beranda", url: "/", icon: HomeIcon },
  { name: "Cari Tiket", url: "/search", icon: Search },
  { name: "Pesananku", url: "/account/orders", icon: Ticket },
  { name: "Akun", url: "/account/settings", icon: User },
];

function AppContent() {
  const location = useLocation();
  
  // Hide navbar and footer on login/register pages
  const hideNavAndFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {!hideNavAndFooter && <AnimeNavBar items={navItems} defaultActive="Beranda" />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader isLoading={true} message="Memuat halaman..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchFlights />} />
            
            {/* Account Routes */}
            <Route path="/account" element={<Navigate to="/account/orders" replace />} />
            <Route path="/account/orders" element={<Orders />} />
            <Route path="/account/purchases" element={<PurchaseList />} />
            <Route path="/account/settings" element={<AccountSettings />} />
            <Route path="/account/passengers" element={<Passengers />} />
            
            {/* Legacy routes redirect */}
            <Route path="/profile" element={<Navigate to="/account/settings" replace />} />
            <Route path="/tickets" element={<Navigate to="/account/orders" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!hideNavAndFooter && <FooterSection />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="aviata-theme">
      <AuthProvider storageKey="aviata-auth">
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
