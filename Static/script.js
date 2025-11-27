// =============================
//  DOCUMENT READY
// =============================
document.addEventListener("DOMContentLoaded", () => {
  // Dropdown user menu
  const userMenuToggle = document.querySelector("[data-user-menu-toggle]");
  const userMenu = document.querySelector(".user-menu");

  if (userMenu && userMenuToggle) {
    userMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      userMenu.classList.toggle("is-open");
    });

    document.addEventListener("click", () => {
      userMenu.classList.remove("is-open");
    });
  }

  // Chip group umum (misalnya country)
  document.querySelectorAll("[data-chip-group]").forEach((group) => {
    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      group.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
  });

  // Pills filter (waktu)
  document.querySelectorAll("[data-pills-group]").forEach((group) => {
    group.addEventListener("click", (e) => {
      const pill = e.target.closest(".pill");
      if (!pill) return;
      group.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
    });
  });

  initSearchPage();
  initCountrySections();

  // Dummy tracking
  const trackingForm = document.querySelector("#tracking-form");
  if (trackingForm) {
    trackingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = trackingForm.querySelector("input");
      alert(`Tracking untuk nomor penerbangan: ${input.value || "AV1234"} `);
    });
  }
});

// =============================
//  SEARCH PAGE
// =============================
function initSearchPage() {
  const searchPage = document.querySelector(".page-search");
  if (!searchPage) return;

  // -----------------------------
  //  DATA PENERBANGAN
  // -----------------------------
  window.FLIGHTS = [
    {
      airline: "Airline A",
      code: "AV1234",
      from: "CGK",
      to: "SIN",
      route: "Jakarta (CGK) → Singapore (SIN)",
      depart: "07:00",
      arrive: "09:45",
      duration: "1j 45m",
      durationMinutes: 105,
      stops: "Langsung",
      cabinClass: "Ekonomi",
      price: 1250000,
      departSlot: "morning",
      arriveSlot: "morning",
      facilities: "Bagasi 20kg, snack, kursi reguler"
    },
    {
      airline: "Airline B",
      code: "AV5678",
      from: "CGK",
      to: "SIN",
      route: "Jakarta (CGK) → Singapore (SIN)",
      depart: "09:00",
      arrive: "12:20",
      duration: "3j 20m",
      durationMinutes: 200,
      stops: "Transit Jakarta",
      cabinClass: "Ekonomi",
      price: 950000,
      departSlot: "afternoon",
      arriveSlot: "afternoon",
      facilities: "Bagasi kabin 7kg, tanpa makan"
    },
    {
      airline: "Airline C",
      code: "AV9012",
      from: "CGK",
      to: "KUL",
      route: "Jakarta (CGK) → Kuala Lumpur (KUL)",
      depart: "18:30",
      arrive: "21:00",
      duration: "2j 30m",
      durationMinutes: 150,
      stops: "Langsung",
      cabinClass: "Bisnis",
      price: 2300000,
      departSlot: "evening",
      arriveSlot: "night",
      facilities: "Bagasi 30kg, makan malam, kursi bisnis"
    },
    {
      airline: "Airline A",
      code: "AV3456",
      from: "SUB",
      to: "CGK",
      route: "Surabaya (SUB) → Jakarta (CGK)",
      depart: "05:15",
      arrive: "06:45",
      duration: "1j 30m",
      durationMinutes: 90,
      stops: "Langsung",
      cabinClass: "Ekonomi",
      price: 650000,
      departSlot: "dawn",
      arriveSlot: "morning",
      facilities: "Bagasi 15kg, air mineral"
    }
  ];

  // -----------------------------
  //  ELEMENT SELECTOR
  // -----------------------------
  const resultsContainer = document.querySelector("#results-list");
  const airlineInputs = Array.from(document.querySelectorAll("input[name='airline']"));
  const classInputs = Array.from(document.querySelectorAll("input[name='class']"));
  const departGroup = document.querySelector("[data-depart-group]");
  const arriveGroup = document.querySelector("[data-arrive-group]");
  const priceRange = document.querySelector("#price-range");
  const keywordInput = document.querySelector("#search-keyword");
  const clearBtn = document.querySelector("#search-clear");
  const priceLabel = document.querySelector("#price-range-label");
  const sortGroup = document.querySelector("[data-sort-group]");
  let currentSort = "cheapest";

  function formatIDR(num) {
    return num.toLocaleString("id-ID");
  }

  // -----------------------------
  //   FILTER FUNCTION
  // -----------------------------
  function getActiveTime(group) {
    const active = group.querySelector(".pill.is-active");
    return active ? active.dataset.timeRange : "";
  }

  function parseTimeToMinutes(str) {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  }

  function sortFlights(list, sortKey) {
    const items = [...list];
    switch (sortKey) {
      case "fastest":
        return items.sort((a, b) => a.durationMinutes - b.durationMinutes);
      case "earliest":
        return items.sort((a, b) => parseTimeToMinutes(a.depart) - parseTimeToMinutes(b.depart));
      case "latest":
        return items.sort((a, b) => parseTimeToMinutes(b.depart) - parseTimeToMinutes(a.depart));
      default:
      case "cheapest":
        return items.sort((a, b) => a.price - b.price);
    }
  }

  function updatePriceLabel() {
    const max = parseInt(priceRange.max);
    const val = parseInt(priceRange.value);

    if (val >= max) priceLabel.textContent = "Rp 5jt+";
    else priceLabel.textContent = "≤ Rp " + formatIDR(val);
  }

  function applyFilters() {
    const selectedAirlines = airlineInputs.filter(i => i.checked).map(i => i.value);
    const selectedClasses = classInputs.filter(i => i.checked).map(i => i.value);
    const departSlot = getActiveTime(departGroup);
    const arriveSlot = getActiveTime(arriveGroup);
    const maxPrice = parseInt(priceRange.value);
    const keyword = keywordInput.value.toLowerCase();

    const filtered = FLIGHTS.filter(f => {
      if (selectedAirlines.length && !selectedAirlines.includes(f.airline)) return false;
      if (selectedClasses.length && !selectedClasses.includes(f.cabinClass)) return false;
      if (departSlot !== "all" && departSlot && f.departSlot !== departSlot) return false;
      if (arriveSlot !== "all" && arriveSlot && f.arriveSlot !== arriveSlot) return false;
      if (f.price > maxPrice) return false;

      if (keyword) {
        const combined = (f.airline + " " + f.route).toLowerCase();
        if (!combined.includes(keyword)) return false;
      }

      return true;
    });

    const sorted = sortFlights(filtered, currentSort);
    renderResults(sorted);
  }

  // -----------------------------
  //   RENDER RESULTS (TAMBAH PILIH !!!)
  // -----------------------------
  function renderResults(items) {
    if (!items.length) {
      resultsContainer.innerHTML =
        `<div style="padding:16px;">Tidak ada penerbangan tersedia.</div>`;
      return;
    }

    resultsContainer.innerHTML = items
      .map(f => `
        <article class="result-card">
          <div class="result-info">
            <div class="result-airline">${f.airline} • ${f.code}</div>
            <div class="result-meta">${f.route}</div>
            <div class="result-meta">${f.depart} → ${f.arrive} • ${f.duration} • ${f.stops}</div>
            <div class="result-meta">${f.facilities}</div>
          </div>

          <div class="result-price">
            <div class="result-price-main">Rp ${formatIDR(f.price)}</div>
            <div class="result-price-sub">per orang • semua biaya</div>

            <!-- TOMBOL PILIH -->
            <button 
              class="btn btn-primary btn-sm choose-flight"
              data-flight-code="${f.code}">
              Pilih
            </button>
          </div>
        </article>
      `)
      .join("");
  }

  // -----------------------------
  // EVENT FILTER
  // -----------------------------
  [...airlineInputs, ...classInputs].forEach(i =>
    i.addEventListener("change", applyFilters)
  );

  departGroup.addEventListener("click", () => setTimeout(applyFilters));
  arriveGroup.addEventListener("click", () => setTimeout(applyFilters));

  priceRange.addEventListener("input", () => {
    updatePriceLabel();
    applyFilters();
  });

  keywordInput.addEventListener("input", applyFilters);

  clearBtn.addEventListener("click", () => {
    keywordInput.value = "";
    applyFilters();
  });

  sortGroup.addEventListener("click", (e) => {
    const pill = e.target.closest(".pill");
    if (!pill) return;
    currentSort = pill.dataset.sort;
    sortGroup.querySelectorAll(".pill").forEach(p => p.classList.remove("is-active"));
    pill.classList.add("is-active");
    applyFilters();
  });

  updatePriceLabel();
  applyFilters();
}

