import React, { useState } from 'react';
 const TimeSlotsContent = () => (
  <div className="time-slots-inner">
    {/* This is the content that appears when expanded */}
    <p>Time Slot 1: 9:00 AM</p>
    <p>Time Slot 2: 10:30 AM</p>
  </div>
);

function PeerCard({ peer }) {

  const [isExpanded, setIsExpanded] = useState(false);
  // 2. Function to toggle the expanded state
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // 3. Determine the button text based on the current state
  const buttonText = isExpanded ? 'Hide Time Slots' : 'View Available Time Slots';
  
  // 4. Determine the visibility class for the expanded container
  const expandedClass = isExpanded ? 'expanded' : '';

 
  return (
    <div className="peer-card">
        <div className="peer-header">
            <div className={`peer-avatar ${peer.avatarColor}`}>
                {peer.initials}
            </div>
            <div className="peer-details">
                <h3 className="peer-name">{peer.name}</h3>
                <p className="peer-specialty">{peer.specialty}</p>
                <div className="peer-rating">⭐ {peer.rating}</div>
            </div>
        </div>
        <button className="view-times-btn"
        onClick={toggleExpansion}
        >{buttonText}
          
        </button>
       {/* 👇 THE SEPARATE, SLIDING CONTAINER 👇 */}
        <div className={`peer-card-expansion ${expandedClass}`}>
          {/* This entire div slides down. 
             The TimeSlotsContent only renders when isExpanded is true.
          */}
          {isExpanded && <TimeSlotsContent />}
        </div>
    </div>
  )
}

export default PeerCard