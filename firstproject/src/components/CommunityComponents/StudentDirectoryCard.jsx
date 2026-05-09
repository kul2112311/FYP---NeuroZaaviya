import React, { useState } from "react";
import { ChevronUp, ChevronDown, Mail, Calendar, ClipboardList, User, BookOpen, GraduationCap } from "lucide-react";

function StudentDirectoryCard({ student, onSchedule}) {
  const [showDetails, setShowDetails] = useState(false);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const Avatar = ({ sizeCls }) => {
    const hasAvatar = student.avatar && student.avatar.trim() !== "" && !student.avatar.includes("placeholder");

    return hasAvatar ? (
      <img
        src={student.avatar}
        alt={student.name}
        className={`${sizeCls} rounded-full object-cover shadow-sm`}
      />
    ) : (
      <div className={`${sizeCls} rounded-full bg-[#B39DDB]/20 flex items-center justify-center shadow-sm border-2 border-[#B39DDB]/30`}>
        <span className="text-[#5A4A61] font-bold text-xl">
          {getInitial(student.name)}
        </span>
      </div>
    );
  };

  if (showDetails) {
    return (
      <div className="bg-white rounded-[2rem] p-8 mb-4 border border-gray-100 shadow-sm transition-all">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
          <Avatar sizeCls="w-16 h-16" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#5A4A61]">{student.name}</h3>
            <p className="text-[#B39DDB] text-sm font-medium">{student.email}</p>
            <p className="text-gray-400 text-sm">
              ID: {student.id} • {student.year}
            </p>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="flex items-center gap-2 bg-[#B39DDB] hover:bg-[#9575CD] text-white px-4 py-2 rounded-full transition-colors text-sm font-bold shadow-sm"
          >
            <ChevronUp size={18} />
            Details
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="flex items-center gap-2 text-[#5A4A61] font-bold mb-4">
              <User size={18} className="text-[#e91e8c]" /> Contact Information
            </h4>
            <div className="space-y-4">
              <InfoField label="Email" value={student.email} />
              <InfoField label="Phone" value={student.phone || "+92 300 5678901"} />
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-[#5A4A61] font-bold mb-4">
              <BookOpen size={18} className="text-[#e91e8c]" /> Academic Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Major" value={student.major} />
              <InfoField label="Batch Year" value={student.batch} />
              <InfoField label="Year" value={student.year} />
              <InfoField label="Enrolled" value="Sep 2024" />
            </div>
          </div>
        </div>

        {/* Advisor */}
        <div className="mb-8 pt-6 border-t border-gray-100">
          <h4 className="flex items-center gap-2 text-[#5A4A61] font-bold mb-2">
            <GraduationCap size={18} className="text-[#e91e8c]" /> OAP Advisor
          </h4>
          <p className="text-[#5A4A61] opacity-80 font-medium">{student.advisor}</p>
        </div>

        {/* Actions - Using #B39DDB */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ActionButton icon={<Mail size={18} />} label="Send Email" />
          {/* ✨ Passed the onSchedule prop into the onClick handler! */}
          <ActionButton icon={<Calendar size={18} />} label="Schedule" onClick={onSchedule} />
          <ActionButton icon={<ClipboardList size={18} />} label="Records" />
        </div>
      </div>
    );
  }

  // Collapsed View
  return (
    <div className="bg-white rounded-[2rem] px-8 py-6 mb-4 flex flex-row items-center gap-6 justify-between border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <Avatar sizeCls="w-16 h-16 flex-shrink-0" />
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-[#5A4A61] leading-tight">{student.name}</h3>
            <Badge type="major">{student.major}</Badge>
            <Badge type="batch">
              {student.batch.includes("Batch") ? student.batch : `Batch ${student.batch}`}
            </Badge>
            {student.accommodations > 0 && (
              <Badge type="acc">{student.accommodations} accommodation</Badge>
            )}
          </div>
          <p className="text-[#B39DDB] text-sm font-semibold mb-0.5">{student.email}</p>
          <p className="text-gray-400 text-sm font-medium">
            ID: {student.id} • {student.year}
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowDetails(true)}
        className="flex items-center gap-2 bg-[#B39DDB] hover:bg-[#9575CD] text-white px-5 py-2.5 rounded-full transition-all text-sm font-bold shadow-md active:scale-95"
      >
        <ChevronDown size={18} />
        Details
      </button>
    </div>
  );
}

// --- Internal Helper Components ---

function Badge({ children, type }) {
  const styles = {
    major: "bg-[#7e57c2]/10 text-[#5A4A61]",
    batch: "bg-[#B39DDB]/50 text-[#5A4A61]",
    acc: "bg-[#5e35b1]/10 text-[#5e35b1]",
  };
  
  return (
    <span className={`${styles[type]} text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
      {children}
    </span>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-[#c2185b] text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-[#5A4A61] font-bold">{value}</p>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 bg-[#B39DDB] hover:bg-[#9575CD] text-white px-4 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm active:transform active:scale-95"
    >
      <span>{icon}</span> {label}
    </button>
  );
}

export default StudentDirectoryCard;