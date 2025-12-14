import React, { useState } from 'react';
import { Calendar, Clock, Heart, Mail, X } from 'lucide-react';

function BookingModal({ peer, onClose, onConfirm }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = [
    { id: 1, day: 'Sun, Nov 23', time: '10:00 AM' },
    { id: 2, day: 'Sun, Nov 23', time: '2:00 PM' },
    { id: 3, day: 'Tue, Nov 25', time: '11:00 AM' },
    { id: 4, day: 'Thu, Nov 27', time: '3:00 PM' }
  ];

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