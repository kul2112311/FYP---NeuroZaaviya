function SessionCard({ session }) {
  return (
    <div className="session-card">
      <div className="session-card-header">
        <h3 className="session-peer-name">{session.peerName}</h3>
        <span className={`session-status ${session.status.toLowerCase()}`}>
          {session.status}
        </span>
      </div>
      
      <div className="session-card-details">
        <div className="session-detail-item">
          <span className="detail-icon">📅</span>
          <span className="detail-text">{session.date}</span>
        </div>
        <div className="session-detail-item">
          <span className="detail-icon">🕐</span>
          <span className="detail-text">{session.time}</span>
        </div>
      </div>
    </div>
  );
}

export default SessionCard;