import { Routes, Route, useLocation } from "react-router-dom";
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

const navItems = [
  { name: "Beranda", url: "/", icon: HomeIcon },
  { name: "Cari Tiket", url: "/search", icon: Search },
  { name: "Pesananku", url: "/tickets", icon: Ticket },
  { name: "Akun", url: "/profile", icon: User },
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
