import React, { useState } from "react";
import Session from "./Components/Session.jsx";
import FeedBack from "./Components/FeedBack.jsx";
import FeedBackCard from "./Components/FeedBackCard.jsx";
import PeerCard from "./Components/PeerCard.jsx";
import SessionCard from "./Components/SessionCard.jsx";
import BookingModal from "./Components/BookingModal.jsx";

function FocusPeerPage() {
    const [activeTab, setActiveTab] = useState('book');
    const [showModal, setShowModal] = useState(false);
    const [selectedPeer, setSelectedPeer] = useState(null);

    const peers = [
    {
      id: 1,
      name: "Sarah Ahmed",
      specialty: "Psychology",
      rating: 4.8,
      initials: "SA",
      avatarColor: "purple"
    },
    {
      id: 2,
      name: "Marcus Chen",
      specialty: "Education",
      rating: 4.9,
      initials: "MC",
      avatarColor: "cyan"
    },
    {
      id: 3,
      name: "Layla Hassan",
      specialty: "Social Work",
      rating: 4.7,
      initials: "LH",
      avatarColor: "pink"
    },
    {
      id: 4,
      name: "Jordan Taylor",
      specialty: "Counseling",
      rating: 4.6,
      initials: "JT",
      avatarColor: "orange"
    }
  ];
  
  const handleBookSession = (peer) => {
    setSelectedPeer(peer);
    setShowModal(true);
  };

  const handleConfirmBooking = (slot) => {
    alert(`Booking confirmed with ${selectedPeer.name} on ${slot.day} at ${slot.time}`);
    setShowModal(false);
    setSelectedPeer(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPeer(null);
  };

  return (
    <>
      <div className="focuspeer-container">
        <div className="focuspeer-content">
          <h1>FocusPeer Sessions</h1>
          <p>Connect with a FocusPeer for one-on-one support. Our peers help you organize tasks, understand assignments, and provide a calming presence when you need it most. 💜</p>
        </div>
        
        <div className="focuspeer-tabs">
          <button 
            className={`tab-button ${activeTab === 'book' ? 'active' : ''}`}
            onClick={() => setActiveTab('book')}
          >
            Book a Session
          </button>
          <button 
            className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Sessions
          </button>
          <button 
            className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            Session Feedback
          </button>
        </div>
        
        {activeTab === 'book' && (
          <div className="peers-grid">
            {peers.map(peer => (
              <PeerCard 
                key={peer.id} 
                peer={peer}
                onBookSession={handleBookSession}
              />
            ))}
          </div>
        )}
        
        {activeTab === 'my' && (
          <Session />
        )}
        
        {activeTab === 'feedback' && (
          <FeedBack />
        )}
      </div>

      {showModal && selectedPeer && (
        <BookingModal
          peer={selectedPeer}
          onClose={handleCloseModal}
          onConfirm={handleConfirmBooking}
        />
      )}
    </>
  )
}

export default FocusPeerPage