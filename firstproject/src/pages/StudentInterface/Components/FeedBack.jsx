import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import FeedbackCard from './FeedBackCard';

function FeedBack() {
  // Ushna's user ID
  const STUDENT_USER_ID = "a1111111-1111-1111-1111-111111111111";
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/student-feedback/${STUDENT_USER_ID}`);
      const data = await response.json();
      
      console.log('📬 Received feedback:', data);
      
      // Format data for display
      const formatted = data.map((feedback, index) => {
        // Get peer initials
        const initials = feedback.peer_name
          .split(' ')
          .map(n => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        
        // Random avatar color (deterministic based on peer name)
        const colors = ['cyan', 'purple', 'pink', 'green', 'orange', 'blue'];
        const colorIndex = feedback.peer_name.charCodeAt(0) % colors.length;
        const avatarColor = colors[colorIndex];
        
        // Format date
        const [year, month, day] = feedback.session_date.split('-');
        const dateObj = new Date(year, month - 1, day);
        const dateStr = dateObj.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        });
        
        // Get badge names
        const badgeNames = feedback.badge_details.map(b => b.name);
        const badgeCount = badgeNames.length;
        
        // Calculate points (10 per badge)
        const points = badgeCount * 10;
        
        return {
          id: feedback.id,
          peerName: feedback.peer_name,
          initials,
          avatarColor,
          points,
          badges: badgeNames,
          badgesEarned: `${badgeCount} Badge${badgeCount !== 1 ? 's' : ''}`,
          date: dateStr,
          feedbackText: feedback.feedback_text || 'No additional feedback provided.'
        };
      });
      
      setFeedbacks(formatted);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="Feed-Back-Container">
        <h1 className="session-layout-header">Session Feedback</h1>
        <div className="flex items-center justify-center p-12">
          <Loader className="animate-spin" size={32} />
          <span className="ml-2">Loading feedback...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="Feed-Back-Container">
      <h1 className="session-layout-header">Session Feedback</h1>
      {feedbacks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No feedback received yet.</p>
          <p className="text-sm mt-2">Feedback from your FocusPeer sessions will appear here.</p>
        </div>
      ) : (
        <div className="feedback-grid">
          {feedbacks.map(feedback => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedBack;