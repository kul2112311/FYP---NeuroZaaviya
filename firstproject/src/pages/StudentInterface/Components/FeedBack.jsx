import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import FeedbackCard from './FeedBackCard';
// ✨ FIXED 1: Import the user context so we know who is actually logged in!
import { useUser } from '../../../styles/SignInLandingPage/usercontext.jsx'; 

function FeedBack() {
  const { user } = useUser(); // ✨ FIXED 2: Grab the real student
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch if the user is fully loaded
    if (user && user.id) {
      fetchFeedback();
    }
  }, [user]);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      // ✨ FIXED 3: Use the real student's ID in the API call
      const response = await fetch(`http://localhost:5000/api/student-feedback/${user.id}`);
      const data = await response.json();
      
      console.log('📬 Received feedback:', data);
      
      // ✨ FIXED 4: The Safety Catch! If the backend sends an error object instead of an array, stop here.
      if (!Array.isArray(data)) {
        console.warn('Backend did not return an array. It returned:', data);
        setFeedbacks([]); // Force it to be an empty array so the screen doesn't crash
        setIsLoading(false);
        return;
      }
      
      // Format data for display
      const formatted = data.map((feedback, index) => {
        // Get peer initials safely
        const initials = feedback.peer_name
          ? feedback.peer_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          : "??";
        
        // Random avatar color (deterministic based on peer name)
        const colors = ['cyan', 'purple', 'pink', 'green', 'orange', 'blue'];
        const colorIndex = feedback.peer_name ? feedback.peer_name.charCodeAt(0) % colors.length : 0;
        const avatarColor = colors[colorIndex];
        
        // Format date safely
        let dateStr = "Unknown Date";
        if (feedback.session_date) {
          const [year, month, day] = feedback.session_date.split('-');
          const dateObj = new Date(year, month - 1, day);
          dateStr = dateObj.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric' 
          });
        }
        
        // Get badge names safely
        const badgeNames = feedback.badge_details ? feedback.badge_details.map(b => b.name) : [];
        const badgeCount = badgeNames.length;
        
        // Calculate points (10 per badge)
        const points = badgeCount * 10;
        
        return {
          id: feedback.id,
          peerName: feedback.peer_name || "Unknown Peer",
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
      setFeedbacks([]); // Fallback to empty so it doesn't crash
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