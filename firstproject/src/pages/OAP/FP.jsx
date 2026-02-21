// src/pages/FocusPeer/FocusPeerDashboard.jsx
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import SessionDetailModal from '../../components/FocusPeer/SessionDetailModal.jsx';
import SessionListItem from '../../components/FocusPeer/SessionListItem.jsx';

export default function FocusPeerDashboard() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, sessions, applications
  const [typeFilter, setTypeFilter] = useState('All Types'); // Study Support, Task Planning, Stress Management, General Check-In
  const [selectedSession, setSelectedSession] = useState(null);

  // Sample data matching screenshots
  const sessions = useMemo(() => ([
    {
      id: 's1',
      studentName: 'Ushna Batool',
      type: 'General Check-In',
      status: 'Scheduled',
      focusPeer: 'Marcus Chen',
      date: '2024-12-22',
      time: '15:00',
      duration: '1 hour',
      location: 'Online',
      rating: null,
      points: null,
      alertCreated: false,
      notes: ''
    },
    {
      id: 's2',
      studentName: 'Hassan Malik',
      type: 'Study Support',
      status: 'Scheduled',
      focusPeer: 'Layla Hassan',
      date: '2024-12-21',
      time: '11:00',
      duration: '1 hour',
      location: 'Student Center',
      rating: null,
      points: null,
      alertCreated: false,
      notes: ''
    },
    {
      id: 's3',
      studentName: 'Omar Ali',
      type: 'Task Planning',
      status: 'Completed',
      focusPeer: 'Marcus Chen',
      date: '2024-12-11',
      time: '16:00',
      duration: '1 hour',
      location: 'Student Lounge',
      rating: 4,
      points: 3,
      alertCreated: false,
      notes: 'Good progress; set next steps.'
    },
    {
      id: 's4',
      studentName: 'Zainab Ahmed',
      type: 'General Check-In',
      status: 'Completed',
      focusPeer: 'Asad Ali',
      date: '2024-12-10',
      time: '09:00',
      duration: '1 hour',
      location: 'Student Lounge',
      rating: 3,
      points: 2,
      alertCreated: true,
      notes: 'Student expressed overwhelm and attendance issues. Monitoring needed.'
    },
    {
      id: 's5',
      studentName: 'Hassan Malik',
      type: 'Study Support',
      status: 'Completed',
      focusPeer: 'Layla Hassan',
      date: '2024-12-09',
      time: '14:00',
      duration: '1 hour',
      location: 'Online',
      rating: 5,
      points: 4,
      alertCreated: false,
      notes: 'Excellent engagement.'
    }
  ]), []);

  // Derived counts
  const counts = useMemo(() => {
    const total = sessions.length;
    const completed = sessions.filter(s => s.status === 'Completed').length;
    const upcoming = sessions.filter(s => s.status === 'Scheduled').length;
    const alerts = sessions.filter(s => s.alertCreated).length;
    return { total, completed, upcoming, alerts };
  }, [sessions]);

  // Filtering
  const filtered = sessions.filter(s => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || (
      s.studentName.toLowerCase().includes(q) ||
      s.focusPeer.toLowerCase().includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q))
    );
    const matchesType = typeFilter === 'All Types' || s.type === typeFilter;
    return matchesQuery && matchesType;
  });

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
      {/* Header */}
      <div className="rounded-3xl p-4 bg-white flex items-center gap-5">
        <div className="flex flex-col">
          <h4 className="text-2xl font-semibold" style={{ color: '#B39DDB' }}>
            FocusPeer Sessions
          </h4>
          <p style={{ color: '#B39DDB' }}>Monitor focus peer sessions and applications</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-white border border-gray-100">
          <div className="text-sm text-gray-500">Total Sessions</div>
          <div className="text-2xl font-bold mt-2">{counts.total}</div>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-gray-100">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-2xl font-bold mt-2">{counts.completed}</div>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-gray-100">
          <div className="text-sm text-gray-500">Upcoming</div>
          <div className="text-2xl font-bold mt-2">{counts.upcoming}</div>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-gray-100">
          <div className="text-sm text-gray-500">Alerts Created</div>
          <div className="text-2xl font-bold mt-2 text-red-500">{counts.alerts}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 w-1/2">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by student name, focus peer, or feedback..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 mr-2">Filter:</div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white"
            >
              <option>All Types</option>
              <option>Study Support</option>
              <option>Task Planning</option>
              <option>Stress Management</option>
              <option>General Check-In</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setActiveFilter('sessions')}
            className={`px-4 py-2 rounded-full ${activeFilter === 'sessions' ? 'bg-[#B39DDB] text-white' : 'bg-white border border-gray-200'}`}
          >
            Sessions
          </button>
          <button
            onClick={() => setActiveFilter('applications')}
            className={`px-4 py-2 rounded-full ${activeFilter === 'applications' ? 'bg-[#B39DDB] text-white' : 'bg-white border border-gray-200'}`}
          >
            Applications
          </button>
        </div>

        {/* Session list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sessions found.</p>
          ) : (
            filtered.map(s => (
              <SessionListItem
                key={s.id}
                session={s}
                onOpen={() => setSelectedSession(s)}
              />
            ))
          )}
        </div>
      </div>

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
