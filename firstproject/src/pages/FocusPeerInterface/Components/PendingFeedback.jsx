import React, { useState } from 'react';
import { Calendar, Clock, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PendingFeedback() {
  const navigate = useNavigate();
  
  const pendingSessions = [
    {
      id: 1,
      name: "Ushna Batool",
      major: "Computer Science",
      date: "Dec 6, 2025",
      time: "2:00 PM - 3:00 PM",
      avatar: "UB",
      avatarColor: "bg-blue-500"
    },
    {
      id: 2,
      name: "Maria Khan",
      major: "Electrical Engineering",
      date: "Dec 5, 2025",
      time: "10:00 AM - 11:00 AM",
      avatar: "MK",
      avatarColor: "bg-pink-500"
    }
  ];

  const handleGiveFeedback = (session) => {
    // Navigate to feedback form page with session data
    navigate('/feedback-form', { state: { session } });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Sessions Awaiting Feedback
          </h2>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {pendingSessions.length} pending
          </span>
        </div>

        <div className="space-y-4">
          {pendingSessions.map((session) => (
            <div 
              key={session.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${session.avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-lg`}>
                  {session.avatar}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {session.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {session.major}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{session.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleGiveFeedback(session)}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-400 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
              >
                <Send size={16} />
                Give Feedback
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PendingFeedback;