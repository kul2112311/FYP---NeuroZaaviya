import React from "react";
import { Clock } from "lucide-react";

function CheckInCard({ checkin }) {
  return (
    // Changed rounded-lg to rounded-[20px] and reduced shadow/padding
    <div className="bg-white rounded-[20px] shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex">
        {/* Slightly thinner left border line */}
        <div className="w-1 bg-[#B39DDB]"></div>
        
        {/* Reduced padding from p-6 to p-4 */}
        <div className="flex-1 p-4">
          {/* Smaller Label */}
          <p className="text-[10px] font-semibold text-[#B39DDB] uppercase tracking-wide mb-2">
            Focus Peer
          </p>

          {/* Peer Info: Reduced avatar size and gap */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
              checkin.avatarColor === "purple" ? "bg-purple-500" :
              checkin.avatarColor === "blue" ? "bg-blue-500" :
              "bg-gray-500"
            }`}>
              {checkin.initials}
            </div>
            <span className="text-sm font-semibold text-gray-800">{checkin.peerName}</span>
          </div>

          {/* Title: Reduced from text-lg to text-base */}
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {checkin.title}
          </h3>

          {/* Description: Reduced margin */}
          <p className="text-[#5A4A61] text-xs mb-3 leading-snug">
            {checkin.description}
          </p>

          {/* Date & Time: Tighter text */}
          <div className="flex items-center gap-1.5 text-[#5A4A61] text-[12px]">
            <Clock size={14} color="#B39DDB" />
            <span>{checkin.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckInCard;