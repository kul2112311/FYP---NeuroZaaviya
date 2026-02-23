import { Calendar, Clock, MapPin, Users, Eye, Info, Tag, X } from 'lucide-react';

export function EventCard({ event, onViewDetails, isAdmin }) {
  // Logic to calculate days remaining if not explicitly provided
  const calculateDays = (dateStr) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = event.daysUntil ?? calculateDays(event.date);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Tag + Days */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-[#B39DDB]/10 text-[#5A4A61] px-3 py-1 rounded-full text-sm font-bold">
          {event.tag}
        </span>
        <span className="text-[#5A4A61] font-semibold text-xs bg-pink-50 px-2 py-1 rounded-lg">
          {daysLeft === 0 ? "Today" : `In ${daysLeft} days`}
        </span>
      </div>

      {/* Event Title */}
      <h3 className="text-lg font-bold text-[#5A4A61] mb-2">{event.title}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#B39DDB]" />
          {event.date}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#B39DDB]" />
          {event.time}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#B39DDB]" />
          {event.location}
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1 text-xs font-bold text-gray-400 uppercase">
          <span>Capacity</span>
          <span>{Math.round((event.attendees / event.capacity) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full">
          <div 
            className="bg-[#B39DDB] h-1.5 rounded-full" 
            style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
          ></div>
        </div>
      </div>

      <button 
        onClick={onViewDetails}
        className="w-full bg-[#B39DDB] text-white py-2.5 rounded-full font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Container: Rounded-l only, sharp right corners */}
      <div className="bg-white rounded-l-[3rem] rounded-r-none w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-8 top-8 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
          <X size={28} className="text-[#5A4A61]" />
        </button>

        <div className="p-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#B39DDB]/20 text-[#5A4A61] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {event.tag}
            </span>
          </div>
          
          {/* Header remains Bold */}
          <h2 className="text-4xl font-black text-[#5A4A61] mb-2 leading-tight">{event.title}</h2>
          <p className="text-[#B39DDB] font-medium mb-10">OAP Counseling & Events Division</p>

          {/* Info Grid - Updated to Light #B39DDB Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <InfoBox icon={<Calendar />} label="Date" value={event.date} />
            <InfoBox icon={<Clock />} label="Time" value={event.time} />
            <InfoBox icon={<MapPin />} label="Location" value={event.location} />
            <InfoBox 
              icon={<Users />} 
              label="Capacity" 
              value={`${event.attendees} / ${event.capacity} Registered`} 
              showProgress 
              percent={(event.attendees / event.capacity) * 100} 
            />
          </div>

          {/* Requirements Section - Labels are bold, content is regular */}
          <div className="mb-8">
            <h3 className="text-[#5A4A61] font-bold text-lg mb-3 flex items-center gap-2">
              <Info size={20} className="text-[#e91e8c]" /> Requirements
            </h3>
            <div className="bg-[#B39DDB]/10 border border-[#B39DDB]/20 rounded-2xl p-5 text-[#5A4A61] font-normal">
              {event.requirements || "No specific requirements for this event."}
            </div>
          </div>

          {/* Description - Regular weight */}
          <div className="mb-10">
            <h3 className="text-[#5A4A61] font-bold text-lg mb-3">Event Overview</h3>
            <p className="text-gray-600 leading-relaxed text-lg font-normal">
              {event.description}
            </p>
          </div>

          {/* Footer Contact */}
          <div className="bg-[#E1BEE7]/40 rounded-3xl p-8 text-[#5A4A61]">
            <h3 className="font-bold mb-4  uppercase tracking-widest text-xs">Help & Support</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-normal">
              <div>
                <p className="opacity-60">Email Inquiries</p>
                <p className="font-semibold text-[#5A4A61]">support@university.edu</p>
              </div>
              <div>
                <p className="opacity-60">Emergency Contact</p>
                <p className="font-semibold text-[#5A4A61]">+92 21 111 222 333</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for Modal Grid items
function InfoBox({ icon, label, value, showProgress, percent }) {
  return (
    <div className="border border-[#B39DDB]/20 bg-[#B39DDB]/5 rounded-3xl p-5">
      <div className="flex items-center gap-2 text-[#B39DDB] mb-2">
        {icon}
        {/* Label remains bold for hierarchy */}
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</span>
      </div>
      {/* Value is now regular weight */}
      <p className="font-normal text-[#5A4A61]">{value}</p>
      {showProgress && (
        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
          <div className="bg-[#B39DDB] h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
        </div>
      )}
    </div>
  );
}