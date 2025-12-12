import { useEffect, useState } from "react";
import { DestinationGrid } from "../components/ui/destination-card";

const COUNTRY_LIST = ["Singapore", "Malaysia", "Japan", "Korea Utara"];

const Home = () => {
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [country, setCountry] = useState(COUNTRY_LIST[0]);
  const [countryDestinations, setCountryDestinations] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingCountry, setLoadingCountry] = useState(true);

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
    <div className="page min-h-screen flex flex-col bg-background text-foreground pt-24 transition-colors duration-300">
      {/* Main Content */}
      <main className="container max-w-[1180px] mx-auto px-6 pb-10 flex-1">
        {/* Hero Section */}
        <section className="hero mt-6 bg-secondary dark:bg-muted rounded-2xl p-6 transition-colors duration-300">
          <div className="hero-inner flex flex-wrap gap-6">
            <div className="hero-text flex-1 min-w-[260px] text-sm leading-relaxed text-foreground">
              <div className="hero-heading text-xl font-semibold mb-2">
                Cari & pesan tiket pesawat dengan mudah.
              </div>
              <div className="hero-sub text-sm mb-3 text-muted-foreground">
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
              className="search-card flex-1 min-w-[320px] bg-primary/80 dark:bg-primary/60 rounded-xl p-5 shadow-md flex flex-col gap-3"
              action="/search"
              method="get"
            >
              <div className="search-grid grid grid-cols-2 gap-x-4 gap-y-3">
                {/* ...existing code... */}
                <div className="field flex flex-col gap-1">
                  <label htmlFor="from-guest" className="text-xs text-white">
                    Dari
                  </label>
                  <input
                    id="from-guest"
                    name="from"
                    type="text"
                    placeholder="Jakarta (CGK)"
                    className="rounded-full border bg-background text-foreground border-border px-2 py-1 text-sm"
                  />
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="to-guest" className="text-xs text-white">
                    Ke
                  </label>
                  <input
                    id="to-guest"
                    name="to"
                    type="text"
                    placeholder="Singapore (SIN)"
                    className="rounded-full border bg-background text-foreground border-border px-2 py-1 text-sm"
                  />
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="depart-guest" className="text-xs text-white">
                    Tanggal berangkat
                  </label>
                  <input
                    id="depart-guest"
                    name="depart"
                    type="date"
                    className="rounded-full border bg-background text-foreground border-border px-2 py-1 text-sm"
                  />
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="return-guest" className="text-xs text-white">
                    Tanggal pulang
                  </label>
                  <input
                    id="return-guest"
                    name="return"
                    type="date"
                    className="rounded-full border bg-background text-foreground border-border px-2 py-1 text-sm"
                  />
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="passenger-guest" className="text-xs text-white">
                    Penumpang
                  </label>
                  <select
                    id="passenger-guest"
                    name="passenger"
                    className="rounded-full border bg-background text-foreground border-border px-2 py-1 text-sm"
                  >
                    <option>1 Penumpang</option>
                    <option>2 Penumpang</option>
                    <option>3 Penumpang</option>
                    <option>4+ Penumpang</option>
                  </select>
                </div>
                <div className="field flex flex-col gap-1">
                  <label htmlFor="class-guest" className="text-xs text-white">
                    Kelas
                  </label>
                  <select
                    id="class-guest"
                    name="class"
                    className="rounded-full bg-background text-foreground border border-border px-2 py-1 text-sm"
                  >
                    <option>Ekonomi</option>
                    <option>Bisnis</option>
                    <option>First Class</option>
                  </select>
                </div>
              </div>
              <div className="search-footer mt-1">
                <button
                  className="btn btn-primary w-full rounded-full bg-card text-primary hover:bg-primary hover:text-primary-foreground py-2 font-semibold transition-colors duration-200"
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
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
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
    </div>
  );
};

export default Home;
