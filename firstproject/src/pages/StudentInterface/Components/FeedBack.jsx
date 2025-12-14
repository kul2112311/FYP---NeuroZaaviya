import FeedbackCard from './FeedBackCard'


import React from 'react'

function FeedBack() {
  const feedbacks = [
    {
      id: 1,
      peerName: "Marcus Chen",
      initials: "MC",
      avatarColor: "cyan",
      points: 15,
      badges: ["Helpful", "Great"],
      badgesEarned: "3 Badges",
      date: "Sat, Nov 15",
      feedbackText: "Had a wonderful session with Ushna today. We discussed her upcoming research paper and I helped her break down the assignment into manageable tasks. She was feeling overwhelmed about the literature review, so we created a timeline with specific mini-goals for each day. I also helped her draft an email to her TA to clarify some citation requirements. Ushna left feeling much more confident and organized!"
    },
    {
      id: 2,
      peerName: "Sarah Ahmed",
      initials: "SA",
      avatarColor: "purple",
      points: 12,
      badges: ["Supportive", "Clear"],
      badgesEarned: "2 Badges",
      date: "Fri, Nov 14",
      feedbackText: "Great session focusing on exam preparation strategies. We went through past papers together and I helped identify key concepts that frequently appear. The student felt much more prepared after our discussion and appreciated the practice questions we worked through together."
    },
    {
      id: 3,
      peerName: "Layla Hassan",
      initials: "LH",
      avatarColor: "pink",
      points: 10,
      badges: ["Patient"],
      badgesEarned: "1 Badge",
      date: "Thu, Nov 12",
      feedbackText: "Had a productive session about assignment planning. We broke down the project into smaller milestones and created a timeline that works with the student's schedule. They left with a clear action plan and felt more in control of their workload."
    }
  ];

  return (
    <div className="Feed-Back-Container">
      <h1 className="session-layout-header">Session Feedback</h1>
      <div className="feedback-grid">
        {feedbacks.map(feedback => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))}
      </div>
    </div>
  );
}

export default FeedBack;
