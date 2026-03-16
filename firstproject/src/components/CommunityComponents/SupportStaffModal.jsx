import React, { useState } from "react";
import { Mail, MapPin, Clock, X, Calendar as CalIcon, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

function SupportStaffModal({ staff, isOpen, onClose }) {
  const [view, setView] = useState("profile"); // profile, calendar, reason, confirm
  const [selectedDay, setSelectedDay] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0); // 0 = Feb, 1 = March

  if (!isOpen || !staff) return null;

  // Mock data logic for the demo
  const months = ["February 2026", "March 2026"];
  const availableDays = monthOffset === 0 ? [24, 26, 28] : [2, 4, 10, 15]; // Different days for different months
  const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];

  const handleClose = () => {
    setView("profile");
    setSelectedDay(null);
    setMonthOffset(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border-t-8" 
           style={{ borderColor: staff.bgColor }}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            {view !== "profile" && (
              <button onClick={() => setView("profile")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={20} style={{ color: '#5A4A61' }} />
              </button>
            )}
            <h2 className="text-xl font-bold" style={{ color: '#5A4A61' }}>
              {view === "calendar" ? "Pick a Date" : view === "confirm" ? "Success" : staff.name}
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} style={{ color: '#5A4A61' }} /></button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {/* --- STEP 1: PROFILE --- */}
          {view === "profile" && (
            <div className="p-8 space-y-6">
              <p className="leading-relaxed" style={{ color: '#5A4A61' }}>{staff.about}</p>
              <button 
                onClick={() => setView("calendar")}
                className="w-full py-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: '#CE93D8' }}
              >
                <CalIcon size={20} /> Book Appointment
              </button>
            </div>
          )}

          {/* --- STEP 2: FUNCTIONAL CALENDAR --- */}
          {view === "calendar" && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold" style={{ color: '#5A4A61' }}>{months[monthOffset]}</span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setMonthOffset(0)} 
                      disabled={monthOffset === 0}
                      className={`p-1 rounded-md ${monthOffset === 0 ? 'opacity-20' : 'hover:bg-gray-200'}`}
                    >
                      <ChevronLeft size={24} style={{ color: '#5A4A61' }} />
                    </button>
                    <button 
                      onClick={() => setMonthOffset(1)} 
                      disabled={monthOffset === 1}
                      className={`p-1 rounded-md ${monthOffset === 1 ? 'opacity-20' : 'hover:bg-gray-200'}`}
                    >
                      <ChevronRight size={24} style={{ color: '#5A4A61' }} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold mb-2" style={{ color: '#CE93D8' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {/* Calendar Padding (Assuming Feb 2026 starts on Sunday) */}
                  {[...Array(monthOffset === 0 ? 0 : 0)].map((_, i) => <div key={i} />)} 
                  {[...Array(28 + monthOffset * 3)].map((_, i) => {
                    const day = i + 1;
                    const isAvailable = availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        disabled={!isAvailable}
                        onClick={() => setSelectedDay(day)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                          ${isAvailable ? 'font-bold hover:scale-105' : 'text-gray-300 cursor-not-allowed'}
                          ${selectedDay === day ? 'ring-2 ring-purple-400 ring-offset-1' : ''}`}
                        style={{ 
                          backgroundColor: selectedDay === day ? '#CE93D8' : isAvailable ? '#E1BEE7' : 'transparent',
                          color: selectedDay === day ? 'white' : '#5A4A61'
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDay && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-bold text-sm" style={{ color: '#5A4A61' }}>Available Slots for {selectedDay} {months[monthOffset].split(' ')[0]}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map(time => (
                      <button 
                        key={time}
                        onClick={() => setView("confirm")}
                        className="py-3 rounded-xl border-2 font-medium hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                        style={{ borderColor: '#EEE', color: '#5A4A61' }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- STEP 3: CONFIRMATION --- */}
          {view === "confirm" && (
            <div className="p-12 text-center space-y-4">
              <div className="flex justify-center"><CheckCircle size={80} style={{ color: '#B3DDB9' }} /></div>
              <h3 className="text-2xl font-bold" style={{ color: '#5A4A61' }}>Request Sent!</h3>
              <p style={{ color: '#5A4A61' }}>You've requested a meeting for <strong>{selectedDay} {months[monthOffset].split(' ')[0]}</strong>. <br/>A calendar invite is being sent to your student email.</p>
              <button onClick={handleClose} className="px-10 py-3 rounded-xl font-bold text-white shadow-md" style={{ backgroundColor: '#B3DDB9' }}>Return to Directory</button>
            </div>
          )}

          {/* Profile Footer */}
          {view === "profile" && (
            <div className="p-6 bg-gray-50 m-4 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={18} style={{ color: '#B3DDB9' }} />
                  <span style={{ color: '#5A4A61' }}>{staff.location}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock size={18} style={{ color: '#B3DDB9' }} />
                  <span style={{ color: '#5A4A61' }}>{staff.availability}</span>
                </div>
              </div>
              <a href={`mailto:${staff.email}`} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2"
                 style={{ backgroundColor: '#B3DDB9', borderColor: '#B3DDB9', color: '#5A4A61' }}>
                <Mail size={18} /> Send Email
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupportStaffModal;