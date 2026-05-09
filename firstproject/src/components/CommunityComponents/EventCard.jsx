import { Calendar, Clock, MapPin, Users, Eye, Info, Tag, X } from 'lucide-react';

// --- Helper Functions for Clean Formatting ---

const formatDate = (dateStr) => {
  if (!dateStr) return "TBD";
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj)) return dateStr; // Fallback if parsing fails
  return dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "TBD";
  // Convert "15:15:00" to "3:15 PM"
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // Convert 0 or 15 to 12 or 3
  return `${hour}:${minuteStr} ${ampm}`;
};

const getDaysLeftText = (days) => {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
};

// ---------------------------------------------

export function EventCard({ event, onViewDetails, isAdmin }) {
  const calculateDays = (dateStr) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    // Zero out the time so it strictly compares days
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = event.daysUntil ?? calculateDays(event.date);

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden transition-all hover:shadow-md group">
      
      {/* Tag + Days */}
      <div className="flex justify-between items-start mb-5">
        <span className="bg-[#f3e5f5] text-[#9575a3] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          {event.tag}
        </span>
        <span className="text-[#d81b60] font-bold text-xs bg-[#fce4ec] px-3 py-1.5 rounded-full">
          {getDaysLeftText(daysLeft)}
        </span>
      </div>

      {/* Event Title */}
      <h3 className="text-xl font-bold text-[#5A4A61] mb-2 leading-tight">{event.title}</h3>
      <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{event.description}</p>

      {/* Details with "Pazzaz" (Icon Bubbles) */}
      <div className="space-y-3 mb-6 text-sm font-medium text-[#5A4A61]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-[#fdf7fd] border border-[#f3e5f5]">
            <Calendar size={16} className="text-[#B39DDB]" />
          </div>
          {formatDate(event.date)}
        </div>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-[#fdf7fd] border border-[#f3e5f5]">
            <Clock size={16} className="text-[#B39DDB]" />
          </div>
          {formatTime(event.time)}
        </div>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-[#fdf7fd] border border-[#f3e5f5]">
            <MapPin size={16} className="text-[#B39DDB]" />
          </div>
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      {/* Button */}
      <button 
        onClick={onViewDetails}
        className="w-full bg-gradient-to-r from-[#B39DDB] to-[#9575a3] text-white py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 hover:opacity-90 shadow-sm"
      >
        <Eye size={18} />
        {isAdmin ? "Edit Details" : "View Details"}
      </button>
    </div>
  );
}

export function EventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-10">
          <X size={24} className="text-[#5A4A61]" />
        </button>

        <div className="p-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#f3e5f5] text-[#9575a3] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              {event.tag}
            </span>
          </div>
          
          <h2 className="text-4xl font-black text-[#5A4A61] mb-2 leading-tight">{event.title}</h2>
          <p className="text-[#B39DDB] font-medium mb-10 text-lg">OAP Counseling & Events Division</p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <InfoBox icon={<Calendar size={20} />} label="Date" value={formatDate(event.date)} />
            <InfoBox icon={<Clock size={20} />} label="Time" value={formatTime(event.time)} />
            <InfoBox icon={<MapPin size={20} />} label="Location" value={event.location} />
          </div>

          {/* Requirements Section */}
          <div className="mb-8">
            <h3 className="text-[#5A4A61] font-bold text-lg mb-4 flex items-center gap-2">
              <Info size={20} className="text-[#f48fb1]" /> Requirements
            </h3>
            <div className="bg-[#fdf7fd] border border-[#f3e5f5] rounded-3xl p-6 text-[#5A4A61] font-medium leading-relaxed">
              {event.requirements || "No specific requirements for this event."}
            </div>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h3 className="text-[#5A4A61] font-bold text-lg mb-4">Event Overview</h3>
            <p className="text-gray-600 leading-relaxed text-base font-medium">
              {event.description}
            </p>
          </div>

          {/* Footer Contact */}
          <div className="bg-[#f5eef8] rounded-[2rem] p-8 text-[#5A4A61]">
            <h3 className="font-bold mb-5 uppercase tracking-widest text-xs text-[#9575a3]">Help & Support</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium">
              <div>
                <p className="text-[#B39DDB] mb-1">Email Inquiries</p>
                <p className="font-bold text-[#5A4A61]">support@habib.edu.pk</p>
              </div>
              <div>
                <p className="text-[#B39DDB] mb-1">Emergency Contact</p>
                <p className="font-bold text-[#5A4A61]">+92 21 111 222 333</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for Modal Grid items
function InfoBox({ icon, label, value }) {
  return (
    <div className="border border-[#f3e5f5] bg-[#fdf7fd] rounded-3xl p-5 flex items-start gap-4">
      <div className="p-3 bg-white rounded-2xl shadow-sm">
        <span className="text-[#B39DDB]">{icon}</span>
      </div>
      <div>
        <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9575a3] mb-1">
          {label}
        </span>
        <p className="font-bold text-[#5A4A61]">{value}</p>
      </div>
    </div>
  );
}