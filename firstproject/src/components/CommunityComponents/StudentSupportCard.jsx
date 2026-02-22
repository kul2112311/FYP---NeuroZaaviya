import React, { useState } from "react"; // Added useState
import { Mail, MapPin, Clock, Heart, User } from "lucide-react"; // Added User icon

function SupportStaffCard({ staff, onViewProfile }) {
  // Add state to track if the image fails to load
  const [imageError, setImageError] = useState(false);

  // Check if the URL is the specific placeholder that usually breaks
  const isPlaceholder = staff.image?.includes("via.placeholder.com");

  return (
    <div className={`rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${staff.bgColor}`}>
      {/* Header with Icon */}
      <div className="flex justify-between items-start mb-4">
        <div></div>
        <button className="text-gray-400 hover:text-red-500 transition">
          <Heart size={20} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        {/* Updated Image Container with Fallback logic */}
        <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {!imageError && !isPlaceholder ? (
            <img 
              src={staff.image} 
              alt={staff.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)} 
            />
          ) : (
            <User size={32} className="text-gray-400" />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">{staff.name}</h3>
          <p className="text-sm text-gray-600">{staff.role}</p>
          <p className="text-xs text-gray-500">{staff.department}</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail size={16} />
          <span className="text-xs">{staff.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span className="text-xs">{staff.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={16} />
          <span className="text-xs">{staff.availability}</span>
        </div>
      </div>

      {/* Batch Years */}
      <div className="flex gap-2 flex-wrap mb-6">
        {staff.batches.map((batch, idx) => (
          <span key={idx} className="text-xs bg-white/50 text-gray-600 px-3 py-1 rounded-full">
            {batch}
          </span>
        ))}
      </div>

      {/* View Profile Link */}
      <button 
        onClick={() => onViewProfile(staff)}
        className="text-xs text-gray-500 hover:text-gray-700 transition font-medium underline underline-offset-4"
      >
        Click to view full profile →
      </button>
    </div>
  );
}

export default SupportStaffCard;