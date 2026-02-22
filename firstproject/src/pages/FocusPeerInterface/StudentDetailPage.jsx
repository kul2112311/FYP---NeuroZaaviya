import React, { useState } from "react";
import { ArrowLeft, Clock, Award, Calendar, MoreVertical } from "lucide-react";
import CreateCheckupModal from "./CreateCheckupModal.jsx";

function StudentDetailPage({ student, onBack, onCheckupCreated }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [upcomingCheckups, setUpcomingCheckups] = useState([
    {
      id: 1,
      title: "Weekly Progress Check",
      description: "Review progress on the history assignment and discuss any blockers.",
      date: "Feb 22, 3:05 PM"
    },
    {
      id: 2,
      title: "weekly progress",
      description: "focussndf",
      date: "Jul 6, 9:50 AM"
    }
  ]);

  const feedbackHistory = [
    {
      id: 1,
      date: "Dec 3, 2025",
      time: "2:00 PM - 3:00 PM",
      feedback: "Great session! Ushna was very focused and organized her tasks well. We worked through her chemistry assignment together."
    },
    {
      id: 2,
      date: "Nov 28, 2025",
      time: "2:00 PM - 3:00 PM",
      feedback: "Ushna showed excellent improvement in managing her time. She came prepared with all her materials."
    },
    {
      id: 3,
      date: "Nov 21, 2025",
      time: "3:00 PM - 4:00 PM",
      feedback: "Good session overall. Ushna was a bit overwhelmed but we created a clear action plan together."
    }
  ];

  const handleCreateCheckup = (checkupData) => {
    const newCheckup = {
      id: upcomingCheckups.length + 1,
      title: checkupData.title,
      description: checkupData.description,
      date: checkupData.date
    };
    setUpcomingCheckups([newCheckup, ...upcomingCheckups]);
    setShowCreateModal(false);
    
    // Trigger notification
    onCheckupCreated(checkupData);
  };

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw', margin: '0 auto' }}>
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition font-medium"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {/* Student Profile Card */}
      <div className="bg-purple-50 rounded-2xl p-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <img 
              src={student.avatar}
              alt={student.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
              <p className="text-gray-600">{student.major}</p>
              <div className="flex gap-8 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-800">3</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Badges Earned</p>
                  <p className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    5 <Award size={20} className="text-yellow-500" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition font-semibold flex items-center gap-2"
          >
            <Clock size={18} />
            Create Check-up
          </button>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Session Feedback History */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Session Feedback History</h2>
          
          <div className="space-y-4">
            {feedbackHistory.map(feedback => (
              <div key={feedback.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar size={16} />
                  <span>{feedback.date}</span>
                  <Clock size={16} className="ml-4" />
                  <span>{feedback.time}</span>
                </div>
                <p className="text-gray-700">{feedback.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Checkups */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Clock size={20} />
            Upcoming Checkups
          </h2>
          
          <div className="space-y-4">
            {upcomingCheckups.map(checkup => (
              <div key={checkup.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{checkup.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{checkup.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                      <Clock size={14} />
                      {checkup.date}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateCheckupModal 
        student={student}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCheckup}
      />
    </div>
  );
}

export default StudentDetailPage;