import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Send, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PendingFeedback() {
  // Sarah Ahmed's user ID
  const PEER_USER_ID = "a2222222-2222-2222-2222-222222222222";
  
  const navigate = useNavigate();
  const [pendingSessions, setPendingSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingSessions();
  }, []);

  const fetchPendingSessions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/pending-feedback/${PEER_USER_ID}`);
      const data = await response.json();
      
      console.log('⏳ Pending feedback sessions:', data);
      
      // Format data for display
      const formatted = data.map(session => {
        // Parse date
        const [year, month, day] = session.scheduled_date.split('-');
        const dateObj = new Date(year, month - 1, day);
        const dateStr = dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        
        // Convert times to 12h format
        const formatTime = (time24) => {
          const [hours, minutes] = time24.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const hour12 = hour % 12 || 12;
          return `${hour12}:${minutes} ${ampm}`;
        };
        
        const timeStr = `${formatTime(session.start_time)} - ${formatTime(session.end_time)}`;
        
        // Get initials
        const initials = session.student_name
          .split(' ')
          .map(n => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        
        // Random avatar color (you could make this deterministic based on name)
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500'];
        const avatarColor = colors[Math.floor(Math.random() * colors.length)];
        
        return {
          id: session.id,
          name: session.student_name,
          major: session.major || 'Student',
          date: dateStr,
          time: timeStr,
          avatar: initials,
          avatarColor
        };
      });
      
      setPendingSessions(formatted);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pending sessions:", error);
      setIsLoading(false);
    }
  };

  const handleGiveFeedback = (session) => {
    // Navigate to feedback form page with session data
    navigate('/feedback-form', { state: { session } });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading pending sessions...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Sessions Awaiting Feedback
          </h2>
          <span className="px-3 py-1 bg-[#B39DDB] text-white rounded-full text-sm font-medium">
            {pendingSessions.length} pending
          </span>
        </div>

        {pendingSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No sessions awaiting feedback.</p>
            <p className="text-sm text-gray-400 mt-2">Completed sessions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSessions.map((session) => (
              <div 
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 transition-all"
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
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#B39DDB] hover:bg-[#9575CD] text-white rounded-lg transition-colors font-medium"
                >
                  <Send size={16} />
                  Give Feedback
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingFeedback;