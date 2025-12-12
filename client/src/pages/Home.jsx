import React, { useEffect, useState } from "react";
import { DestinationGrid } from "../components/ui/destination-card";

const COUNTRY_LIST = ["Singapore", "Malaysia", "Japan", "Korea Utara"];

const Home = () => {
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [country, setCountry] = useState(COUNTRY_LIST[0]);
  const [countryDestinations, setCountryDestinations] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check localStorage for username (dev session)
    const stored = localStorage.getItem('username');
    if (stored) {
      setUsername(stored);
      return;
    }
    fetch("http://localhost:3001/api/username")
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username || "");
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/popular-destinations")
      .then((res) => res.json())
      .then((data) => {
        setPopularDestinations(data.destinations || []);
        setLoadingPopular(false);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:3001/api/country-destinations/${encodeURIComponent(
        country
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCountryDestinations(data.destinations || []);
        setLoadingCountry(false);
      });
  }, [country]);

  return (
    <div className="page min-h-screen flex flex-col bg-[#FBFBFB] text-black">
      {/* Header ...existing code... */}
      <header className="site-header bg-white border-b border-[#E0E0E0]">
        <nav className="navbar flex items-center justify-between gap-4 px-6 py-2">
          <div className="nav-left flex items-center gap-2">
            <div className="brand-logo w-8 h-8 rounded-full bg-[#4A70A9]" />
            <div className="brand-name font-bold text-lg">AviaTa</div>
          </div>
          <div className="nav-right flex items-center gap-3">
            <button className="lang-select inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#E0E0E0] bg-white text-sm">
              <span className="flag-dot w-3.5 h-2.5 rounded bg-linear-to-b from-red-600 to-white block" />
              <span>ID/EN</span>
            </button>
            {username && (
              <div className="user-menu relative flex items-center gap-1">
                <button
                  type="button"
                  className="user-menu-toggle flex items-center gap-1 px-2 py-1 rounded-full border border-[#E0E0E0] bg-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    const dropdown = document.getElementById("user-dropdown");
                    if (dropdown)
                      dropdown.style.display =
                        dropdown.style.display === "block" ? "none" : "block";
                  }}
                >
                  <span className="user-avatar w-7 h-7 rounded-full bg-[#8FABD4] flex items-center justify-center text-sm text-white font-semibold">
                    {username[0]}
                  </span>
                  <span className="user-name text-sm font-medium">
                    {username}
                  </span>
                  <span>▾</span>
                </button>
                <div
                  id="user-dropdown"
                  className="user-dropdown absolute right-0 top-[calc(100%+6px)] min-w-40 bg-white rounded-xl shadow-lg p-1 z-30"
                  style={{ display: "none" }}
                >
                  <a
                    href="/tickets"
                    className="block px-4 py-2 text-sm hover:bg-[#F2F2F2]"
                  >
                    E-Ticket Saya
                  </a>
                  <a
                    href="/tracking"
                    className="block px-4 py-2 text-sm hover:bg-[#F2F2F2]"
                  >
                    Tracking Penerbangan
                  </a>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-[#F2F2F2]"
                  >
                    Profil
                  </a>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-[#F2F2F2]"
                    onClick={() => {
                      localStorage.removeItem('username');
                      window.location.reload();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            {!username && (
              <>
                <a
                  href="/login"
                  className="btn btn-outline px-4 py-2 rounded-full text-[#4A70A9] border border-[#4A70A9] bg-white text-sm"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="btn btn-primary px-4 py-2 rounded-full bg-[#4A70A9] text-white text-sm"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main ...existing code... */}
      <main className="container max-w-[1180px] mx-auto px-6 pb-10 flex-1">
        {/* Hero Section ...existing code... */}
        <section className="hero mt-6 bg-[#E6E9F0] rounded-2xl p-6">
          <div className="hero-inner flex flex-wrap gap-6">
            <div className="hero-text flex-1 min-w-[260px] text-sm leading-relaxed text-[#333]">
              <div className="hero-heading text-xl font-semibold mb-2">
                Cari & pesan tiket pesawat dengan mudah.
              </div>
              <div className="hero-sub text-sm mb-3">
                Temukan penerbangan terbaik untuk perjalananmu, bandingkan
                harga, durasi, dan fasilitas maskapai dalam satu halaman.
              </div>
              <p>
                AviaTa membantu kamu mendapatkan tiket dengan harga transparan
                tanpa biaya tersembunyi. Dukungan berbagai metode pembayaran dan
                e-ticket instan yang langsung terkirim ke email setelah
                pembayaran berhasil.
              </p>
            </div>
            <form
              className="search-card flex-1 min-w-[320px] bg-[#8FABD4] rounded-xl p-5 shadow-md flex flex-col gap-3"
              action="/search"
              method="get"
            >
              <div className="search-grid grid grid-cols-2 gap-x-4 gap-y-3">
                {/* ...existing code... */}
                <div className="field flex flex-col gap-1">
                  <label htmlFor="from-guest" className="text-xs">
                    Dari
                  </label>
                  <input
                    id="from-guest"
                    name="from"
                    type="text"
                    placeholder="Jakarta (CGK)"
                    className="rounded-full border bg-white border-[#E0E0E0] px-2 py-1 text-sm"
                  />
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="to-guest" className="text-xs">
                    Ke
                  </label>
                  <input
                    id="to-guest"
                    name="to"
                    type="text"
                    placeholder="Singapore (SIN)"
                    className="rounded-full border bg-white border-[#E0E0E0] px-2 py-1 text-sm"
                  />
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="depart-guest" className="text-xs">
                    Tanggal berangkat
                  </label>
                  <input
                    id="depart-guest"
                    name="depart"
                    type="date"
                    className="rounded-full border bg-white border-[#E0E0E0] px-2 py-1 text-sm"
                  />
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="return-guest" className="text-xs">
                    Tanggal pulang
                  </label>
                  <input
                    id="return-guest"
                    name="return"
                    type="date"
                    className="rounded-full border bg-white border-[#E0E0E0] px-2 py-1 text-sm"
                  />
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="passenger-guest" className="text-xs">
                    Penumpang
                  </label>
                  <select
                    id="passenger-guest"
                    name="passenger"
                    className="rounded-full border bg-white border-[#E0E0E0] px-2 py-1 text-sm"
                  >
                    <option>1 Penumpang</option>
                    <option>2 Penumpang</option>
                    <option>3 Penumpang</option>
                    <option>4+ Penumpang</option>
                  </select>
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="class-guest" className="text-xs">
                    Kelas
                  </label>
                  <select
                    id="class-guest"
                    name="class"
                    className="rounded-full bg-white border border-[#E0E0E0] px-2 py-1 text-sm"
                  >
                    <option>Ekonomi</option>
                    <option>Bisnis</option>
                    <option>First Class</option>
                  </select>
                </div>
              </div>
              <div className="search-footer mt-1">
                <button
                  className="btn btn-primary w-full rounded-full bg-[#4A70A9] text-white py-2"
                  type="submit"
                >
                  Cari Penerbangan
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Tujuan Terpopuler */}
        <section className="section mt-8">
          <div className="section-header flex items-center justify-between gap-4 mb-4">
            <h2 className="section-title text-lg font-semibold">
              Tujuan Terpopuler
            </h2>
          </div>
          <DestinationGrid 
            destinations={popularDestinations} 
            loading={loadingPopular}
            emptyMessage="Tidak ada destinasi populer."
          />
        </section>

        {/* Country Section */}
        <section className="section mt-8" data-country-section>
          <div className="section-header flex items-center justify-between gap-4 mb-4">
            <h2 className="section-title text-lg font-semibold">{country}</h2>
            <div className="flex flex-wrap gap-2">
              {COUNTRY_LIST.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`px-3 py-1 rounded-full border text-xs cursor-pointer transition-all duration-200
                    ${
                      country === c
                        ? "bg-[#4A70A9] text-white border-[#4A70A9] shadow-md"
                        : "bg-white text-black border-[#E0E0E0] hover:border-[#4A70A9] hover:text-[#4A70A9]"
                    }
                  `}
                  onClick={() => setCountry(c)}
                  data-country={c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <DestinationGrid 
            destinations={countryDestinations} 
            loading={loadingCountry}
            emptyMessage="Tidak ada destinasi untuk negara ini."
          />
        </section>
      </main>

      {/* Footer ...existing code... */}
      <footer className="site-footer bg-[#E0E0E0] pt-6 pb-4 mt-4">
        <div className="footer-inner max-w-[1180px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="footer-col">
            <h4 className="text-sm mb-1">AviaTa</h4>
            <ul className="footer-list list-none m-0 p-0">
              <li>
                <a href="#">Help Centre</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Partnership</a>
              </li>
              <li>
                <a href="#">Advertising</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="text-sm mb-1">Tentang AviaTa</h4>
            <ul className="footer-list list-none m-0 p-0">
              <li>
                <a href="#">Tentang kami</a>
              </li>
              <li>
                <a href="#">Kebijakan privasi</a>
              </li>
              <li>
                <a href="#">Syarat & ketentuan</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="text-sm mb-1">Kontak kami</h4>
            <div className="footer-social flex gap-2 mt-1">
              <span className="footer-social-icon w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs">
                IG
              </span>
              <span className="footer-social-icon w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs">
                FB
              </span>
              <span className="footer-social-icon w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs">
                X
              </span>
            </div>
          </div>
        </div>
        <div className="footer-bottom max-w-[1180px] mx-auto px-6 mt-2 text-[11px] text-center">
          © 2025 AviaTa. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
