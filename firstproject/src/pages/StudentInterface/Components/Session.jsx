import { useState, useEffect } from 'react';
import SessionCard from './SessionCard.jsx';
import { useUser } from '../../../styles/SignInLandingPage/usercontext.jsx';

function Session() {
    const { user } = useUser();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            // ✨ Wait until the user context is fully loaded
            if (!user || !user.id) return;

            try {
                // ✨ FIXED: Using the real logged-in student's ID
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my-sessions/${user.id}`);
                const data = await response.json();

                console.log('📅 Sessions from backend:', data);

                // Format the data to match what the UI expects
                const formattedSessions = data.map(session => {
                    // Handle both old timestamp format and new string format
                    let dateObj;
                    if (typeof session.scheduled_date === 'string' && !session.scheduled_date.includes('T')) {
                        // New format: "2025-12-18"
                        const [year, month, day] = session.scheduled_date.split('-');
                        dateObj = new Date(year, month - 1, day);
                    } else {
                        // Old format: timestamp
                        dateObj = new Date(session.scheduled_date);
                    }

                    return {
                        id: session.id,
                        peerName: session.peer_name,
                        date: dateObj.toLocaleDateString('en-US', {
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric'
                        }),
                        time: session.start_time.substring(0, 5), // "13:00:00" -> "13:00"
                        status: capitalize(session.status)
                    };
                });

                setSessions(formattedSessions);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching sessions:", error);
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, [user]); // ✨ Re-run the fetch when the user data is ready

    // Helper to capitalize status (confirmed -> Confirmed)
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const upcomingSessions = sessions.filter(s => s.status === 'Confirmed' || s.status === 'Pending');
    const pastSessions = sessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled');

    if (isLoading) return <p className="loading-text">Loading your sessions...</p>;

    return (
        <div className="Session-Container">
            <div className="upcoming-session-layout">
                <h1 className="session-layout-header">Upcoming Sessions</h1>
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
                <h2 className="session-layout-header">Previous Sessions</h2>
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

export default Session;