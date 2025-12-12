import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User,
  Edit3,
  Trash2,
  Plus,
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/auth-context";
import { AccountSidebar } from "../components/ui/account-sidebar";

// Passenger Form Modal
function PassengerFormModal({ isOpen, onClose, passenger, onSave }) {
  const [formData, setFormData] = useState(passenger || {
    title: "Tn.",
    firstName: "",
    lastName: "",
    nationality: "Indonesia",
    idType: "KTP",
    idNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-card rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">
            {passenger ? "Edit Penumpang" : "Tambah Penumpang"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Title</label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option>Tn.</option>
                <option>Ny.</option>
                <option>Nn.</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-sm text-muted-foreground mb-1">Nama Depan</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Nama Belakang</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Kewarganegaraan</label>
            <select
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option>Indonesia</option>
              <option>Malaysia</option>
              <option>Singapore</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Jenis ID</label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option>KTP</option>
                <option>Paspor</option>
                <option>SIM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Nomor ID</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Passenger Card
function PassengerCard({ passenger, index, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
        <span className="text-foreground">
          {index + 1}. {passenger.title} {passenger.firstName} {passenger.lastName}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onEdit(passenger)}
          className="text-sm text-primary hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(passenger.id)}
          className="text-sm text-red-500 hover:underline"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

// Main Passengers Page
export function Passengers() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [passengers, setPassengers] = useState([
    {
      id: 1,
      title: "Tn.",
      firstName: user?.name?.split(" ")[0] || "User",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      nationality: "Indonesia",
      idType: "KTP",
      idNumber: ""
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleAddPassenger = () => {
    setEditingPassenger(null);
    setIsModalOpen(true);
  };

  const handleEditPassenger = (passenger) => {
    setEditingPassenger(passenger);
    setIsModalOpen(true);
  };

  const handleDeletePassenger = (id) => {
    setPassengers(passengers.filter(p => p.id !== id));
  };

  const handleSavePassenger = (data) => {
    if (editingPassenger) {
      setPassengers(passengers.map(p => 
        p.id === editingPassenger.id ? { ...data, id: p.id } : p
      ));
    } else {
      setPassengers([...passengers, { ...data, id: Date.now() }]);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-card border border-border rounded-xl p-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Daftar Penumpang</h1>
              <p className="text-muted-foreground mb-6">
                Anda dapat menambahkan sampai dengan 40 penumpang
              </p>

              {/* Passengers List */}
              <div className="mb-4">
                {passengers.map((passenger, idx) => (
                  <PassengerCard
                    key={passenger.id}
                    passenger={passenger}
                    index={idx}
                    onEdit={handleEditPassenger}
                    onDelete={handleDeletePassenger}
                  />
                ))}
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddPassenger}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Tambah Penumpang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <PassengerFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            passenger={editingPassenger}
            onSave={handleSavePassenger}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Passengers;
