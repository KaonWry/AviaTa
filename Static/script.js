
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

  // Pills filter umum (waktu berangkat/tiba, dsb.) – visual doang
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

  // Dummy tracking (Ga ngerti backend-nya gimana)
  const trackingForm = document.querySelector("#tracking-form");
  if (trackingForm) {
    trackingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = trackingForm.querySelector("input");
      alert(`Tracking untuk nomor penerbangan: ${input.value || "AV1234"} `);
    });
  }
});

function initSearchPage() {
  const searchPage = document.querySelector(".page-search");
  if (!searchPage) return;

  // Data dummy penerbangan
  const FLIGHTS = [
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

  function getActiveTime(group) {
    if (!group) return "";
    const active = group.querySelector(".pill.is-active");
    return active ? (active.dataset.timeRange || "") : "";
  }

  function parseTimeToMinutes(str) {
    const parts = str.split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
  }

  function sortFlights(items, sortKey) {
    const arr = items.slice();
    switch (sortKey) {
      case "fastest":
        arr.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
      case "earliest":
        arr.sort((a, b) => parseTimeToMinutes(a.depart) - parseTimeToMinutes(b.depart));
        break;
      case "latest":
        arr.sort((a, b) => parseTimeToMinutes(b.depart) - parseTimeToMinutes(a.depart));
        break;
      case "cheapest":
      default:
        arr.sort((a, b) => a.price - b.price);
        break;
    }
    return arr;
  }

  function updatePriceLabel() {
    if (!priceRange || !priceLabel) return;
    const max = parseInt(priceRange.max, 10);
    const val = parseInt(priceRange.value, 10);
    if (val >= max) {
      priceLabel.textContent = "Rp 5jt+";
    } else {
      priceLabel.textContent = "≤ Rp " + formatIDR(val);
    }
  }

  function applyFilters() {
    const selectedAirlines = airlineInputs.filter((i) => i.checked).map((i) => i.value);
    const selectedClasses = classInputs.filter((i) => i.checked).map((i) => i.value);
    const departSlot = getActiveTime(departGroup);
    const arriveSlot = getActiveTime(arriveGroup);
    const maxPrice = priceRange ? parseInt(priceRange.value, 10) : Infinity;
    const keyword = keywordInput ? keywordInput.value.toLowerCase().trim() : "";

    const filtered = FLIGHTS.filter((f) => {
      if (selectedAirlines.length && !selectedAirlines.includes(f.airline)) return false;
      if (selectedClasses.length && !selectedClasses.includes(f.cabinClass)) return false;

      if (departSlot && departSlot !== "all" && f.departSlot !== departSlot) return false;
      if (arriveSlot && arriveSlot !== "all" && f.arriveSlot !== arriveSlot) return false;

      if (maxPrice && f.price > maxPrice) return false;

      if (keyword) {
        const combined = (f.airline + " " + f.route + " " + f.from + " " + f.to).toLowerCase();
        if (!combined.includes(keyword)) return false;
      }
      return true;
    });

    const sorted = sortFlights(filtered, currentSort);
    renderResults(sorted);
  }

  function renderResults(items) {
    if (!resultsContainer) return;
    if (!items.length) {
      resultsContainer.innerHTML =
        '<div style="padding:16px; font-size:13px;">Tidak ada penerbangan yang cocok dengan filter saat ini.</div>';
      return;
    }

    resultsContainer.innerHTML = items
      .map(
        (f) => `
      <article class="result-card">
        <div class="result-info">
          <div class="result-airline">${f.airline} • ${f.code}</div>
          <div class="result-meta">${f.from} ${f.depart} → ${f.to} ${f.arrive} • ${f.duration} • ${f.stops}</div>
          <div class="result-meta">${f.facilities}</div>
        </div>
        <div class="result-price">
          <div class="result-price-main">Rp ${formatIDR(f.price)}</div>
          <div class="result-price-sub">per orang • semua biaya</div>
          <button class="btn btn-primary btn-sm" type="button">Pilih</button>
        </div>
      </article>
    `
      )
      .join("");
  }

  [...airlineInputs, ...classInputs].forEach((i) => i.addEventListener("change", applyFilters));

  if (departGroup) {
    departGroup.addEventListener("click", () => {
      setTimeout(applyFilters, 0);
    });
  }

  if (arriveGroup) {
    arriveGroup.addEventListener("click", () => {
      setTimeout(applyFilters, 0);
    });
  }

  if (priceRange) {
    priceRange.addEventListener("input", () => {
      updatePriceLabel();
      applyFilters();
    });
  }

  if (keywordInput) {
    keywordInput.addEventListener("input", applyFilters);
  }

  if (clearBtn && keywordInput) {
    clearBtn.addEventListener("click", () => {
      keywordInput.value = "";
      applyFilters();
    });
  }

  if (sortGroup) {
    sortGroup.addEventListener("click", (e) => {
      const pill = e.target.closest(".pill");
      if (!pill) return;

      const sortKey = pill.dataset.sort || "cheapest";
      currentSort = sortKey;

      sortGroup.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");

      applyFilters();
    });
  }

  updatePriceLabel();
  applyFilters();
}

function initCountrySections() {
  const sections = document.querySelectorAll("[data-country-section]");
  if (!sections.length) return;

  const COUNTRY_DESTINATIONS = {
    Singapore: [
      { title: "Jakarta → Singapore", desc: "Durasi 1 jam 45 menit" },
      { title: "Surabaya → Singapore", desc: "Transit di Jakarta" },
      { title: "Medan → Singapore", desc: "Termasuk bagasi 20kg" },
      { title: "Bali → Singapore", desc: "Terbang malam hari" }
    ],
    Malaysia: [
      { title: "Jakarta → Kuala Lumpur", desc: "Penerbangan langsung setiap hari" },
      { title: "Medan → Kuala Lumpur", desc: "Durasi 1 jam 5 menit" },
      { title: "Surabaya → Kuala Lumpur", desc: "Termasuk bagasi 20kg" },
      { title: "Bali → Penang", desc: "Transit di Kuala Lumpur" }
    ],
    Japan: [
      { title: "Jakarta → Tokyo (NRT)", desc: "Durasi 7 jam, sekali transit" },
      { title: "Jakarta → Osaka (KIX)", desc: "Termasuk makan 2x, bagasi 30kg" },
      { title: "Surabaya → Tokyo (HND)", desc: "Transit di Jakarta" },
      { title: "Bali → Tokyo (NRT)", desc: "Paket liburan musim dingin" }
    ],
    "Korea Utara": [
      { title: "Jakarta → Pyongyang", desc: "Penerbangan charter khusus" },
      { title: "Singapore → Pyongyang", desc: "Transit di Beijing" },
      { title: "Kuala Lumpur → Pyongyang", desc: "Termasuk tur kota" },
      { title: "Bangkok → Pyongyang", desc: "Jadwal terbatas" }
    ]
  };

  function renderCountryCards(listEl, items) {
    if (!listEl) return;
    listEl.innerHTML = items
      .map(
        (item) => `
      <article class="card-destination">
        <div class="card-thumb">Gambar destinasi</div>
        <div class="card-title">${item.title}</div>
        <div class="card-desc">${item.desc}</div>
      </article>
    `
      )
      .join("");
  }

  sections.forEach((section) => {
    const listEl = section.querySelector("[data-country-list]");
    const chips = Array.from(section.querySelectorAll("[data-country]"));
    if (!listEl || !chips.length) return;

    function setCountry(country) {
      const items = COUNTRY_DESTINATIONS[country] || [];
      renderCountryCards(listEl, items);
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        setCountry(chip.dataset.country);
      });
    });

    const activeChip =
      section.querySelector(".chip.is-active[data-country]") || chips[0];
    if (activeChip) {
      setCountry(activeChip.dataset.country);
    }
  });
}
