import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import { cn } from "../../lib/utils";

// Helper function to get days of the week (Mon-Sat, 6 days)
const getWeekDays = (startDate) => {
  const days = [];
  const startOfWeek = new Date(startDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(startOfWeek);
    nextDay.setDate(startOfWeek.getDate() + i);
    days.push(nextDay);
  }
  return days;
};

// Format date for display
const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

// Day names in Indonesian
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Flight Date Picker Component
export function FlightDatePicker({ 
  label, 
  value, 
  onChange, 
  minDate = new Date(),
  placeholder = "Pilih tanggal",
  className 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const dropdownRef = useRef(null);

  const weekDays = getWeekDays(currentDate);
  const monthYear = currentDate.toLocaleDateString("id-ID", { 
    year: "numeric", 
    month: "long" 
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    if (date >= new Date(minDate.setHours(0, 0, 0, 0))) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const changeWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date) => {
    if (!value) return false;
    return value.toDateString() === date.toDateString();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors group text-left",
          className
        )}
      >
        <CalendarDays className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {label && (
            <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
          )}
          <div className={cn(
            "text-sm truncate",
            value ? "text-foreground" : "text-muted-foreground"
          )}>
            {value ? formatDate(value) : placeholder}
          </div>
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="p-1 hover:bg-muted rounded-full"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </button>

      {/* Dropdown Calendar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-popover border border-border rounded-xl shadow-xl z-50 min-w-[300px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{monthYear}</h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => changeWeek("prev")}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => changeWeek("next")}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Day Selection Grid */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day, index) => {
                const disabled = isDateDisabled(day);
                const selected = isDateSelected(day);
                const today = isToday(day);

                return (
                  <div key={day.toISOString()} className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1.5 font-medium">
                      {dayNames[index]}
                    </span>
                    <button
                      type="button"
                      onClick={() => !disabled && handleDateSelect(day)}
                      disabled={disabled}
                      className={cn(
                        "relative w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200",
                        "flex items-center justify-center",
                        disabled && "opacity-30 cursor-not-allowed",
                        !disabled && !selected && "hover:bg-muted cursor-pointer",
                        today && !selected && "ring-1 ring-primary/50",
                        selected && "text-primary-foreground"
                      )}
                    >
                      <AnimatePresence>
                        {selected && (
                          <motion.div
                            layoutId="date-selector"
                            className="absolute inset-0 rounded-lg bg-primary"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                      </AnimatePresence>
                      <span className="relative z-10">{day.getDate()}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="flex-1 px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 rounded-md transition-colors"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  handleDateSelect(tomorrow);
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 rounded-md transition-colors"
              >
                Besok
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  handleDateSelect(nextWeek);
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 rounded-md transition-colors"
              >
                +7 Hari
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FlightDatePicker;
