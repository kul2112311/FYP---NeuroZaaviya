
import PeerCard from '../components/FocusPeerComponents/PeerCard.jsx'
import React, { useState } from 'react'
import Session from '../components/FocusPeerComponents/Session.jsx'
import FeedBack from '../components/FocusPeerComponents/FeedBack.jsx'
function FocusPeerPage() {
    const [activeTab, setActiveTab] = useState('book');

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

 

  return (
    <>
         
         <div className="focuspeer-container">
            <div className="focuspeer-content">
              <h1>FocusPeer Sessions</h1>
              <p>Connect with a FocusPeer for one-on-one support. Our peers help you organize tasks, understand assignments, and provide a calming presence when you need it most. 💜</p>
              
            </div>
            <div className="focuspeer-tabs">
                <button className={`tab-button ${activeTab === 'book' ? 'active' : ''}`}
                onClick={() => setActiveTab('book')}>
                  
                Book a Session</button>
                <button className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
                onClick={()=>setActiveTab('my')}
                >My Sessions</button>
                <button className={`tab-button ${activeTab} ==='feedback' ? 'active' : '' `}
                onClick={()=>setActiveTab('feedback')}
                >Session Feedback</button>
            </div>
           {activeTab === 'book' && (
            <div className="peers-grid">
              {peers.map(peer => (
                <PeerCard key={peer.id} peer={peer} />
              ))}
            </div>
          )}
         {activeTab === 'my' && (
            <Session />
          )}
         {
          activeTab === 'feedback' && (
            <FeedBack/>
          )
         }
          

         </div>
         
    
    </>
   

  )
}
export default FocusPeerPage