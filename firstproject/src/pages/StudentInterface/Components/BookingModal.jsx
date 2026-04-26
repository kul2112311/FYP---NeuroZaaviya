// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Heart, Mail, X } from 'lucide-react';

// function BookingModal({ peer, onClose, onConfirm, isOpen }) {  // ADD isOpen prop
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch availability when modal opens OR peer changes
//   useEffect(() => {
//     const fetchAvailability = async () => {
//       setIsLoading(true);
//       setSelectedSlot(null); // Clear previous selection
      
//       try {
//         const response = await fetch(`http://localhost:5000/api/peer-availability/${peer.id}`);
//         const data = await response.json();
        
//         console.log('Raw Data from Backend:', data);
//         console.log('Booked Slots:', data.bookedSlots);
        
//         const generatedSlots = generateSlotsFromDB(data.schedule, data.bookedSlots);
        
//         console.log('Available Slots After Filtering:', generatedSlots);
        
//         setTimeSlots(generatedSlots);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching availability:", error);
//         setIsLoading(false);
//       }
//     };

//     // Fetch whenever modal opens (isOpen changes to true) OR peer changes
//     if (peer?.id && isOpen) {
//       fetchAvailability();
//     }
//   }, [peer?.id, isOpen]); // ← Changed dependency

//   // Helper: Generate slots and remove booked ones
//   const generateSlotsFromDB = (availabilityData, bookedSlots = []) => {
//     const slots = [];
//     let idCounter = 1;

//     availabilityData.forEach((schedule) => {
//       // 1. Find the next date for this day of week (0=Sun, 1=Mon...)
//       const nextDate = getNextDayOfWeek(schedule.day_of_week);
//       const dateString = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

//       // 2. Format date as YYYY-MM-DD using LOCAL time (not UTC)
//       const year = nextDate.getFullYear();
//       const month = String(nextDate.getMonth() + 1).padStart(2, '0');
//       const day = String(nextDate.getDate()).padStart(2, '0');
//       const dateKey = `${year}-${month}-${day}`;
      
//       console.log(`📍 Processing schedule: Day ${schedule.day_of_week} -> ${dateKey} (${dateString})`);

//       // 3. Clean 24h Time string (e.g. "14:00:00" -> "14:00")
//       const time24 = schedule.start_time.substring(0, 5);

//       // 4. CHECK IF BOOKED
//       const isBooked = bookedSlots.some(booking => {
//           // Backend now returns clean strings: "2025-12-18" and "13:00"
//           const bookingDate = booking.scheduled_date;
//           const bookingTime = booking.start_time;
          
//           // DEBUG: Log every comparison
//           console.log(`Comparing Slot: ${dateKey} ${time24} vs Booked: ${bookingDate} ${bookingTime}`);
          
//           const matches = bookingDate === dateKey && bookingTime === time24;
//           if (matches) {
//             console.log(`MATCH FOUND! Filtering out this slot`);
//           }
          
//           return matches;
//       });

//       // 5. If not booked, add to list
//       if (!isBooked) {
//         slots.push({
//           id: idCounter++,
//           day: dateString,
//           time: formatTime(time24), // UI: "2:00 PM"
//           rawDate: nextDate,
//           time24h: time24 // DB: "14:00" (Send this cleanly to backend)
//         });
//       }
//     });

//     // Sort by date so they appear in order
//     return slots.sort((a, b) => a.rawDate - b.rawDate);
//   };

//   // Helper: Get next occurrence of a day (e.g., Next Monday)
//   const getNextDayOfWeek = (dayIndex) => {
//     const today = new Date();
//     // Reset time to midnight to avoid timezone issues
//     today.setHours(0, 0, 0, 0);
    
//     const currentDay = today.getDay();
//     let daysUntil = dayIndex - currentDay;
    
//     if (daysUntil <= 0) {
//       daysUntil += 7; // Move to next week
//     }
    
//     const nextDate = new Date(today);
//     nextDate.setDate(today.getDate() + daysUntil);
    
//     console.log(`Generated date for day ${dayIndex}: ${nextDate.toISOString()} | Local: ${nextDate.toLocaleDateString()}`);
    
//     return nextDate;
//   };

//   // Helper: "14:00" -> "2:00 PM"
//   const formatTime = (timeStr) => {
//     if (!timeStr) return "";
//     const [hours, minutes] = timeStr.split(':');
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
//   };