// =============================
//  COUNTRY SECTION
// =============================
function initCountrySections() {
  const sections = document.querySelectorAll("[data-country-section]");
  if (!sections.length) return;

  const COUNTRY_DESTINATIONS = {
    Singapore: [
      { title: "Jakarta → Singapore", desc: "Durasi 1j 45m" },
      { title: "Surabaya → Singapore", desc: "Transit di Jakarta" },
      { title: "Medan → Singapore", desc: "Termasuk bagasi" },
      { title: "Bali → Singapore", desc: "Terbang malam" }
    ],
    Malaysia: [
      { title: "Jakarta → Kuala Lumpur", desc: "Langsung setiap hari" },
      { title: "Medan → Kuala Lumpur", desc: "Durasi 1j" },
      { title: "Surabaya → Kuala Lumpur", desc: "Bagasi 20kg" },
      { title: "Bali → Penang", desc: "Transit KL" }
    ]
  };

  function renderCountryCards(listEl, items) {
    listEl.innerHTML = items
      .map(
        item => `
        <article class="card-destination">
          <div class="card-thumb">Gambar destinasi</div>
          <div class="card-title">${item.title}</div>
          <div class="card-desc">${item.desc}</div>
        </article>
      `
      )
      .join("");
  }

  sections.forEach(section => {
    const listEl = section.querySelector("[data-country-list]");
    const chips = Array.from(section.querySelectorAll("[data-country]"));

    function setCountry(country) {
      renderCountryCards(listEl, COUNTRY_DESTINATIONS[country] || []);
    }

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        setCountry(chip.dataset.country);
      });
    });

    const active = section.querySelector(".chip.is-active[data-country]") || chips[0];
    if (active) setCountry(active.dataset.country);
  });
}


//  EVENT GLOBAL: PILIH PENERBANGAN
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("choose-flight")) return;

  const code = e.target.dataset.flightCode;
  const flight = FLIGHTS.find(f => f.code === code);

  if (!flight) {
    alert("Data penerbangan tidak ditemukan.");
    return;
  }

  localStorage.setItem("selectedFlight", JSON.stringify(flight));
  window.location.href = "payment.html";
});
