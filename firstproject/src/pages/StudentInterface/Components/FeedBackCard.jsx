import React from 'react';
import { Calendar, Quote } from 'lucide-react';

function FeedbackCard({ feedback }) {
  // Helper to generate soft, aesthetic colors for the avatars based on the color string passed from the parent
  const getAvatarStyles = (colorName) => {
    const palettes = {
      cyan: { bg: '#e0f7fa', text: '#006064' },
      purple: { bg: '#f3e5f5', text: '#6a1b9a' },
      pink: { bg: '#fce4ec', text: '#ad1457' },
      green: { bg: '#e8f5e9', text: '#2e7d32' },
      orange: { bg: '#fff3e0', text: '#ef6c00' },
      blue: { bg: '#e3f2fd', text: '#1565c0' },
      default: { bg: '#f3e5f5', text: '#6a1b9a' }
    };
    return palettes[colorName] || palettes.default;
  };

  const avatarStyle = getAvatarStyles(feedback.avatarColor);

  return (
    <div 
      className="bg-white rounded-[2rem] p-6 shadow-sm border transition-all hover:shadow-md flex flex-col h-full" 
      style={{ borderColor: 'rgba(179,157,219,0.2)' }}
    >
      {/* --- Header: Avatar, Name, and Date --- */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          {/* Avatar Box */}
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm"
            style={{ background: avatarStyle.bg, color: avatarStyle.text }}
          >
            {feedback.initials}
          </div>
          
          {/* Name & Role */}
          <div>
            <h3 className="font-bold text-lg leading-tight" style={{ color: '#5a4a61' }}>{feedback.peerName}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#b39ddb' }}>
              FocusPeer
            </p>
          </div>
        </div>

        {/* Date Badge */}
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-xl border" 
          style={{ background: '#fdf7fd', borderColor: 'rgba(179,157,219,0.15)', color: '#9575a3' }}
        >
          <Calendar size={14} />
          <span className="text-xs font-semibold">{feedback.date}</span>
        </div>
      </div>

      {/* --- Feedback Content Box --- */}
      <div 
        className="relative p-5 rounded-2xl flex-1 mt-2" 
        style={{ background: 'rgba(179,157,219,0.06)' }}
      >
        <Quote size={28} className="absolute top-4 right-4 opacity-10" style={{ color: '#5a4a61' }} />
        
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9575a3' }}>
          Session Notes
        </h4>
        
        <p className="text-sm leading-relaxed font-medium italic" style={{ color: '#5a4a61' }}>
          "{feedback.feedbackText}"
        </p>
      </div>
    </div>
  );
}

export default FeedbackCard;