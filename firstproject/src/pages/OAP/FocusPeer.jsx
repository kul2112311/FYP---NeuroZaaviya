import { useState, useMemo,useEffect } from "react";
import { Search, Heart, CalendarDays, CheckCircle2, Clock, AlertCircle, UserPlus, FileText, CheckCheck, X } from "lucide-react";
import SessionDetailModal from "./Components/SessionModal.jsx";
import SessionListItem from "./Components/SessionList.jsx";

export default function FocusPeerDashboard() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('sessions');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedSession, setSelectedSession] = useState(null);
  const [cardFilter, setCardFilter] = useState(null);
  const [appCardFilter, setAppCardFilter] = useState(null);
  
  // remove the useMemo sessions block and replace with:
const [sessions, setSessions] = useState([]);

useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/focus-peers-oap`)
        .then(res => res.json())
        .then(data => {
            console.log('RAW DATA FROM API:', data); // ← add this
            console.log('FIRST ROW:', data[0]);       // ← and this
            const mapped = data.map(s => {
                const calcDuration = (start, end) => {
                    if (!start || !end) return '1 hour';
                    const [sh, sm] = start.split(':').map(Number);
                    const [eh, em] = end.split(':').map(Number);
                    const mins = (eh * 60 + em) - (sh * 60 + sm);
                    return mins === 60 ? '1 hour' : `${mins} mins`;
                };
                return {
                    id: s.id,
                    studentName: s.studentName,
                    studentEmail: s.studentEmail,
                    studentId: s.studentId,
                    focusPeer: s.focusPeer,
                    date: s.date,
                    time: s.time,
                    duration: calcDuration(s.time, s.endTime),
                    status: s.status === 'completed' ? 'Completed' : 'Scheduled',
                    notes: s.notes || '',
                    type: 'General Check-In',
                    alertCreated: false,
                    rating: null,
                    points: null,
                };
            });
            console.log('MAPPED:', mapped[0]); // ← and this
            setSessions(mapped);
        })
        .catch(err => console.error("Fetch error:", err));
}, []);
  const [applications, setApplications] = useState([
    {
      id: 'app1',
      name: 'Sara Qureshi',
      email: 'sq06344@st.habibuniversity.edu.pk',
      studentId: '06344',
      status: 'Pending',
      appliedDate: '2024-12-01',
      reason: 'I want to support my peers and help them stay on track academically.'
    },
    {
      id: 'app2',
      name: 'Ali Raza',
      email: 'ar04108@st.habibuniversity.edu.pk',
      studentId: '04108',
      status: 'Approved',
      appliedDate: '2024-11-20',
      reason: 'I have experience mentoring juniors and would love to contribute formally.'
    },
    {
      id: 'app3',
      name: 'Fatima Noor',
      email: 'fn05501@st.habibuniversity.edu.pk',
      studentId: '05501',
      status: 'Pending',
      appliedDate: '2024-12-05',
      reason: 'Passionate about mental health awareness and peer support.'
    },
    {
      id: 'app4',
      name: 'Bilal Siddiqui',
      email: 'bs03990@st.habibuniversity.edu.pk',
      studentId: '03990',
      status: 'Rejected',
      appliedDate: '2024-11-15',
      reason: 'Would like to give back to the university community.'
    },
    {
      id: 'app5',
      name: 'Mariam Khalid',
      email: 'mk04762@st.habibuniversity.edu.pk',
      studentId: '04762',
      status: 'Approved',
      appliedDate: '2024-11-28',
      reason: 'Strong communicator, eager to help neurodivergent students thrive.'
    }
  ]);

  const updateAppStatus = (id, newStatus) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
  };

  const counts = useMemo(() => ({
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'Completed').length,
    upcoming: sessions.filter(s => s.status === 'Scheduled').length,
    alerts: sessions.filter(s => s.alertCreated).length,
  }), [sessions]);

  const appCounts = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  }), [applications]);

  const handleCardFilter = (type) => setCardFilter(prev => prev === type ? null : type);
  const handleAppCardFilter = (type) => setAppCardFilter(prev => prev === type ? null : type);

  const filtered = sessions.filter(s => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || (
      s.studentName.toLowerCase().includes(q) ||
      s.focusPeer.toLowerCase().includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q))
    );
    const matchesType = typeFilter === 'All Types' || s.type === typeFilter;
    const matchesCard =
      !cardFilter || cardFilter === 'total' ||
      (cardFilter === 'completed' && s.status === 'Completed') ||
      (cardFilter === 'upcoming' && s.status === 'Scheduled') ||
      (cardFilter === 'alerts' && s.alertCreated);
    return matchesQuery && matchesType && matchesCard;
  });

  const filteredApps = applications.filter(a => {
    const matchesCard =
      !appCardFilter || appCardFilter === 'total' ||
      (appCardFilter === 'pending' && a.status === 'Pending') ||
      (appCardFilter === 'approved' && a.status === 'Approved') ||
      (appCardFilter === 'rejected' && a.status === 'Rejected');
    return matchesCard;
  });

  const TYPE_FILTERS = ['All Types', 'Study Support', 'Task Planning', 'Stress Management', 'General Check-In'];

  const cardBase = "rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md";
  const activeRing = "ring-2 ring-offset-1";

  const STATUS_STYLES = {
    Pending:  { bg: '#fff8e1', text: '#f59e0b' },
    Approved: { bg: '#e8f5e9', text: '#43a047' },
    Rejected: { bg: '#fce4ec', text: '#e53935' },
  };

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>

      {/* Header */}
      <div className="rounded-3xl p-5 bg-white flex items-center gap-4">
        <Heart size={26} style={{ color: '#B39DDB' }} />
        <div>
          <h4 className="text-2xl font-semibold" style={{ color: '#B39DDB' }}>Focus Peer Sessions</h4>
          <p className="text-sm" style={{ color: '#B39DDB' }}>
            Monitor focus peer activities, session feedback, and student support
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex items-center gap-3">
        <button
          onClick={() => { setActiveFilter('sessions'); setCardFilter(null); }}
          className="px-5 py-2 rounded-full text-sm font-medium transition-colors"
          style={activeFilter === 'sessions'
            ? { backgroundColor: '#B39DDB', color: 'white' }
            : { backgroundColor: 'white', color: '#555', border: '1px solid #e5e7eb' }}
        >
          Sessions
        </button>
        <button
          onClick={() => { setActiveFilter('applications'); setAppCardFilter(null); }}
          className="px-5 py-2 rounded-full text-sm font-medium transition-colors"
          style={activeFilter === 'applications'
            ? { backgroundColor: '#B39DDB', color: 'white' }
            : { backgroundColor: 'white', color: '#555', border: '1px solid #e5e7eb' }}
        >
          Applications
        </button>
      </div>

      {/* ── SESSIONS VIEW ── */}
      {activeFilter === 'sessions' && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div
              onClick={() => handleCardFilter('total')}
              className={`${cardBase} border border-purple-100 ${cardFilter === 'total' ? `${activeRing} ring-purple-300` : ''}`}
              style={{ background: 'linear-gradient(135deg, #ede7f6 0%, #e8eaf6 100%)' }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#B39DDB' }}>
                <CalendarDays size={20} color="white" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#5e35b1' }}>{counts.total}</div>
                <div className="text-sm" style={{ color: '#7e57c2' }}>Total Sessions</div>
              </div>
            </div>

            <div
              onClick={() => handleCardFilter('completed')}
              className={`${cardBase} border border-green-100 ${cardFilter === 'completed' ? `${activeRing} ring-green-300` : ''}`}
              style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#66bb6a' }}>
                <CheckCircle2 size={20} color="white" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#2e7d32' }}>{counts.completed}</div>
                <div className="text-sm" style={{ color: '#388e3c' }}>Completed</div>
              </div>
            </div>

            <div
              onClick={() => handleCardFilter('upcoming')}
              className={`${cardBase} border border-blue-100 ${cardFilter === 'upcoming' ? `${activeRing} ring-blue-300` : ''}`}
              style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)' }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#42a5f5' }}>
                <Clock size={20} color="white" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#1565c0' }}>{counts.upcoming}</div>
                <div className="text-sm" style={{ color: '#1976d2' }}>Upcoming</div>
              </div>
            </div>

            <div
              onClick={() => handleCardFilter('alerts')}
              className={`${cardBase} border border-orange-100 ${cardFilter === 'alerts' ? `${activeRing} ring-red-300` : ''}`}
              style={{ background: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)' }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ef5350' }}>
                <AlertCircle size={20} color="white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{counts.alerts}</div>
                <div className="text-sm text-gray-500">Alerts Created</div>
              </div>
            </div>
          </div>

          {cardFilter && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Filtering by: <span className="font-medium" style={{ color: '#B39DDB' }}>
                {cardFilter === 'total' ? 'All Sessions' :
                 cardFilter === 'completed' ? 'Completed' :
                 cardFilter === 'upcoming' ? 'Upcoming' : 'Alerts Created'}
              </span></span>
              <button onClick={() => setCardFilter(null)} className="text-xs px-2 py-0.5 rounded-full border border-gray-200 hover:bg-gray-100">Clear ✕</button>
            </div>
          )}

          <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100 space-y-4">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by student name, focus peer, or feedback..."
                className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {TYPE_FILTERS.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={typeFilter === type
                    ? { backgroundColor: '#B39DDB', color: 'white' }
                    : { backgroundColor: 'white', color: '#555', border: '1px solid #e5e7eb' }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">No sessions found.</div>
            ) : (
              filtered.map(s => (
                <SessionListItem key={s.id} session={s} onOpen={() => setSelectedSession(s)} />
              ))
            )}
          </div>
        </>
      )}

      {/* ── APPLICATIONS VIEW ── */}
      {activeFilter === 'applications' && (
        <>
          <div className="rounded-2xl p-5 border border-gray-100 flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, #ede7f6 0%, #e8eaf6 100%)' }}
          >
            <UserPlus size={24} style={{ color: '#7e57c2' }} />
            <div>
              <div className="font-semibold text-gray-800">Focus Peer Applications</div>
              <div className="text-sm" style={{ color: '#7e57c2' }}>
                Review and manage applications from students who want to become Focus Peers
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div
              onClick={() => handleAppCardFilter('total')}
              className={`${cardBase} border border-purple-100 justify-between ${appCardFilter === 'total' ? `${activeRing} ring-purple-300` : ''}`}
              style={{ background: 'linear-gradient(135deg, #ede7f6 0%, #e8eaf6 100%)' }}
            >
              <div>
                <div className="text-2xl font-bold" style={{ color: '#5e35b1' }}>{appCounts.total}</div>
                <div className="text-sm" style={{ color: '#7e57c2' }}>Total Applications</div>
              </div>
              <UserPlus size={22} style={{ color: '#B39DDB' }} />
            </div>

            <div
              onClick={() => handleAppCardFilter('pending')}
              className={`${cardBase} border border-yellow-100 justify-between ${appCardFilter === 'pending' ? `${activeRing} ring-yellow-300` : ''}`}
              style={{ background: 'linear-gradient(135deg, #fffde7 0%, #fff8e1 100%)' }}
            >
              <div>
                <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{appCounts.pending}</div>
                <div className="text-sm" style={{ color: '#b45309' }}>Pending Review</div>
              </div>
              <FileText size={22} style={{ color: '#f59e0b' }} />
            </div>

            <div
              onClick={() => handleAppCardFilter('approved')}
              className={`${cardBase} border border-green-100 justify-between ${appCardFilter === 'approved' ? `${activeRing} ring-green-300` : ''}`}
              style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' }}
            >
              <div>
                <div className="text-2xl font-bold" style={{ color: '#2e7d32' }}>{appCounts.approved}</div>
                <div className="text-sm" style={{ color: '#388e3c' }}>Approved</div>
              </div>
              <CheckCheck size={22} style={{ color: '#66bb6a' }} />
            </div>

            <div
              onClick={() => handleAppCardFilter('rejected')}
              className={`${cardBase} border border-red-100 justify-between ${appCardFilter === 'rejected' ? `${activeRing} ring-red-300` : ''}`}
              style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #fff5f5 100%)' }}
            >
              <div>
                <div className="text-2xl font-bold text-red-500">{appCounts.rejected}</div>
                <div className="text-sm text-red-400">Rejected</div>
              </div>
              <X size={22} className="text-red-400" />
            </div>
          </div>

          {appCardFilter && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Filtering by: <span className="font-medium" style={{ color: '#B39DDB' }}>
                {appCardFilter === 'total' ? 'All Applications' :
                 appCardFilter === 'pending' ? 'Pending Review' :
                 appCardFilter === 'approved' ? 'Approved' : 'Rejected'}
              </span></span>
              <button onClick={() => setAppCardFilter(null)} className="text-xs px-2 py-0.5 rounded-full border border-gray-200 hover:bg-gray-100">Clear ✕</button>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} style={{ color: '#B39DDB' }} />
              <span className="font-semibold text-gray-700">Applications</span>
            </div>

            {filteredApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <UserPlus size={48} />
                <p className="mt-3 text-sm">No applications found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApps.map(app => {
                  const style = STATUS_STYLES[app.status];
                  return (
                    <div key={app.id} className="rounded-xl border border-gray-100 p-4 flex items-start justify-between gap-4">
                      {/* Left: avatar + info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                          style={{ backgroundColor: '#ede7f6', color: '#7e57c2' }}
                        >
                          {app.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 text-sm">{app.name}</div>
                          <div className="text-xs text-gray-500">{app.email} • ID: {app.studentId}</div>
                          <div className="text-xs text-gray-400 mt-1 truncate">Applied: {new Date(app.appliedDate).toLocaleDateString()} • {app.reason}</div>
                        </div>
                      </div>

                      {/* Right: status badge + action buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {app.status}
                        </span>

                        {/* Only show buttons if not already in that state */}
                        {app.status !== 'Approved' && (
                          <button
                            onClick={() => updateAppStatus(app.id, 'Approved')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#66bb6a' }}
                          >
                            <CheckCheck size={13} />
                            Approve
                          </button>
                        )}
                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => updateAppStatus(app.id, 'Rejected')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#ef5350' }}
                          >
                            <X size={13} />
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {selectedSession && (
        <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}
    </div>
  );
}