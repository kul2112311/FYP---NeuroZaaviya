import React, { useState, useEffect } from "react";
import { Clock, AlertCircle, Calendar, CheckCircle } from "lucide-react";
import { useUser } from '../../../styles/SignInLandingPage/usercontext.jsx';

// -------------------------------------------------------------
// STUDENT CHECKIN CARD (Consolidated to fix resolution error)
// -------------------------------------------------------------
function CheckInCard({ checkin }) {
  // Format the date/time from the database timestamp
  const dateObj = new Date(checkin.date);
  const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const displayTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Generate initials for the Focus Peer
  const initials = checkin.peerName
    ? checkin.peerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "FP";

  return (
    <div className="bg-white rounded-[20px] shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-100 flex flex-col h-full group">
      <div className="flex flex-1">
        {/* Left Accent Bar */}
        <div className="w-1.5 bg-[#B39DDB] group-hover:bg-purple-600 transition-colors"></div>
        
        <div className="flex-1 p-5 flex flex-col">
          {/* Status Label */}
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

          {/* Peer Details */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-purple-500 shadow-sm">
              {initials}
            </div>
            <div>
               <span className="text-sm font-bold text-gray-800 block">{checkin.peerName}</span>
               <span className="text-[10px] text-gray-400">Your Focus Peer</span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-[#5A4A61] mb-2 leading-tight">
            {checkin.title}
          </h3>

          <p className="text-gray-500 text-xs mb-5 leading-relaxed flex-1">
            {checkin.description}
          </p>

          {/* Footer Info */}
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

// -------------------------------------------------------------
// MAIN CHECKIN LIST COMPONENT
// -------------------------------------------------------------
function CheckIn() {
  const [checkins, setCheckins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded ID for Ushna Batool (Student) to ensure functionality during local dev
  const { user } = useUser();

  useEffect(() => {
    const fetchStudentCheckins = async () => {
      try {
        if (!user || !user.id) return;
        setIsLoading(true);
        // Using 127.0.0.1 to avoid local network routing delays
        const response = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/checkups/student/${user.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to load your upcoming check-ins.");
        }

        const data = await response.json();
        setCheckins(data);
      } catch (err) {
        console.error("Error fetching student check-ins:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentCheckins();
  }, [user]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 px-[20.8px] pt-[20.8px] pb-[20.8px]">
      {/* List Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-purple-500" />
          <h2 className="text-lg font-semibold text-[#B39DDB]">
            Upcoming Check-ins with your Focus Peers
          </h2>
        </div>
        <span className="text-xs font-medium px-3 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
          {checkins.length} Active
        </span>
      </div>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="flex flex-col items-center py-12 gap-3 text-gray-400">
           <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
           <p className="text-sm">Connecting to schedule...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
          <AlertCircle size={18} />
          <p className="text-sm">{error}</p>
        </div>
      ) : checkins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checkins.map((checkin) => (
            <CheckInCard key={checkin.id} checkin={checkin} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
          <p className="text-gray-400 font-medium">No check-ins scheduled right now.</p>
          <p className="text-xs text-gray-300 mt-1">
            Stay tuned! Your Focus Peer will schedule follow-ups here.
          </p>
        </div>
      )}
    </div>
  );
}

export default CheckIn;