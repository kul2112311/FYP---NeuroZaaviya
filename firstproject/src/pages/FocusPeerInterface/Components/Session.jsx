import React, { useState, useEffect } from 'react';
import { Loader, User, Calendar, Clock, FileText, PlusCircle, X, CheckCircle } from 'lucide-react';
import { useUser } from '../../../styles/SignInLandingPage/usercontext.jsx';

// -------------------------------------------------------------
// INLINE CHECKUP MODAL
// -------------------------------------------------------------
function CreateCheckupModal({ student, isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rawDate, setRawDate] = useState('');
  const [rawTime, setRawTime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !rawDate || !rawTime) return alert("Please fill in required fields.");
    
    onCreate({
      title,
      description,
      rawDate,
      rawTime,
      studentId: student?.id,
      studentName: student?.name
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Schedule Check-up</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Scheduling a follow-up for <span className="font-bold">{student?.name}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-up Title *</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="e.g., Midterm Follow-up"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Description</label>
            <textarea 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Any details for the student..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                value={rawDate}
                onChange={(e) => setRawDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input 
                type="time" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                value={rawTime}
                onChange={(e) => setRawTime(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
          >
            Confirm Schedule
          </button>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// COMPONENT: SessionCard
// -------------------------------------------------------------
function SessionCard({ session, onCheckupClick, onCompleteClick }) {
  const isActive = session.status.toLowerCase() === 'confirmed' || session.status.toLowerCase() === 'pending';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-[20.8px] pt-[20.8px] pb-[20.8px] flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <User size={20} className="text-[#B39DDB]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{session.studentName}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              session.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
              session.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
              session.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {session.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span>{session.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span>{session.time}</span>
        </div>
        {session.notes && (
          <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-100">
            <FileText size={16} className="text-gray-400 mt-0.5" />
            <span className="text-xs italic">{session.notes}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 w-full mt-auto">
        <button 
          onClick={() => onCheckupClick(session)}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 hover:bg-purple-100 transition text-sm font-medium"
        >
          <PlusCircle size={16} />
          Check-up
        </button>

        {/* ✅ The New Complete Button (Only for upcoming sessions) */}
        {isActive && (
          <button 
            onClick={() => onCompleteClick(session.id, session.studentName)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100 transition text-sm font-medium"
          >
            <CheckCircle size={16} />
            Complete
          </button>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// COMPONENT: MAIN SESSION DASHBOARD
// -------------------------------------------------------------
export default function Session() {
    const { user } = useUser();
    
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        if (user && user.id) fetchSessions();
    }, [user]);

    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/peer-sessions/${user.id}`);
            if (!response.ok) throw new Error("Failed to fetch sessions");
            
            const data = await response.json();

            const formattedSessions = data.map(session => {
                const [year, month, day] = session.scheduled_date.split('-');
                const dateObj = new Date(year, month - 1, day);
                const [hours, minutes] = session.start_time.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                const time12h = `${hour12}:${minutes} ${ampm}`;

                return {
                    id: session.id,
                    studentId: session.id,
                    studentName: session.student_name,
                    peerUserId: user.id,
                    date: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    time: time12h,
                    status: capitalize(session.status),
                    notes: session.student_notes
                };
            });

            setSessions(formattedSessions);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const capitalize = (s) => s?.charAt(0).toUpperCase() + s?.slice(1) || '';

    // ✅ The New Function to Complete the Session
    const handleCompleteSession = async (sessionId, studentName) => {
        if (!window.confirm(`Did you finish your session with ${studentName}?`)) return;

        try {
            const response = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/sessions/${sessionId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' })
            });

            if (response.ok) {
                // Instantly update the UI without reloading
                setSessions(prev => prev.map(s => 
                    s.id === sessionId ? { ...s, status: 'Completed' } : s
                ));
                alert(`Session marked as Complete! It is now waiting in the 'Session Feedback' tab.`);
            } else {
                const errorData = await response.json();
                alert(`Failed to complete: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Network error. Could not mark session complete.");
        }
    };

    const handleOpenModal = (session) => {
        setSelectedStudent({ id: session.studentId, name: session.studentName });
        setIsModalOpen(true);
    };

    const handleCreateCheckup = async (checkupData) => {
        try {
            const scheduled_datetime = `${checkupData.rawDate}T${checkupData.rawTime}:00`;
            const payload = {
                title: checkupData.title,
                description: checkupData.description,
                scheduled_datetime: scheduled_datetime,
                studentId: checkupData.studentId, 
                studentName: checkupData.studentName,
                peerUserId: user.id 
            };

            const response = await fetch('https://fyp-neuro-zaaviya-server-01.vercel.app/api/checkups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(`Success! Check-up scheduled for ${checkupData.studentName}.`);
                setIsModalOpen(false);
            } else {
                const errorData = await response.json();
                alert(`Failed to schedule: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Network or Parsing Error:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const upcomingSessions = sessions.filter(s => s.status === 'Confirmed' || s.status === 'Pending');
    const pastSessions = sessions.filter(s => s.status === 'Completed' || s.status === 'Cancelled' || s.status === 'No_show');

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader className="animate-spin text-purple-500 mb-2" size={32} />
                <span className="text-gray-600">Loading your sessions...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Sessions</h2>
                {upcomingSessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingSessions.map(session => (
                            <SessionCard 
                                key={session.id} 
                                session={session} 
                                onCheckupClick={handleOpenModal} 
                                onCompleteClick={handleCompleteSession} // ✅ Pass the handler
                            />
                        ))}
                    </div>
                ) : ( <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"><p className="text-gray-500">No upcoming sessions.</p></div> )}
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Sessions</h2>
                {pastSessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastSessions.map(session => (
                            <SessionCard 
                                key={session.id} 
                                session={session} 
                                onCheckupClick={handleOpenModal} 
                                onCompleteClick={handleCompleteSession} // ✅ Pass the handler
                            />
                        ))}
                    </div>
                ) : ( <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"><p className="text-gray-500">No past sessions.</p></div> )}
            </div>

            {isModalOpen && (
                <CreateCheckupModal 
                    student={selectedStudent}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateCheckup}
                />
            )}
        </div>
    );
}