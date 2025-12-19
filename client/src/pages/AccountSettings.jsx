import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown,
  Plus,
  Trash2,
  Edit3,
  Check,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/auth-context";
import { AccountSidebar } from "../components/ui/account-sidebar";

// Custom Select Component
function CustomSelect({ label, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const MotionDiv = motion.div;

  return (
    <div className="relative">
      <div className="block text-sm text-muted-foreground mb-1 h-5">
        {label ? label : "\u00A0"}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-background border border-border rounded-lg text-sm hover:border-primary/50 transition-colors"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors",
                  value === option.value && "bg-primary/10 text-primary"
                )}
              >
                {option.label}
              </button>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

// Personal Data Form
// import { useState } from "react";
function PersonalDataForm({ user }) {
  const { updateUser } = useAuth();

  const toGenderLabel = (value) => {
    if (!value) return "";
    const v = String(value).toLowerCase();
    if (v === "male") return "Laki-laki";
    if (v === "female") return "Perempuan";
    return value;
  };

  const normalizeDatePart = (value) => {
    if (!value) return "";
    const s = String(value);
    return s.includes("T") ? s.slice(0, 10) : s;
  };

  // Parse birth_date (YYYY-MM-DD) if available
  let birthDay = "";
  let birthMonth = "";
  let birthYear = "";
  const normalizedBirthDate = normalizeDatePart(user?.birth_date);
  if (normalizedBirthDate && /^\d{4}-\d{2}-\d{2}$/.test(normalizedBirthDate)) {
    const [y, m, d] = normalizedBirthDate.split("-");
    birthDay = String(parseInt(d, 10));
    birthMonth =
      ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][parseInt(m, 10) - 1];
    birthYear = y;
  }
  const [formData, setFormData] = useState({
    fullName: user?.full_name || user?.name || "",
    gender: toGenderLabel(user?.gender) || "Laki-laki",
    birthDay: birthDay || "1",
    birthMonth: birthMonth || "Januari",
    birthYear: birthYear || "2000",
    city: user?.city || ""
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ].map(m => ({ value: m, label: m }));
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: String(year), label: String(year) };
  });
  const genders = [
    { value: "Laki-laki", label: "Laki-laki" },
    { value: "Perempuan", label: "Perempuan" }
  ];

  // Keep form in sync when session user is refreshed
  useEffect(() => {
    const nextBirthDate = normalizeDatePart(user?.birth_date);
    let nextDay = "1";
    let nextMonth = "Januari";
    let nextYear = "2000";
    if (nextBirthDate && /^\d{4}-\d{2}-\d{2}$/.test(nextBirthDate)) {
      const [y, m, d] = nextBirthDate.split("-");
      nextDay = String(parseInt(d, 10));
      nextMonth =
        ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][parseInt(m, 10) - 1] || nextMonth;
      nextYear = y;
    }

    setFormData((prev) => ({
      ...prev,
      fullName: user?.full_name || user?.name || "",
      gender: toGenderLabel(user?.gender) || "Laki-laki",
      birthDay: nextDay,
      birthMonth: nextMonth,
      birthYear: nextYear,
      city: user?.city || "",
    }));
  }, [user?.id, user?.full_name, user?.name, user?.gender, user?.birth_date, user?.city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    // Convert to YYYY-MM-DD
    const monthNum = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ].indexOf(formData.birthMonth) + 1;
    const birth_date = `${formData.birthYear}-${String(monthNum).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`;
    // Convert gender to 'male' or 'female'
    let genderValue = formData.gender;
    if (genderValue.toLowerCase() === "laki-laki") genderValue = "male";
    if (genderValue.toLowerCase() === "perempuan") genderValue = "female";
    try {
      const res = await fetch("http://localhost:3001/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          full_name: formData.fullName,
          gender: genderValue,
          birth_date,
          city: formData.city
        })
      });
      const data = await res.json();
      if (data.success) {
        // Fetch updated user profile (by id) and refresh session
        if (user?.id) {
          const profileRes = await fetch(
            `http://localhost:3001/api/user/profile?id=${encodeURIComponent(String(user.id))}`
          );
          const profileData = await profileRes.json();
          if (profileRes.ok && profileData.success) {
            updateUser(profileData.user);
          }
        }
        setSuccess(true);
      } else {
        setError(data.error || "Gagal menyimpan data.");
      }
    } catch {
      setError("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-bold text-lg text-foreground mb-6">Data Pribadi</h3>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Nama Lengkap</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground outline-none focus:border-primary transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Nama lengkap Anda akan disingkat untuk nama profil.
          </p>
        </div>

        {/* Gender & Birth Date */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CustomSelect
            label="Kelamin"
            value={formData.gender}
            onChange={(val) => setFormData({ ...formData, gender: val })}
            options={genders}
            placeholder="Pilih"
          />
          <CustomSelect
            label="Tanggal Lahir"
            value={formData.birthDay}
            onChange={(val) => setFormData({ ...formData, birthDay: val })}
            options={days}
            placeholder="Tanggal"
          />
          <CustomSelect
            label=""
            value={formData.birthMonth}
            onChange={(val) => setFormData({ ...formData, birthMonth: val })}
            options={months}
            placeholder="Bulan"
          />
          <CustomSelect
            label=""
            value={formData.birthYear}
            onChange={(val) => setFormData({ ...formData, birthYear: val })}
            options={years}
            placeholder="Tahun"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Kota Tempat Tinggal</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Kota Tempat Tinggal"
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button type="button" className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Nanti saja
          </button>
          <button type="submit" className="px-6 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
        {success && <div className="text-green-600 text-sm mt-2">Data berhasil disimpan!</div>}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
}

// Contact List Component (for Email & Phone)
function ContactList({ title, subtitle, items, onAdd, buttonLabel, children }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
          {buttonLabel}
        </button>
      </div>
      
      {items.length > 0 && (
        <div className="border-t border-border pt-4 space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-sm text-foreground">
                {idx + 1}. {item.value}
              </span>
              {item.isPrimary && (
                <span className="text-xs text-primary">Alamat untuk menerima notifikasi</span>
              )}
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}

// Connected Accounts Component
function ConnectedAccounts() {
  const accounts = [
    { name: "Facebook", icon: "f", color: "bg-blue-600", connected: false },
    { name: "Google", icon: "G", color: "bg-white border border-border", connected: true },
    { name: "LINE", icon: "💬", color: "bg-green-500", connected: false },
    { name: "Apple", icon: "", color: "bg-black", connected: false },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-bold text-lg text-foreground mb-2">Akun yang Terhubung</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Masuk lebih mudah dengan menghubungkan akun sosial Anda ke AviaTa
      </p>
      
      <div className="space-y-3">
        {accounts.map((account) => (
          <div key={account.name} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold", account.color)}>
                {account.name === "Apple" ? "🍎" : account.icon}
              </div>
              <span className="font-medium text-foreground">{account.name}</span>
              {account.connected && <Check className="w-4 h-4 text-green-500" />}
            </div>
            {!account.connected && (
              <button className="text-sm text-primary hover:underline">
                Hubungkan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Account Settings Page
export function AccountSettings() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailValue, setEmailValue] = useState(user?.email || "");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(user?.phone || "");
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    setPhoneValue(user?.phone || "");
  }, [user?.phone]);

  useEffect(() => {
    setEmailValue(user?.email || "");
  }, [user?.email]);

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const emails = [
    { value: user?.email || "", isPrimary: true }
  ];

  const phones = user?.phone ? [{ value: user.phone, isPrimary: true }] : [];

  const handleStartEmailEdit = () => {
    setEmailError("");
    setEmailSuccess(false);
    setEmailValue(user?.email || "");
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setEmailSaving(true);
    setEmailError("");
    setEmailSuccess(false);
    try {
      const nextEmail = emailValue.trim();
      const res = await fetch("http://localhost:3001/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: nextEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setEmailError(data.error || "Gagal menyimpan email.");
        return;
      }

      const profileRes = await fetch(
        `http://localhost:3001/api/user/profile?id=${encodeURIComponent(String(user.id))}`
      );
      const profileData = await profileRes.json();
      if (profileRes.ok && profileData.success) {
        updateUser(profileData.user);
      }

      setEmailSuccess(true);
      setIsEditingEmail(false);
    } catch {
      setEmailError("Gagal menyimpan email.");
    } finally {
      setEmailSaving(false);
    }
  };

  const handleStartPhoneEdit = () => {
    setPhoneError("");
    setPhoneSuccess(false);
    setPhoneValue(user?.phone || "");
    setIsEditingPhone(true);
  };

  const handleSavePhone = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setPhoneSaving(true);
    setPhoneError("");
    setPhoneSuccess(false);
    try {
      const res = await fetch("http://localhost:3001/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          phone: phoneValue.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPhoneError(data.error || "Gagal menyimpan nomor handphone.");
        return;
      }

      const profileRes = await fetch(
        `http://localhost:3001/api/user/profile?id=${encodeURIComponent(String(user.id))}`
      );
      const profileData = await profileRes.json();
      if (profileRes.ok && profileData.success) {
        updateUser(profileData.user);
      }

      setPhoneSuccess(true);
      setIsEditingPhone(false);
    } catch {
      setPhoneError("Gagal menyimpan nomor handphone.");
    } finally {
      setPhoneSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
            
            {/* Tabs */}
            <div className="flex gap-6 border-b border-border">
              <button className="pb-3 text-primary border-b-2 border-primary font-medium">
                Informasi Akun
              </button>
              <button className="pb-3 text-muted-foreground hover:text-foreground transition-colors">
                Password & Keamanan
              </button>
            </div>

            {/* Forms */}
            <PersonalDataForm user={user} />
            
            <ContactList
              title="Email"
              subtitle="Untuk saat ini, 1 email per akun"
              items={emails}
              onAdd={handleStartEmailEdit}
              buttonLabel={user?.email ? "Ubah Email" : "Tambah Email"}
            >
              {isEditingEmail && (
                <form onSubmit={handleSaveEmail} className="border-t border-border pt-4 mt-4 space-y-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        setIsEditingEmail(false);
                        setEmailError("");
                        setEmailSuccess(false);
                        setEmailValue(user?.email || "");
                      }}
                      disabled={emailSaving}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                      disabled={emailSaving}
                    >
                      {emailSaving ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>

                  {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
                </form>
              )}

              {emailSuccess && !isEditingEmail && (
                <div className="border-t border-border pt-4 mt-4 text-green-600 text-sm">
                  Email berhasil disimpan.
                </div>
              )}
            </ContactList>
            
            <ContactList
              title="No. Handphone"
              subtitle="Anda bisa mendaftarkan maks. 3 no handphone"
              items={phones}
              onAdd={handleStartPhoneEdit}
              buttonLabel={user?.phone ? "Ubah No. Handphone" : "Tambah No. Handphone"}
            >
              {isEditingPhone && (
                <form onSubmit={handleSavePhone} className="border-t border-border pt-4 mt-4 space-y-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">No. Handphone</label>
                    <input
                      type="tel"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Untuk saat ini, 1 nomor per akun.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        setIsEditingPhone(false);
                        setPhoneError("");
                        setPhoneSuccess(false);
                        setPhoneValue(user?.phone || "");
                      }}
                      disabled={phoneSaving}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                      disabled={phoneSaving}
                    >
                      {phoneSaving ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>

                  {phoneError && <div className="text-red-500 text-sm">{phoneError}</div>}
                </form>
              )}

              {phoneSuccess && !isEditingPhone && (
                <div className="border-t border-border pt-4 mt-4 text-green-600 text-sm">
                  Nomor handphone berhasil disimpan.
                </div>
              )}
            </ContactList>
            
            <ConnectedAccounts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
