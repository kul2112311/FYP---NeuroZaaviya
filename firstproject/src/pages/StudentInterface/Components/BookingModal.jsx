import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, Mail, X } from 'lucide-react';

function BookingModal({ peer, onClose, onConfirm, isOpen }) {  // ADD isOpen prop
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch availability when modal opens OR peer changes
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      setSelectedSlot(null); // Clear previous selection
      
      try {
        const response = await fetch(`http://localhost:5000/api/peer-availability/${peer.id}`);
        const data = await response.json();
        
        console.log('Raw Data from Backend:', data);
        console.log('Booked Slots:', data.bookedSlots);
        
        const generatedSlots = generateSlotsFromDB(data.schedule, data.bookedSlots);
        
        console.log('Available Slots After Filtering:', generatedSlots);
        
        setTimeSlots(generatedSlots);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setIsLoading(false);
      }
    };

    // Fetch whenever modal opens (isOpen changes to true) OR peer changes
    if (peer?.id && isOpen) {
      fetchAvailability();
    }
  }, [peer?.id, isOpen]); // ← Changed dependency

  // Helper: Generate slots and remove booked ones
  const generateSlotsFromDB = (availabilityData, bookedSlots = []) => {
    const slots = [];
    let idCounter = 1;

    availabilityData.forEach((schedule) => {
      // 1. Find the next date for this day of week (0=Sun, 1=Mon...)
      const nextDate = getNextDayOfWeek(schedule.day_of_week);
      const dateString = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      // 2. Format date as YYYY-MM-DD using LOCAL time (not UTC)
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const day = String(nextDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      console.log(`📍 Processing schedule: Day ${schedule.day_of_week} -> ${dateKey} (${dateString})`);

      // 3. Clean 24h Time string (e.g. "14:00:00" -> "14:00")
      const time24 = schedule.start_time.substring(0, 5);

      // 4. CHECK IF BOOKED
      const isBooked = bookedSlots.some(booking => {
          // Backend now returns clean strings: "2025-12-18" and "13:00"
          const bookingDate = booking.scheduled_date;
          const bookingTime = booking.start_time;
          
          // DEBUG: Log every comparison
          console.log(`Comparing Slot: ${dateKey} ${time24} vs Booked: ${bookingDate} ${bookingTime}`);
          
          const matches = bookingDate === dateKey && bookingTime === time24;
          if (matches) {
            console.log(`MATCH FOUND! Filtering out this slot`);
          }
          
          return matches;
      });

      // 5. If not booked, add to list
      if (!isBooked) {
        slots.push({
          id: idCounter++,
          day: dateString,
          time: formatTime(time24), // UI: "2:00 PM"
          rawDate: nextDate,
          time24h: time24 // DB: "14:00" (Send this cleanly to backend)
        });
      }
    });

    // Sort by date so they appear in order
    return slots.sort((a, b) => a.rawDate - b.rawDate);
  };

  // Helper: Get next occurrence of a day (e.g., Next Monday)
  const getNextDayOfWeek = (dayIndex) => {
    const today = new Date();
    // Reset time to midnight to avoid timezone issues
    today.setHours(0, 0, 0, 0);
    
    const currentDay = today.getDay();
    let daysUntil = dayIndex - currentDay;
    
    if (daysUntil <= 0) {
      daysUntil += 7; // Move to next week
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    
    console.log(`Generated date for day ${dayIndex}: ${nextDate.toISOString()} | Local: ${nextDate.toLocaleDateString()}`);
    
    return nextDate;
  };

  // Helper: "14:00" -> "2:00 PM"
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirm(selectedSlot);
    }
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
          <button 
            className="btn-confirm" 
            onClick={handleConfirm}
            disabled={!selectedSlot}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;