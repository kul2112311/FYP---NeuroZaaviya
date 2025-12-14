
function FeedbackCard({ feedback }) {
  return (
    <div className="feedback-card">
      <div className="feedback-card-header">
        <div className="feedback-peer-info">
          <div className={`feedback-avatar ${feedback.avatarColor}`}>
            {feedback.initials}
          </div>
          <div className="feedback-peer-details">
            <h3 className="feedback-peer-name">{feedback.peerName}</h3>
            <div className="feedback-badges">
              <span className="feedback-badge points">+{feedback.points} points</span>
              {feedback.badges.map((badge, index) => (
                <span key={index} className="feedback-badge">{badge}</span>
              ))}
            </div>
          </div>
        </div>
        <span className="feedback-date">{feedback.date}</span>
      </div>

      <div className="feedback-title">
        <span className="feedback-title-label">Badges Earned</span>
        <span className="feedback-title-value">{feedback.badgesEarned}</span>
      </div>

      <p className="feedback-text">
        {feedback.feedbackText}
      </p>
    </div>
  );
}
export default FeedbackCard
