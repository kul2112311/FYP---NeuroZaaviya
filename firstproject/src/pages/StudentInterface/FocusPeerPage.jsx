import React, { useState, useEffect } from "react";
import Session from "./Components/Session.jsx";
import FeedBack from "./Components/FeedBack.jsx";
import PeerCard from "./Components/PeerCard.jsx";
import BookingModal, { SelectPeersModal } from "./Components/BookingModal.jsx";
import Checkin from "./Components/Checkin.jsx";
import { Users } from "lucide-react";


function FocusPeerPage() {
  const [activeTab, setActiveTab]       = useState("book");
  const [showModal, setShowModal]       = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [showSelectModal, setShowSelectModal] = useState(false);
 
  // All peers fetched from API
  const [allPeers, setAllPeers]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
  // The up-to-3 peers the student has assigned for the year
  const [myPeers, setMyPeers] = useState([]);
 
  useEffect(() => {
    const fetchPeers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/focus-peers");
        const data = await response.json();
 
        const formattedPeers = data.map(peer => ({
          id: peer.id,
          name: peer.full_name,
          specialty: peer.major,
          rating: Number(peer.rating),
          bio: peer.bio || "",
          initials: peer.full_name
            .split(" ")
            .map(n => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
          avatarColor: "purple",
        }));
 
        setAllPeers(formattedPeers);
      } catch (err) {
        console.error("Error fetching peers:", err);
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchPeers();
  }, []);
 
  // Called when SelectPeersModal confirms a selection
  const handlePeersSelected = (chosenPeers) => {
    setMyPeers(chosenPeers);
  };
 
  const handleBookSession = (peer) => {
    setSelectedPeer(peer);
    setShowModal(true);
  };
 
  const handleConfirmBooking = async (slot) => {
    try {
      const year  = slot.rawDate.getFullYear();
      const month = String(slot.rawDate.getMonth() + 1).padStart(2, "0");
      const day   = String(slot.rawDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
 
      const bookingData = {
        user_id:        "a1111111-1111-1111-1111-111111111111",
        peer_id:        selectedPeer.id,
        scheduled_date: dateStr,
        start_time:     slot.time24h,
        end_time:       addOneHour(slot.time24h),
        student_notes:  "Booked via Web App",
      };
 
      const response = await fetch("http://localhost:5000/api/book-session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(bookingData),
      });
 
      if (response.ok) {
        alert(`✅ Booking Confirmed with ${selectedPeer.name}!\nCheck 'My Sessions' tab.`);
        setShowModal(false);
        setSelectedPeer(null);
        setActiveTab("my");
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
 
  const addOneHour = (time24h) => {
    let [hours, minutes] = time24h.split(":");
    hours = (parseInt(hours) + 1) % 24;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };
 
  const tabs = [
    { key: "book",             label: "Book a Session" },
    { key: "my",               label: "My Sessions" },
    { key: "UpComing Checkin", label: "Upcoming Checkins" },
    { key: "feedback",         label: "Session Feedback" },
  ];
 
  return (
    <>
      <div className="p-6 pl-12 space-y-6" style={{ width: "80vw", margin: "0 auto" }}>
 
        {/* Header card */}
        <div className="focuspeer-content">
          <h1>FocusPeer Sessions</h1>
          <p>
            Connect with a FocusPeer for one-on-one support. Our peers help you organize
            tasks, understand assignments, and provide a calming presence when you need it most. 💜
          </p>
        </div>
 
        {/* Tabs */}
        <div className="focuspeer-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
 
        {/* ── Book a Session tab ─────────────────────────────────────── */}
        {activeTab === "book" && (
          <div>
            {/* Toolbar row: filter left, manage button right */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {/* optional filter placeholder — matches screenshot */}
                <span className="text-sm font-medium" style={{ color: "#9575a3" }}>
                  {myPeers.length === 0
                    ? "No FocusPeers assigned yet"
                    : `Your ${myPeers.length} FocusPeer${myPeers.length > 1 ? "s" : ""}`}
                </span>
              </div>
 
              {/* Manage FocusPeers button */}
              <button
                onClick={() => setShowSelectModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors"
                style={{
                  background: "rgba(179,157,219,0.15)",
                  border: "1px solid #d8cfe0",
                  color: "#5a4a61",
                  cursor: "pointer",
                }}
              >
                <Users size={15} style={{ color: "#b39ddb" }} />
                Manage FocusPeers ({myPeers.length}/{3})
              </button>
            </div>
 
            {/* Peer cards — only show assigned peers */}
            {isLoading ? (
              <p style={{ color: "#9575a3" }}>Loading Focus Peers...</p>
            ) : myPeers.length === 0 ? (
              /* Empty state */
              <div
                className="flex flex-col items-center justify-center py-16 rounded-3xl"
                style={{ border: "1.5px dashed #d8cfe0", background: "rgba(179,157,219,0.04)" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(179,157,219,0.12)" }}
                >
                  <Users size={24} style={{ color: "#b39ddb" }} />
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: "#5a4a61" }}>
                  No FocusPeers selected yet
                </p>
                <p className="text-xs mb-5" style={{ color: "#9575a3" }}>
                  Choose up to 3 peers who will support you throughout the year
                </p>
                <button
                  onClick={() => setShowSelectModal(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "#b39ddb", border: "none", color: "#fff", cursor: "pointer" }}
                >
                  Select Your FocusPeers
                </button>
              </div>
            ) : (
              <div className="peers-grid">
                {myPeers.map(peer => (
                  <PeerCard
                    key={peer.id}
                    peer={peer}
                    onBookSession={handleBookSession}
                  />
                ))}
              </div>
            )}
          </div>
        )}
 
        {activeTab === "my"               && <Session />}
        {activeTab === "feedback"         && <FeedBack />}
        {activeTab === "UpComing Checkin" && <Checkin />}
      </div>
 
      {/* Book a time slot modal */}
      {showModal && selectedPeer && (
        <BookingModal
          peer={selectedPeer}
          isOpen={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmBooking}
        />
      )}
 
      {/* Select / manage FocusPeers modal */}
      <SelectPeersModal
        isOpen={showSelectModal}
        onClose={() => setShowSelectModal(false)}
        onConfirm={handlePeersSelected}
        allPeers={allPeers}
        currentPeerIds={myPeers.map(p => p.id)}
      />
    </>
  );
}
 
export default FocusPeerPage;

// import React, { useState, useEffect } from "react";
// import Session from "./Components/Session.jsx";
// import FeedBack from "./Components/FeedBack.jsx";
// import PeerCard from "./Components/PeerCard.jsx";
// import BookingModal from "./Components/BookingModal.jsx";
// import Checkin from "./Components/Checkin.jsx";

// function FocusPeerPage() {
//   const [activeTab, setActiveTab] = useState('book');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedPeer, setSelectedPeer] = useState(null);
  
//   const [peers, setPeers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//     const handleBookSession = (peer) => {
//     setSelectedPeer(peer);
//     setShowModal(true);
//   };

//   const handleConfirmBooking = async (slot) => {
//     try {
//         // 1. Format Date correctly as YYYY-MM-DD (Local time)
//         const year = slot.rawDate.getFullYear();
//         const month = String(slot.rawDate.getMonth() + 1).padStart(2, '0');
//         const day = String(slot.rawDate.getDate()).padStart(2, '0');
//         const dateStr = `${year}-${month}-${day}`;
        
//         const bookingData = {
//             user_id: "a1111111-1111-1111-1111-111111111111", 
//             peer_id: selectedPeer.id,
//             scheduled_date: dateStr, 
//             start_time: slot.time24h,
//             end_time: addOneHour(slot.time24h),
//             student_notes: "Booked via Web App"
//         };

//         console.log('📤 Sending Booking:', bookingData);

//         const response = await fetch('http://localhost:5000/api/book-session', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(bookingData)
//         });

//         if (response.ok) {
//             const result = await response.json();
//             console.log('✅ Booking Response:', result);
            
//             alert(`✅ Booking Confirmed with ${selectedPeer.name}!\nCheck 'My Sessions' tab.`);
//             setShowModal(false);
//             setSelectedPeer(null);
//             setActiveTab('my'); // Switch tabs automatically
//         } else {
//             const errorData = await response.json();
//             alert(`Failed: ${errorData.error || "Could not book session"}`);
//         }

//     } catch (error) {
//         console.error("Booking Error:", error);
//         alert("An error occurred.");
//     }
//   };


//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedPeer(null);
//   };

//   // Helper: Add 1 Hour to 24h time string
//   const addOneHour = (time24h) => {
//     let [hours, minutes] = time24h.split(':');
//     hours = (parseInt(hours) + 1) % 24;
//     return `${String(hours).padStart(2, '0')}:${minutes}`; 
//   };

//   // Fetch Peers (Modified to use Dummy Data while server is off)
//   useEffect(() => {
//     const fetchPeers = async () => {
//       setIsLoading(true);
      
//       // Dummy data matching the structure your API would return
//       const dummyData = [
//         {
//           id: 1,
//           full_name: "Ayesha Malik",
//           major: "Computer Science",
//           rating: "4.9"
//         },
//         {
//           id: 2,
//           full_name: "Zain Ahmed",
//           major: "Psychology",
//           rating: "4.8"
//         },
//         {
//           id: 3,
//           full_name: "Rida Fatima",
//           major: "Social Sciences",
//           rating: "5.0"
//         }
//       ];

//       // Format logic kept exactly as you wrote it
//       const formattedPeers = dummyData.map(peer => ({
//         id: peer.id,
//         name: peer.full_name,
//         specialty: peer.major,
//         rating: Number(peer.rating),
//         initials: peer.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
//         avatarColor: "bg-[#E0E7FF] text-[#5A4A61]" // Using your project colors
//       }));

//       setPeers(formattedPeers);
//       setIsLoading(false);

//       // Original API Logic (Commented out)
//       try {
//         const response = await fetch('http://localhost:5000/api/focus-peers');
//         const data = await response.json();
//         ...
//       } catch (err) { ... }
      
//     };

//     fetchPeers();
//   }, []);

//   // ... handleBookSession, handleConfirmBooking, handleCloseModal, addOneHour logic stays same ...

//   return (
//     <>
//       <div className="p-6 pl-12 space-y-6" style={{ width: '80vw', margin: '0 auto' }}>
//         <div className="focuspeer-content">
//           <h1>FocusPeer Sessions</h1>
//           <p>Connect with a FocusPeer for one-on-one support. Our peers help you organize tasks, understand assignments, and provide a calming presence when you need it most. 💜</p>
//         </div>
        
//         {/* Tab layout preserved exactly */}
//         <div className="focuspeer-tabs">
//           <button 
//             className={`tab-button ${activeTab === 'book' ? 'active' : ''}`}
//             onClick={() => setActiveTab('book')}
//           >
//             Book a Session
//           </button>
//           <button 
//             className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
//             onClick={() => setActiveTab('my')}
//           >
//             My Sessions
//           </button>
//           <button 
//             className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
//             onClick={() => setActiveTab('feedback')}
//           >
//             Session Feedback
//           </button>
//           <button 
//             className={`tab-button ${activeTab === 'UpComing Checkin' ? 'active' : ''}`}
//             onClick={() => setActiveTab('UpComing Checkin')}
//           >
//             Upcoming Checkins
//           </button>
//         </div>
        
//         {activeTab === 'book' && (
//           <div className="peers-grid">
//             {isLoading ? (
//                <p>Loading Focus Peers...</p> 
//             ) : (
//               peers.map(peer => (
//                 <PeerCard 
//                   key={peer.id} 
//                   peer={peer}
//                   onBookSession={handleBookSession}
//                 />
//               ))
//             )}
//           </div>
//         )}
        
//         {activeTab === 'my' && <Session />}
//         {activeTab === 'feedback' && <FeedBack />}
//         {activeTab === 'UpComing Checkin' && <Checkin />}
//       </div>

//       {showModal && selectedPeer && (
//         <BookingModal
//           peer={selectedPeer}
//           isOpen={showModal}
//           onClose={handleCloseModal}
//           onConfirm={handleConfirmBooking}
//         />
//       )}
//     </>
//   );
// }

// export default FocusPeerPage;