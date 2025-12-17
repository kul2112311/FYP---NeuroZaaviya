import React, { useState, useEffect } from "react";
import Session from "./Components/Session.jsx";
import FeedBack from "./Components/FeedBack.jsx";
import PeerCard from "./Components/PeerCard.jsx";
import BookingModal from "./Components/BookingModal.jsx";

function FocusPeerPage() {
  const [activeTab, setActiveTab] = useState('book');
  const [showModal, setShowModal] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);
  
  const [peers, setPeers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Peers
  useEffect(() => {
    const fetchPeers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/focus-peers');
        const data = await response.json();

        const formattedPeers = data.map(peer => ({
          id: peer.id,
          name: peer.full_name,
          specialty: peer.major,
          rating: Number(peer.rating),
          initials: peer.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          avatarColor: "purple"
        }));

        setPeers(formattedPeers);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching peers:", err);
        setIsLoading(false);
      }
    };

    fetchPeers();
  }, []);

  const handleBookSession = (peer) => {
    setSelectedPeer(peer);
    setShowModal(true);
  };

  const handleConfirmBooking = async (slot) => {
    try {
        // 1. Format Date correctly as YYYY-MM-DD (Local time)
        const year = slot.rawDate.getFullYear();
        const month = String(slot.rawDate.getMonth() + 1).padStart(2, '0');
        const day = String(slot.rawDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const bookingData = {
            user_id: "a1111111-1111-1111-1111-111111111111", 
            peer_id: selectedPeer.id,
            scheduled_date: dateStr, 
            start_time: slot.time24h,
            end_time: addOneHour(slot.time24h),
            student_notes: "Booked via Web App"
        };

        console.log('📤 Sending Booking:', bookingData);

        const response = await fetch('http://localhost:5000/api/book-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Booking Response:', result);
            
            alert(`✅ Booking Confirmed with ${selectedPeer.name}!\nCheck 'My Sessions' tab.`);
            setShowModal(false);
            setSelectedPeer(null);
            setActiveTab('my'); // Switch tabs automatically
        } else {
            const errorData = await response.json();
            alert(`Failed: ${errorData.error || "Could not book session"}`);
        }

    } catch (error) {
        console.error("Booking Error:", error);
        alert("An error occurred.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPeer(null);
  };

  // Helper: Add 1 Hour to 24h time string
  const addOneHour = (time24h) => {
    let [hours, minutes] = time24h.split(':');
    hours = (parseInt(hours) + 1) % 24;
    return `${String(hours).padStart(2, '0')}:${minutes}`; 
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
            {isLoading ? (
               <p>Loading Focus Peers...</p> 
            ) : (
              peers.map(peer => (
                <PeerCard 
                  key={peer.id} 
                  peer={peer}
                  onBookSession={handleBookSession}
                />
              ))
            )}
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
          isOpen={showModal}  // ← ADD THIS PROP
          onClose={handleCloseModal}
          onConfirm={handleConfirmBooking}
        />
      )}
    </>
  )
}

export default FocusPeerPage;