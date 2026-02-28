import React from "react";
import { Clock, Calendar, CheckCircle } from "lucide-react";

function CheckInCard({ checkin }) {
  // Format the date/time from the database
  const dateObj = new Date(checkin.date);
  const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const displayTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Generate initials for the Peer
  const initials = checkin.peerName
    ? checkin.peerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "FP";

  return (
    <div className="bg-white rounded-[20px] shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-100 flex flex-col h-full group">
      <div className="flex flex-1">
        {/* Decorative Side Accent */}
        <div className="w-1.5 bg-[#B39DDB] group-hover:bg-purple-600 transition-colors"></div>
        
        <div className="flex-1 p-5 flex flex-col">
          {/* Label & Status */}
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-bold text-[#B39DDB] uppercase tracking-wider">
              Focus Peer Check-in
            </p>
            {checkin.status === 'pending' && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                 Pending
              </span>
            )}
          </div>

          {/* Peer Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-purple-500 shadow-sm">
              {initials}
            </div>
            <div>
               <span className="text-sm font-bold text-gray-800 block">{checkin.peerName}</span>
               <span className="text-[10px] text-gray-400">Assigned Peer</span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-[#5A4A61] mb-2 leading-tight">
            {checkin.title}
          </h3>

          <p className="text-gray-500 text-xs mb-5 leading-relaxed flex-1">
            {checkin.description}
          </p>

          {/* Date & Time Footer */}
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#B39DDB]" />
              <span className="text-xs font-medium">{displayDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#B39DDB]" />
              <span className="text-xs font-medium">{displayTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckInCard;