import React from "react";
import { MapPin, Clock, ChevronRight } from "lucide-react";

const SupportStaffCard = ({ staff, onViewProfile }) => {
  // We extract the icon component from staff data
  const StaffIcon = staff.icon;

  return (
    <div 
      className="rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-md flex flex-col h-full bg-white"
      style={{ borderColor: staff.bgColor }}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          
          {/* Icon Circle Replacement for Profile Picture */}
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2"
            style={{ 
              backgroundColor: `${staff.bgColor}30`, // Light version of theme color
              borderColor: staff.bgColor,
              color: '#5A4A61' 
            }}
          >
            {StaffIcon ? <StaffIcon size={32} /> : <User size={32} />}
          </div>

          <div className="flex-grow">
            <h3 className="text-xl font-bold" style={{ color: '#5A4A61' }}>
              {staff.name}
            </h3>
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80" style={{ color: '#CE93D8' }}>
              {staff.role}
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-start gap-3 text-sm" style={{ color: '#5A4A61' }}>
            <MapPin size={18} style={{ color: '#B3DDB9' }} className="mt-0.5 flex-shrink-0" />
            <span>{staff.location}</span>
          </div>
          <div className="flex items-start gap-3 text-sm" style={{ color: '#5A4A61' }}>
            <Clock size={18} style={{ color: '#B3DDB9' }} className="mt-0.5 flex-shrink-0" />
            <span>{staff.availability}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewProfile(staff)}
          className="group w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-b-4 hover:brightness-95 active:border-b-0 active:translate-y-[2px]"
          style={{ 
            backgroundColor: staff.bgColor, 
            color: '#5A4A61',
            borderColor: 'rgba(0,0,0,0.1)' 
          }}
        >
          View Profile
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default SupportStaffCard;