//   const handleConfirm = () => {
//     if (selectedSlot) {
//       onConfirm(selectedSlot);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>
//           <X size={20} />
//         </button>
        
//         <div className="modal-icon">
//           <Heart size={32} color="white" />
//         </div>
        
//         <h2 className="modal-title">Book a Session</h2>
//         <p className="modal-subtitle">Select a time slot with {peer.name}</p>
        
//         <div className="modal-time-slots">
//           <h4 className="modal-slots-title">Available Time Slots</h4>
          
//           {isLoading ? (
//             <p style={{ textAlign: 'center', color: '#666' }}>Checking availability...</p>
//           ) : timeSlots.length === 0 ? (
//             <p style={{ textAlign: 'center', color: '#666' }}>No slots available this week.</p>
//           ) : (
//             <div className="modal-slots-grid">
//               {timeSlots.map(slot => (
//                 <button 
//                   key={slot.id} 
//                   className={`modal-slot-button ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
//                   onClick={() => setSelectedSlot(slot)}
//                 >
//                   <div className="slot-day">
//                     <Calendar size={14} style={{ marginRight: '6px' }} />
//                     {slot.day}
//                   </div>
//                   <div className="slot-time">
//                     <Clock size={14} style={{ marginRight: '6px' }} />
//                     {slot.time}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {selectedSlot && (
//           <div className="booking-summary">
//             <h4 className="summary-title">Booking Summary</h4>
//             <div className="booking-details">
//               <div className="detail-row">
//                 <span className="detail-label">Focus Peer:</span>
//                 <span className="detail-value">{peer.name}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Date:</span>
//                 <span className="detail-value">{selectedSlot.day}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Time:</span>
//                 <span className="detail-value">{selectedSlot.time}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Duration:</span>
//                 <span className="detail-value">1 hour</span>
//               </div>
//             </div>
            
//             <div className="confirmation-note">
//               <Mail size={16} />
//               <p>A confirmation email will be sent to both you and your FocusPeer. This date will also appear on your calendar.</p>
//             </div>
//           </div>
//         )}
        
//         <div className="modal-actions">
//           <button className="btn-cancel" onClick={onClose}>Cancel</button>
//           <button 
//             className="btn-confirm" 
//             onClick={handleConfirm}
//             disabled={!selectedSlot}
//           >
//             Confirm Booking
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BookingModal;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, Mail, X, Check, Star, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Shared slot helpers (reused by both modals) ─────────────────────────────

const getNextDayOfWeek = (dayIndex) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay();
  let daysUntil = dayIndex - currentDay;
  if (daysUntil <= 0) daysUntil += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  return nextDate;
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const generateSlotsFromDB = (availabilityData = [], bookedSlots = []) => {
  const slots = [];
  let idCounter = 1;

  availabilityData.forEach((schedule) => {
    const nextDate   = getNextDayOfWeek(schedule.day_of_week);
    const dateString = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const year       = nextDate.getFullYear();
    const month      = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day        = String(nextDate.getDate()).padStart(2, '0');
    const dateKey    = `${year}-${month}-${day}`;
    const time24     = schedule.start_time.substring(0, 5);

    const isBooked = bookedSlots.some(b => b.scheduled_date === dateKey && b.start_time === time24);

    if (!isBooked) {
      slots.push({
        id:      idCounter++,
        day:     dateString,
        time:    formatTime(time24),
        rawDate: nextDate,
        time24h: time24,
      });
    }
  });

  return slots.sort((a, b) => a.rawDate - b.rawDate);
};

// ─── PeerSlots — fetches + renders availability for one peer ─────────────────

function PeerSlots({ peerId }) {
  const [slots, setSlots]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(false);
      try {
        const res  = await fetch(`http://localhost:5000/api/peer-availability/${peerId}`);
        const data = await res.json();
        setSlots(generateSlotsFromDB(data.schedule, data.bookedSlots));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [peerId]);

  if (loading) return (
    <p className="text-xs text-center py-2" style={{ color: "#9575a3" }}>Loading slots…</p>
  );
  if (error) return (
    <p className="text-xs text-center py-2" style={{ color: "#ef4444" }}>Could not load availability.</p>
  );
  if (slots.length === 0) return (
    <p className="text-xs text-center py-2" style={{ color: "#c0b4cc" }}>No available slots this week.</p>
  );

  return (
    <div className="flex flex-wrap gap-1.5 pt-2">
      {slots.map(slot => (
        <span
          key={slot.id}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg"
          style={{ background: "rgba(179,157,219,0.12)", border: "1px solid #d8cfe0", color: "#5a4a61" }}
        >
          <Calendar size={10} style={{ color: "#b39ddb", flexShrink: 0 }} />
          {slot.day}
          <Clock size={10} style={{ color: "#b39ddb", flexShrink: 0, marginLeft: 2 }} />
          {slot.time}
        </span>
      ))}
    </div>
  );
}

