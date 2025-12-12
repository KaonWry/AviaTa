import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AnimeNavBar } from "./components/ui/anime-navbar";
import { Home as HomeIcon, Search, Ticket, User, PlaneTakeoff } from "lucide-react";

const navItems = [
  { name: "Beranda", url: "/", icon: HomeIcon },
  { name: "Cari Tiket", url: "/search", icon: Search },
  { name: "Pesananku", url: "/tickets", icon: Ticket },
  { name: "Akun", url: "/profile", icon: User },
];

function App() {
  return (
    <>
      <AnimeNavBar items={navItems} defaultActive="Beranda" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
