import React from "react";
import { MapPin, Clock, Mail } from "lucide-react";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  purple800: "#5a4a61",
  purple600: "#9575a3",
  purple500: "#b39ddb",
  purple400: "#c0b4cc",
  purple300: "#d8cfe0",
  purple200: "#e8e0f0",
  purple100: "rgba(179,157,219,0.15)",
  purple50:  "rgba(179,157,219,0.08)",
  pink:      "#f8bbd0",
  pinkText:  "#c0608a",
  teal:      "#6b9e9a",
  tealBg:    "rgba(107,158,154,0.1)",
  ehsas:     "#9b7fbd",
  ehsasBg:   "rgba(155,127,189,0.1)",
  green:     "#22c55e",
  greenBg:   "rgba(34,197,94,0.1)",
  red:       "#ef4444",
  redBg:     "rgba(239,68,68,0.06)",
  amber:     "#f59e0b",
  amberBg:   "rgba(245,158,11,0.1)",
  white:     "#FFFFFF",
  pageBg:    "#f5eef8",
};

// availability → { label, color, bg, dot }
const AVAIL_CONFIG = {
  available: { label: "Available Now",  color: C.green, bg: C.greenBg, dot: C.green  },
  meeting:   { label: "In a Meeting",   color: C.amber, bg: C.amberBg, dot: C.amber  },
  away:      { label: "Away",           color: C.purple600, bg: C.purple100, dot: C.purple400 },
  unavailable:{ label: "I'm Not Available", color: C.red, bg: C.redBg, dot: C.red  },
};

function AvailabilityBadge({ status }) {
  const cfg = AVAIL_CONFIG[status] || AVAIL_CONFIG.away;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: cfg.bg,
      border: `1px solid ${cfg.color}33`,
      borderRadius: 10,
      padding: "7px 14px",
      marginBottom: 14,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: cfg.color, flexShrink: 0,
        boxShadow: `0 0 0 3px ${cfg.color}22`,
      }} />
      <span style={{ fontSize: 13, fontWeight: 500, color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

const SupportStaffCard = ({ staff, onViewProfile }) => {
  const StaffIcon = staff.icon;
  const avail = staff.availability_status || "available";

  return (
    <div style={{
      background: C.white,
      borderRadius: 18,
      border: `1.5px solid ${staff.bgColor}`,
      padding: 22,
      display: "flex",
      flexDirection: "column",
      gap: 0,
      transition: "box-shadow 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px ${staff.bgColor}55`}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Top row: avatar + name + icon */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Avatar circle */}
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: `${staff.bgColor}30`,
            border: `2px solid ${staff.bgColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, color: C.purple800,
          }}>
            {StaffIcon && <StaffIcon size={26} />}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: C.purple800 }}>{staff.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.purple600, fontWeight: 500 }}>{staff.role}</p>
            <p style={{ margin: "1px 0 0", fontSize: 11, color: C.purple400 }}>{staff.department}</p>
          </div>
        </div>
        {/* Right icon */}
        <div style={{ color: C.purple400, paddingTop: 2 }}>
          {StaffIcon && <StaffIcon size={18} />}
        </div>
      </div>

      {/* Availability */}
      <AvailabilityBadge status={avail} />

      {/* Info rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Mail size={14} style={{ color: C.purple500, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.purple700 }}>{staff.email}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MapPin size={14} style={{ color: C.purple500, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.purple800 }}>{staff.location}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={14} style={{ color: C.purple500, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.purple800 }}>{staff.availability}</span>
        </div>
      </div>

      {/* Batch pills */}
      {staff.batches && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {staff.batches.map(b => (
            <span key={b} style={{
              fontSize: 11, fontWeight: 500,
              background: `${staff.bgColor}25`,
              border: `1px solid ${staff.bgColor}`,
              color: C.purple800,
              borderRadius: 20, padding: "2px 10px",
            }}>
              {b}
            </span>
          ))}
        </div>
      )}

      {/* View profile link */}
      <button
        onClick={() => onViewProfile(staff)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, color: C.purple600, fontWeight: 500,
          textAlign: "left", padding: 0, textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        Click to view full profile →
      </button>
    </div>
  );
};

export default SupportStaffCard;

// import React from "react";
// import { MapPin, Clock, ChevronRight } from "lucide-react";

// const SupportStaffCard = ({ staff, onViewProfile }) => {
//   // We extract the icon component from staff data
//   const StaffIcon = staff.icon;

//   return (
//     <div 
//       className="rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-md flex flex-col h-full bg-white"
//       style={{ borderColor: staff.bgColor }}
//     >
//       <div className="p-6 flex flex-col h-full">
//         <div className="flex items-center gap-4 mb-6">
          
//           {/* Icon Circle Replacement for Profile Picture */}
//           <div 
//             className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2"
//             style={{ 
//               backgroundColor: `${staff.bgColor}30`, // Light version of theme color
//               borderColor: staff.bgColor,
//               color: '#5A4A61' 
//             }}
//           >
//             {StaffIcon ? <StaffIcon size={32} /> : <User size={32} />}
//           </div>

//           <div className="flex-grow">
//             <h3 className="text-xl font-bold" style={{ color: '#5A4A61' }}>
//               {staff.name}
//             </h3>
//             <p className="text-sm font-semibold uppercase tracking-wide opacity-80" style={{ color: '#CE93D8' }}>
//               {staff.role}
//             </p>
//           </div>
//         </div>

//         {/* Info Section */}
//         <div className="space-y-3 mb-6 flex-grow">
//           <div className="flex items-start gap-3 text-sm" style={{ color: '#5A4A61' }}>
//             <MapPin size={18} style={{ color: '#B3DDB9' }} className="mt-0.5 flex-shrink-0" />
//             <span>{staff.location}</span>
//           </div>
//           <div className="flex items-start gap-3 text-sm" style={{ color: '#5A4A61' }}>
//             <Clock size={18} style={{ color: '#B3DDB9' }} className="mt-0.5 flex-shrink-0" />
//             <span>{staff.availability}</span>
//           </div>
//         </div>

//         {/* Action Button */}
//         <button
//           onClick={() => onViewProfile(staff)}
//           className="group w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-b-4 hover:brightness-95 active:border-b-0 active:translate-y-[2px]"
//           style={{ 
//             backgroundColor: staff.bgColor, 
//             color: '#5A4A61',
//             borderColor: 'rgba(0,0,0,0.1)' 
//           }}
//         >
//           View Profile
//           <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SupportStaffCard;

