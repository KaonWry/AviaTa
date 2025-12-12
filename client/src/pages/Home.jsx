import { useEffect, useState } from "react";
import { DestinationGrid } from "../components/ui/destination-card";
import { FlightSearchCard } from "../components/ui/flight-search-card";
import { AboutUsSection } from "../components/ui/testimonial-carousel";

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
    <div className="page min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Hero Section with Background */}
      <section className="relative min-h-[500px] md:min-h-[550px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')"
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container max-w-[1180px] mx-auto px-6 pt-32 pb-12">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              PESAN PENERBANGAN TERBAIKMU DI AVIATA
            </h1>
            <p className="text-white/90 text-lg md:text-xl drop-shadow">
              Cari & pesan tiket dari 200+ maskapai penerbangan di seluruh dunia
            </p>
          </div>

          {/* Flight Search Card */}
          <FlightSearchCard className="w-full max-w-none mx-auto" />
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-[1180px] mx-auto px-6 pb-10 flex-1">

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

        {/* About Us Section */}
        <AboutUsSection className="mt-8" />
      </main>
    </div>
  );
};

export default Home;