// ─── SelectPeersModal ────────────────────────────────────────────────────────

const MAX_PEERS = 3;

export function SelectPeersModal({ isOpen, onClose, onConfirm, allPeers = [], currentPeerIds = [] }) {
  const [selected, setSelected]     = useState(new Set(currentPeerIds));
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setSelected(new Set(currentPeerIds));
    setExpandedId(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_PEERS) {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleConfirm = () => {
    const chosenPeers = allPeers.filter(p => selected.has(p.id));
    onConfirm(chosenPeers);
    onClose();
  };

  const count = selected.size;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(90,74,97,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white flex flex-col overflow-hidden"
        style={{ width: 780, maxHeight: "88vh", borderRadius: 24 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-7 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center"
              style={{ background: "rgba(179,157,219,0.15)", borderRadius: 16 }}>
              <Heart size={22} style={{ color: "#b39ddb" }} />
            </div>
            <div>
              <h2 className="m-0 font-semibold text-lg" style={{ color: "#5a4a61" }}>
                Select Your FocusPeers
              </h2>
              <p className="m-0 text-sm mt-1" style={{ color: "#9575a3" }}>
                Choose up to {MAX_PEERS} FocusPeers to support you on your journey
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center"
            style={{ background: "rgba(179,157,219,0.12)", border: "none", borderRadius: "50%", cursor: "pointer", color: "#9575a3" }}>
            <X size={16} />
          </button>
        </div>

        {/* Selection indicator */}
        <div className="mx-8 mb-5 px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(179,157,219,0.08)", border: "1px solid #d8cfe0", borderRadius: 16 }}>
          <span className="text-sm font-medium" style={{ color: "#5a4a61" }}>
            Selected: {count} / {MAX_PEERS}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: MAX_PEERS }).map((_, i) => (
              <span key={i} className="w-3 h-3 rounded-full transition-all"
                style={{ background: i < count ? "#b39ddb" : "#d8cfe0" }} />
            ))}
          </div>
        </div>

        {/* Peers grid — scrollable */}
        <div className="overflow-y-auto px-8 pb-6"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#d8cfe0 transparent" }}>
          <div className="grid grid-cols-2 gap-4">
            {allPeers.map(peer => {
              const isSelected = selected.has(peer.id);
              // ✨ 1. Check if the peer is already owned by the student
              const isAlreadyOwned = currentPeerIds.includes(peer.id);
              // ✨ 2. Disable clicking if max is reached OR if already owned
              const isDisabled = (!isSelected && count >= MAX_PEERS) || isAlreadyOwned;
              const isExpanded = expandedId === peer.id;

              return (
                <div
                  key={peer.id}
                  className="flex flex-col transition-all"
                  style={{
                    background:   isSelected ? "rgba(179,157,219,0.08)" : "#fff",
                    border:       isSelected ? "1.5px solid #b39ddb" : "1.5px solid #e8e0f0",
                    borderRadius: 16,
                    opacity:      isDisabled ? 0.45 : 1,
                  }}
                >
                  {/* Select row */}
                  <button
                    onClick={() => !isDisabled && toggle(peer.id)}
                    disabled={isDisabled}
                    className="text-left flex items-start gap-4 p-4"
                    style={{ background: "transparent", border: "none", cursor: isDisabled ? "not-allowed" : "pointer", outline: "none", borderRadius: "16px 16px 0 0" }}
                  >
                    <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold overflow-hidden"
                      style={{ background: "rgba(179,157,219,0.2)", color: "#5a4a61" }}>
                      {peer.avatar
                        ? <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" />
                        : peer.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm truncate" style={{ color: "#5a4a61" }}>
                          {peer.name}
                        </span>
                        {isAlreadyOwned ? (
                          // ✨ Shows a nice badge if they already own this peer
                          <span style={{ fontSize: '10px', color: '#9575a3', fontWeight: 'bold', background: 'rgba(179,157,219,0.15)', padding: '4px 8px', borderRadius: '6px' }}>
                            Already Added
                          </span>
                        ) : isSelected && (
                          <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "#b39ddb" }}>
                            <Check size={11} color="#fff" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5 mb-1" style={{ color: "#9575a3" }}>
                        {peer.specialty}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        <span className="text-xs font-medium" style={{ color: "#5a4a61" }}>
                          {peer.rating?.toFixed(1)}
                        </span>
                      </div>
                      {peer.bio && (
                        <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: "#c0b4cc" }}>
                          {peer.bio}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* View slots toggle button */}
                  <button
                    onClick={(e) => toggleExpand(e, peer.id)}
                    className="flex items-center justify-between px-4 py-2 text-xs font-medium w-full transition-colors"
                    style={{
                      background:   isExpanded ? "rgba(179,157,219,0.06)" : "transparent",
                      border:       "none",
                      borderTop:    "1px solid #e8e0f0",
                      borderRadius: isExpanded ? 0 : "0 0 14px 14px",
                      color:        "#9575a3",
                      cursor:       "pointer",
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} style={{ color: "#b39ddb" }} />
                      View available slots
                    </span>
                    {isExpanded
                      ? <ChevronUp size={13} style={{ color: "#b39ddb" }} />
                      : <ChevronDown size={13} style={{ color: "#b39ddb" }} />}
                  </button>

                  {/* Slots panel — only mounts when expanded so fetch fires on demand */}
                  {isExpanded && (
                    <div className="px-4 pb-4"
                      style={{ borderTop: "1px solid #e8e0f0", borderRadius: "0 0 14px 14px" }}>
                      <PeerSlots peerId={peer.id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex items-center justify-between"
          style={{ borderTop: "1px solid #e8e0f0" }}>
          <p className="text-xs m-0" style={{ color: "#9575a3" }}>
            These peers will support you for the entire academic year.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium"
              style={{ background: "transparent", border: "1px solid #d8cfe0", borderRadius: 12, color: "#9575a3", cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={count === 0}
              className="px-5 py-2.5 text-sm font-medium"
              style={{
                background: count > 0 ? "#b39ddb" : "#d8cfe0",
                border: "none", borderRadius: 12,
                color: "#fff",
                cursor: count > 0 ? "pointer" : "not-allowed",
              }}>
              Confirm {count > 0 ? `(${count})` : ""} FocusPeer{count !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BookingModal ────────────────────────────────────────────────────────────

function BookingModal({ peer, onClose, onConfirm, isOpen }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots]       = useState([]);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      setSelectedSlot(null);
      try {
        const response = await fetch(`http://localhost:5000/api/peer-availability/${peer.id}`);
        const data     = await response.json();
        console.log('Raw Data from Backend:', data);
        console.log('Booked Slots:', data.bookedSlots);
        const generatedSlots = generateSlotsFromDB(data.schedule, data.bookedSlots);
        console.log('Available Slots After Filtering:', generatedSlots);
        setTimeSlots(generatedSlots);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (peer?.id && isOpen) fetchAvailability();
  }, [peer?.id, isOpen]);

  const handleConfirm = () => {
    if (selectedSlot) onConfirm(selectedSlot);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-icon">
          <Heart size={32} color="white" />
        </div>

        <h2 className="modal-title">Book a Session</h2>
        <p className="modal-subtitle">Select a time slot with {peer.name}</p>

        <div className="modal-time-slots">
          <h4 className="modal-slots-title">Available Time Slots</h4>

          {isLoading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Checking availability...</p>
          ) : timeSlots.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No slots available this week.</p>
          ) : (
            <div className="modal-slots-grid">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  className={`modal-slot-button ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className="slot-day">
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    {slot.day}
                  </div>
                  <div className="slot-time">
                    <Clock size={14} style={{ marginRight: '6px' }} />
                    {slot.time}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedSlot && (
          <div className="booking-summary">
            <h4 className="summary-title">Booking Summary</h4>
            <div className="booking-details">
              <div className="detail-row">
                <span className="detail-label">Focus Peer:</span>
                <span className="detail-value">{peer.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{selectedSlot.day}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{selectedSlot.time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">1 hour</span>
              </div>
            </div>

            <div className="confirmation-note">
              <Mail size={16} />
              <p>A confirmation email will be sent to both you and your FocusPeer. This date will also appear on your calendar.</p>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={handleConfirm} disabled={!selectedSlot}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;