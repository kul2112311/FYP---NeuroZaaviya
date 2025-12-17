import { useState, useEffect } from 'react';
import { Loader, User, Calendar, Clock, FileText } from 'lucide-react';

function SessionCard({ session }) {
  return (
    <div className="session-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
      
      <div className="space-y-2 text-sm text-gray-600">
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
    </div>
  );
}

function Session() {
    // Sarah Ahmed's user ID
    const PEER_USER_ID = "a2222222-2222-2222-2222-222222222222";
    
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/api/peer-sessions/${PEER_USER_ID}`);
            const data = await response.json();

            console.log('📋 Fetched peer sessions:', data);

            // Format the data
            const formattedSessions = data.map(session => {
                // Parse date string "2025-12-18"
                const [year, month, day] = session.scheduled_date.split('-');
                const dateObj = new Date(year, month - 1, day);

                // Convert 24h time to 12h format
                const [hours, minutes] = session.start_time.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                const time12h = `${hour12}:${minutes} ${ampm}`;

                return {
                    id: session.id,
                    studentName: session.student_name,
                    date: dateObj.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    }),
                    time: time12h,
                    status: capitalize(session.status),
                    notes: session.student_notes
                };
            });

            setSessions(formattedSessions);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching sessions:", error);
            setIsLoading(false);
        }
    };

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // Separate upcoming and past sessions
    const upcomingSessions = sessions.filter(s => 
        s.status === 'Confirmed' || s.status === 'Pending'
    );
    const pastSessions = sessions.filter(s => 
        s.status === 'Completed' || s.status === 'Cancelled' || s.status === 'No_show'
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader className="animate-spin" size={32} />
                <span className="ml-2 text-gray-600">Loading your sessions...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Upcoming Sessions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Sessions</h2>
                {upcomingSessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingSessions.map(session => (
                            <SessionCard key={session.id} session={session} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No upcoming sessions scheduled.</p>
                    </div>
                )}
            </div>

            {/* Past Sessions */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Sessions</h2>
                {pastSessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastSessions.map(session => (
                            <SessionCard key={session.id} session={session} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No past sessions yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Session;