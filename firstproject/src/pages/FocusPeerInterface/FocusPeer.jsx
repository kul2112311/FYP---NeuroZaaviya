import React, { useState } from "react";
import PendingFeedback from "./Components/PendingFeedback.jsx";
import Session from "./Components/Session.jsx";
import Schedule from "./Components/Schedule.jsx";

function FocusPeerSide(){
    const [activeTab, setActiveTab] = useState('My Schedule');  // Fix initial state
    
    return(
        <>
            <div className="focuspeer-container">
                <div className="focuspeer-content">
                    <h1>FocusPeer DashBoard</h1>
                    <p>Welcome to your FocusPeer dashboard! Here, you can manage your sessions, view upcoming bookings, and track your feedback. Stay organized and provide the best support to your peers!</p>
                </div>
                
                <div className="focuspeer-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'My Schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('My Schedule')}
                    >
                        My Schedule
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'My Sessions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('My Sessions')}
                    >
                        My Sessions
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Pending')}
                    >
                        Pending Feedback
                    </button>
                </div>

                {activeTab === 'My Schedule' && (
                    <Schedule/>
                )}
                {activeTab === 'My Sessions' && (
                    <Session/>
                )}  
                {activeTab === 'Pending' && (
                    <PendingFeedback/>
                )}
            </div>
        </>
    )
}

export default FocusPeerSide;
