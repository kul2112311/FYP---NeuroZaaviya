import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Calendar({ onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 15));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 15));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleDateClick = (day) => {
    if (!day) return;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    
    setSelectedDate(date);
    onDateSelect && onDateSelect(date);
  };

  const isSelected = (day) => {
    if (!day) return false;
    return day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth();
  };



  return (
    <div className="bg-white rounded-3xl p-6 max-w-sm shadow-sm border border-[#B39DDB]/20">
      <h3 className="text-[#B39DDB] text-sm font-semibold mb-4 uppercase tracking-wide">Select Date</h3>
      
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-1 hover:bg-[#B39DDB]/10 rounded-lg transition-colors">
          <ChevronLeft size={20} className="text-[#B39DDB]" />
        </button>
        <h2 className="text-gray-800 font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-1 hover:bg-[#B39DDB]/10 rounded-lg transition-colors">
          <ChevronRight size={20} className="text-[#B39DDB]" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-[#B39DDB] py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            // disabled={isWeekend(day)}
            className={`aspect-square rounded-lg text-sm font-medium transition-all ${
              isSelected(day) 
                ? "bg-[#B39DDB] text-white shadow-md" 
                :  "text-gray-700 hover:bg-[#B39DDB]/10"
               
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="bg-[#B39DDB]/10 border border-[#B39DDB]/20 rounded-lg p-3 text-xs text-gray-700">
        <span className="font-semibold text-[#B39DDB]">Note:</span> Appointments only Monday-Friday, 8:00 AM to 6:00 PM.
      </div>
    </div>
  );
}

export default Calendar;