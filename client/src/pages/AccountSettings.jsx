import { useState } from "react";
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

  return (
    <div className="relative">
      {label && <label className="block text-sm text-muted-foreground mb-1">{label}</label>}
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
          <motion.div
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Personal Data Form
// import { useState } from "react";
function PersonalDataForm({ user }) {
  // Parse birth_date (YYYY-MM-DD) if available
  let birthDay = "";
  let birthMonth = "";
  let birthYear = "";
  if (user?.birth_date) {
    const [y, m, d] = user.birth_date.split("-");
    birthDay = d;
    birthMonth =
      ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][parseInt(m, 10) - 1];
    birthYear = y;
  }
  const [formData, setFormData] = useState({
    fullName: user?.full_name || user?.name || "",
    gender: user?.gender || "Laki-laki",
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
          email: user?.email,
          full_name: formData.fullName,
          gender: genderValue,
          birth_date,
          city: formData.city
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Gagal menyimpan data.");
      }
    } catch (err) {
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
function ContactList({ title, subtitle, items, onAdd, buttonLabel }) {
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
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const emails = [
    { value: user?.email || "user@example.com", isPrimary: true }
  ];

  const phones = [];

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
              subtitle="Anda bisa mendaftarkan maks. 3 email"
              items={emails}
              onAdd={() => {}}
              buttonLabel="Tambah Email"
            />
            
            <ContactList
              title="No. Handphone"
              subtitle="Anda bisa mendaftarkan maks. 3 no handphone"
              items={phones}
              onAdd={() => {}}
              buttonLabel="Tambah No. Handphone"
            />
            
            <ConnectedAccounts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
