import SessionCard from './SessionCard.jsx'

function Session(){

    const sessions = [
    {
      id: 1,
      peerName: "Sarah Ahmed",
      date: "Sat, Nov 22",
      time: "10:00 AM",
      status: "Confirmed"
    },
    {
      id: 2,
      peerName: "Marcus Chen",
      date: "Sat, Nov 15",
      time: "2:00 PM",
      status: "Completed"
    },
    {
      id: 3,
      peerName: "Layla Hassan",
      date: "Sun, Nov 29",
      time: "3:30 PM",
      status: "Confirmed"
    }
  ];

  const upcomingSessions = sessions.filter(s => s.status === 'Confirmed');
  const pastSessions = sessions.filter(s => s.status === 'Completed');

    return(
        <div className="Session-Container">
            <div className="upcoming-session-layout">
                <h1 className="session-layout-header">Upcoming Session</h1>
                <div className="sessions-grid">
                {upcomingSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
                </div>


            </div>
            <div className="previous-session-layout">
                <h2 className="session-layout-header">Previous Sessions</h2>
                <div className="sessions-grid">
                {pastSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
                </div>
            </div>
        </div>

    )
}

export default Session