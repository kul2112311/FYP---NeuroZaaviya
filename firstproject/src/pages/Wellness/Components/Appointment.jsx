import { useState } from 'react';

import SessionCard from './SessionCard.jsx';

function Appointment() {
    // Dummy data for sessions - matching the design screenshot
    const dummySessions = [
        {
            id: 1,
            peerName: "Sarah Ahmed",
            studentName: "Ushna Khan",
            date: "Sat, Nov 22",
            time: "10:00 AM",
            status: "Confirmed"
        },
        {
            id: 2,
            peerName: "Marcus Chen",
            studentName: "Ali Hassan",
            date: "Sat, Nov 22",
            time: "2:00 PM",
            status: "Confirmed"
        },
        {
            id: 3,
            peerName: "Layla Hassan",
            studentName: "Fatima Noor",
            date: "Sun, Nov 23",
            time: "11:00 AM",
            status: "Confirmed"
        },
        {
            id: 4,
            peerName: "Sarah Ahmed",
            studentName: "Ahmed Malik",
            date: "Sat, Nov 15",
            time: "3:00 PM",
            status: "Completed"
        },
        {
            id: 5,
            peerName: "Marcus Chen",
            studentName: "Ushna Khan",
            date: "Sat, Nov 15",
            time: "2:00 PM",
            status: "Completed"
        }
    ];

    const [sessions] = useState(dummySessions);

    // Filter sessions into upcoming and past
    const upcomingSessions = sessions.filter(s => s.status === 'Confirmed' || s.status === 'Pending');
    const pastSessions = sessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled');

    return (
        <div className="Session-Container">
            <div className="upcoming-session-layout">
                <h1 className="session-layout-header">Upcoming Appointments</h1>
                <p className="session-count">{upcomingSessions.length} sessions</p>
                <div className="sessions-grid">
                    {upcomingSessions.length > 0 ? (
                        upcomingSessions.map(session => (
                            <SessionCard key={session.id} session={session} />
                        ))
                    ) : (
                        <p>No upcoming sessions.</p>
                    )}
                </div>
            </div>

            <div className="previous-session-layout">
                <h2 className="session-layout-header">Recent Completed Sessions</h2>
                <div className="sessions-grid">
                    {pastSessions.length > 0 ? (
                        pastSessions.map(session => (
                            <SessionCard key={session.id} session={session} />
                        ))
                    ) : (
                        <p>No past sessions.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Appointment;