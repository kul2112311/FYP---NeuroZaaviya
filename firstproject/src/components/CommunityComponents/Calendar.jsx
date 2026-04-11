import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const C = {
  purple800: "#5a4a61",
  purple600: "#9575a3",
  purple500: "#b39ddb",
  purple400: "#c0b4cc",
  purple300: "#d8cfe0",
  purple100: "rgba(179,157,219,0.15)",
  green:     "#22c55e",
  white:     "#FFFFFF",
};

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const dayNames   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// selectedDate is now a controlled prop — pass it in from the parent (Schedule)
function Calendar({ onDateSelect, appointments = [], selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const bookedDays = new Set(
    appointments
      .filter(a => {
        const [y, m] = a.date.split("-").map(Number);
        return y === year && m === month + 1;
      })
      .map(a => a.date)
  );

  const countForDay = (day) => {
    if (!day) return 0;
    const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return appointments.filter(a => a.date === key).length;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const date = new Date(year, month, day);
    onDateSelect && onDateSelect(date);
  };

  const isSelected = (day) =>
    day &&
    selectedDate &&
    day === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year  === selectedDate.getFullYear();

  const isToday = (day) => {
    const t = new Date();
    return day && day === t.getDate() && month === t.getMonth() && year === t.getFullYear();
  };

  const isBooked = (day) => {
    if (!day) return false;
    const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return bookedDays.has(key);
  };

  // When a confirmed appointment is on a different month, auto-advance the calendar view
  const handleMonthChange = (delta) => {
    setCurrentDate(new Date(year, month + delta));
  };

  return (
    <div style={{
      background: C.white,
      borderRadius: 24,
      padding: 24,
      minWidth: 300,
      maxWidth: 340,
      border: `1px solid ${C.purple300}`,
      boxSizing: "border-box",
    }}>
      <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.purple500, textTransform: "uppercase" }}>
        Select Date
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button
          onClick={() => handleMonthChange(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, color: C.purple500 }}
        >
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.purple800 }}>
          {monthNames[month]} {year}
        </span>
        <button
          onClick={() => handleMonthChange(1)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, color: C.purple500 }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {dayNames.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.purple500, padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 20 }}>
        {days.map((day, i) => {
          const selected = isSelected(day);
          const today    = isToday(day);
          const booked   = isBooked(day);
          const count    = countForDay(day);

          return (
            <button
              key={i}
              onClick={() => handleDateClick(day)}
              disabled={!day}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                border: today && !selected ? `1.5px solid ${C.purple500}` : "none",
                background: selected ? C.purple500 : "transparent",
                color: selected ? C.white : day ? C.purple800 : "transparent",
                fontSize: 13,
                fontWeight: selected || today ? 600 : 400,
                cursor: day ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: "4px 0",
                transition: "background 0.15s",
                position: "relative",
              }}
              onMouseEnter={e => { if (!selected && day) e.currentTarget.style.background = C.purple100; }}
              onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ lineHeight: 1 }}>{day}</span>
              {booked && (
                <div style={{ display: "flex", gap: 2, marginTop: 1 }}>
                  {Array.from({ length: Math.min(count, 3) }).map((_, di) => (
                    <span key={di} style={{
                      width: 4, height: 4, borderRadius: "50%",
                      background: selected ? C.white : C.green,
                      display: "block",
                    }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: C.purple600 }}>Booked slot</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${C.purple500}`, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: C.purple600 }}>Today</span>
        </div>
      </div>

      <div style={{
        background: C.purple100,
        border: `1px solid ${C.purple300}`,
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 11,
        color: C.purple800,
      }}>
        <span style={{ fontWeight: 600, color: C.purple500 }}>Note: </span>
        Appointments only Monday–Friday, 8:00 AM to 6:00 PM.
      </div>
    </div>
  );
}

export default Calendar;