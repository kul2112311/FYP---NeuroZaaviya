import { useState } from 'react';
import FeedbackCard from './FeedBackCard';

function FeedBack() {
  // Mock data for demonstration
  const [feedbacks] = useState([
    {
      id: 1,
      peerName: "Sarah Johnson",
      initials: "SJ",
      avatarColor: "cyan",
      points: 30,
      badges: ["Active Listener", "Great Collaborator", "Time Manager"],
      badgesEarned: "3 Badges",
      date: "Mon, Jan 15",
      feedbackText: "Great focus throughout the session! Really appreciated your insights on the project."
    },
    {
      id: 2,
      peerName: "Mike Chen",
      initials: "MC",
      avatarColor: "purple",
      points: 20,
      badges: ["Active Listener", "Motivator"],
      badgesEarned: "2 Badges",
      date: "Fri, Jan 12",
      feedbackText: "Excellent communication and kept everyone on track. Thank you!"
    },
    {
      id: 3,
      peerName: "Emma Davis",
      initials: "ED",
      avatarColor: "pink",
      points: 10,
      badges: ["Helpful"],
      badgesEarned: "1 Badge",
      date: "Wed, Jan 10",
      feedbackText: "Very helpful during the study session. Your explanations were clear and easy to understand."
    }
  ]);

  return (
    <div className="bg-white p-6 rounded-2xl">
      <h2 className="text-sm mb-4 m-2" style={{ color: '#E1BEE7' }}>Session Feedback</h2>
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