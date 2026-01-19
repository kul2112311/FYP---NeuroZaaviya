import React, { useState } from "react";
import Appointment from "./Components/Appointment.jsx";
import Schedule from "./Components/Schedule.jsx";
import SessionFeedback from "./Components/Feedback.jsx"; 

function FocuspeerMonitor(){
    const [activeTab, setActiveTab] = useState('Appointment');  // Fix initial state
    
    return(
        <>
            <div className="focuspeer-container">
                <div className="focuspeer-content">
                    <h1>FocusPeer Management</h1>
                    <p>View and manage focus peer appointments, schedules, and feedback. Monitor session quality and peer availability.</p>
                </div>
                
                <div className="focuspeer-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'Appointment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Appointment')}
                    >
                        Appointments
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Schedules and Avalibility' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Schedules and Avalibility')}
                    >
                        Schedules and Avalibility
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Session Feedback' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Session Feedback')}
                    >
                        Session Feedback
                    </button>
                </div>

                {activeTab === 'Appointment' && (
                    <Appointment/>
                )}
                {activeTab === 'Schedules and Avalibility' && (
                    <Schedule/>
                )}  
                {activeTab === 'Session Feedback' && (
                    <SessionFeedback/>
                )}
            </div>
        </>
    )
}
export default FocuspeerMonitor;