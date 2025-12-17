

import { Calendar, Clock, Star, Heart, Mail, X } from 'lucide-react';
function PeerCard({ peer, onBookSession }) {
  return (
    <div className="peer-card">
      <div className="peer-header">
        <div className={`peer-avatar ${peer.avatarColor}`}>
          {peer.initials}
        </div>
        <div className="peer-details">
          <h3 className="peer-name">{peer.name}</h3>
          <p className="peer-specialty">{peer.specialty}</p>
          <div className="peer-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
            <span>{peer.rating}</span>
          </div>
        </div>
      </div>
      
      <button className="view-times-btn" onClick={() => onBookSession(peer)}>
        View Available Time Slots
      </button>
    </div>
  );
}

export default PeerCard