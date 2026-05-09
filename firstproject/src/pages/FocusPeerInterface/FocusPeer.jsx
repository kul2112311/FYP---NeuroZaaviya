import React, { useState } from "react";
import PendingFeedback from "./Components/PendingFeedback.jsx";
import Session from "./Components/Session.jsx";
import Schedule from "./Components/Schedule.jsx";
import UpcomingCheckups from "./Components/CheckIns.jsx";

// ✨ NEW: Import the user context to get the logged-in person's name!
import { useUser } from "../../styles/SignInLandingPage/usercontext.jsx";

function FocusPeerSide(){
    const { user } = useUser(); // ✨ Grab the user data
    const [activeTab, setActiveTab] = useState('My Schedule');  
    
    return(
        <>
            {/* Added some padding and spacing so it breathes nicely on the page */}
            <div className="focuspeer-container p-8 max-w-7xl mx-auto space-y-6 w-[80vw]">
                
                {/* ✨ FIXED: New aesthetic welcome card matching the main Dashboard! */}
                <div className="rounded-3xl p-8 shadow-sm mb-6" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
                    <div>
                        <h1 className="text-3xl font-semibold mb-2" style={{ color: "#5a4a61" }}>
                            Welcome back, {user?.name?.split(' ')[0] || 'FocusPeer'}! ✨
                        </h1>
                        <p style={{ color: "#9575a3" }}>
                            Manage your sessions, view upcoming bookings, and track your feedback. Thank you for providing the best support to your peers! 💜
                        </p>
                    </div>
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
                     <button 
                        className={`tab-button ${activeTab === 'Upcoming Checkups' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Upcoming Checkups')}
                    >
                        Upcoming Checkups
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
                {activeTab === 'Upcoming Checkups' && (
                    <UpcomingCheckups/>
                )}
            </div>
        </>
    )
}

export default FocusPeerSide;