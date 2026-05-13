import { Users, FileText, Bell, AlertCircle, Calendar, UserPlus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../../styles/SignInLandingPage/usercontext.jsx';

function EhsasDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [pendingFPCount, setPendingFPCount] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [stats, setStats] = useState({
    activeStudents: 0,
    activeAccommodations: 0,
    openAlerts: 0,
    recentAlerts: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch FP Requests
        const reqRes = await fetch('https://fyp-neuro-zaaviya-server-01.vercel.app/api/requests');
        if (reqRes.ok) {
          const data = await reqRes.json();
          setPendingFPCount(data.filter(r => (r.role === 'focuspeer' || r.role === 'focus-peer') && r.status === 'pending').length);
        }
        
        // Fetch Dashboard Stats
        const statsRes = await fetch('https://fyp-neuro-zaaviya-server-01.vercel.app/api/admin/dashboard-stats');
        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        // ✨ ADD THIS FETCH:
        const meetRes = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/appointments/staff/${user.id}`);
        if (meetRes.ok) {
          setUpcomingMeetings(await meetRes.json());
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000); // Live update every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw', minHeight: '100vh', background: '#f3eeff' }}>

      {/* Welcome Header */}
      <div className="rounded-3xl p-6 bg-white">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#2d2d3a' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Counselor'}! 👋
          </h1>
          <p className="text-sm mb-1 font-medium" style={{ color: '#9575cd' }}>
            Ehsas Counselor • Ehsas Support Services
          </p>
          <p className="text-xs" style={{ color: '#a0a0b0' }}>
            Here's an overview of student support activities
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-4 gap-4">

        {/* Active Students */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ede7f6' }}>
              <Users size={20} style={{ color: '#9575cd' }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: '#2d2d3a' }}>{stats.activeStudents}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>Active Students</p>
        </div>

        {/* Active Accommodations */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fce4ec' }}>
              <FileText size={20} style={{ color: '#e91e8c' }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: '#2d2d3a' }}>{stats.activeAccommodations}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>Active Accommodations</p>
        </div>

        {/* Open Alerts */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fff3e0' }}>
              <Bell size={20} style={{ color: '#fb8c00' }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: '#2d2d3a' }}>{stats.openAlerts}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>Open Alerts</p>
        </div>

        {/* FP Applications */}
        <button
          onClick={() => navigate('/ehsas-fp-management')}
          className="rounded-2xl p-5 bg-white border shadow-sm text-left transition-all hover:shadow-md"
          style={{ borderColor: pendingFPCount > 0 ? 'rgba(179,157,219,0.5)' : '#f3f4f6', position: 'relative', cursor: 'pointer' }}
        >
          {pendingFPCount > 0 && (
            <span style={{ position: 'absolute', top: 12, right: 12, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 7px' }}>
              {pendingFPCount} new
            </span>
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(179,157,219,0.15)' }}>
              <UserPlus size={20} style={{ color: '#b39ddb' }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: pendingFPCount > 0 ? '#b39ddb' : '#2d2d3a' }}>
              {pendingFPCount}
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>FP Applications</p>
        </button>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">

        {/* Recent Alerts */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={18} style={{ color: '#fb8c00' }} />
              <h2 className="text-base font-semibold" style={{ color: '#2d2d3a' }}>Recent Alerts</h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#fff3e0', color: '#fb8c00' }}>
              {stats.openAlerts} Open
            </span>
          </div>

          <div className="space-y-3">
            {stats.recentAlerts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-8">
                 <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>No recent alerts to display.</p>
               </div>
            ) : (
              stats.recentAlerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl p-4 flex items-start gap-3" style={{ backgroundColor: '#fdf6ff', border: '1px solid #f0e6ff' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fff3e0' }}>
                    <AlertCircle size={18} style={{ color: '#fb8c00' }} />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm" style={{ color: '#2d2d3a' }}>{alert.studentName}</span>
                    <p className="text-xs mt-0.5 mb-1" style={{ color: '#5a5a72' }}>{alert.issue}</p>
                    <p className="text-xs" style={{ color: '#a0a0b0' }}>by {alert.reportedBy} • {alert.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: '#9575cd' }} />
              <h2 className="text-base font-semibold" style={{ color: '#2d2d3a' }}>Upcoming Meetings</h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#ede7f6', color: '#9575cd' }}>
              {upcomingMeetings.length} Scheduled
            </span>
          </div>

          {upcomingMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#ede7f6' }}>
                <Calendar size={28} style={{ color: '#b39ddb' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>No upcoming meetings scheduled</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#ede7f6' }}>
                    <Calendar size={18} style={{ color: '#9575cd' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">{meeting.student_name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      {/* Just reading the exact output from your SQL query! */}
                      <span className="flex items-center gap-1"><Calendar size={12}/> {meeting.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {meeting.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EhsasDashboard;  