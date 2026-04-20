import { useState, useEffect } from 'react';
import { Users, FileText, Bell, AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { useUser } from '../../styles/SignInLandingPage/usercontext.jsx';

function OAPDashboard() {
  const { user } = useUser();

  // 1. Real State! Starting empty because our database is clean.
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [stats, setStats] = useState({
    activeStudents: 0,
    pendingFiles: 0,
    availablePeers: 0
  });

  // Future-proofing: This is where we will fetch from the backend later
  /*
  useEffect(() => {
    fetch('/api/oap/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        setRecentAlerts(data.alerts);
        setStats(data.stats);
      });
  }, []);
  */

  const openAlerts = recentAlerts.length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#2d2d3a' }}>
            Welcome back, {user?.name || 'Admin'}!
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9575a3' }}>Here is your live overview of the student body.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-sm font-semibold" style={{ color: '#5a4a61' }}>
            <FileText size={16} />
            Generate Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: '#b39ddb' }}>
            <Bell size={16} />
            Send Announcement
          </button>
        </div>
      </div>

      {/* Quick Stats - Now reflecting reality (Zeros!) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: '#ede7f6' }}>
              <Users size={24} style={{ color: '#9575cd' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#9575a3' }}>Active Students</p>
              <p className="text-2xl font-bold" style={{ color: '#2d2d3a' }}>{stats.activeStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: '#fff3e0' }}>
              <FileText size={24} style={{ color: '#ffb74d' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#9575a3' }}>Pending Files</p>
              <p className="text-2xl font-bold" style={{ color: '#2d2d3a' }}>{stats.pendingFiles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: '#e8f5e9' }}>
              <Users size={24} style={{ color: '#81c784' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#9575a3' }}>Available Focus Peers</p>
              <p className="text-2xl font-bold" style={{ color: '#2d2d3a' }}>{stats.availablePeers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: '#ffebee' }}>
              <AlertCircle size={24} style={{ color: '#e57373' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#9575a3' }}>Open Alerts</p>
              <p className="text-2xl font-bold" style={{ color: '#2d2d3a' }}>{openAlerts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Alerts List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell size={20} style={{ color: '#e57373' }} />
              <h2 className="text-lg font-bold" style={{ color: '#2d2d3a' }}>Recent Alerts</h2>
            </div>
          </div>
          
          {/* 2. Dynamic Rendering: If empty, show the "All Clear" state! */}
          {recentAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#e8f5e9' }}>
                <CheckCircle size={28} style={{ color: '#81c784' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#5a4a61' }}>No active alerts</p>
              <p className="text-xs mt-1" style={{ color: '#9575a3' }}>All student systems are currently nominal.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAlerts.map(alert => (
                <div key={alert.id} className="flex gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#ffebee' }}>
                    <AlertCircle size={18} style={{ color: '#e57373' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-sm" style={{ color: '#2d2d3a' }}>{alert.studentName}</h3>
                      <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ background: '#ffebee', color: '#e57373' }}>
                        High Priority
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: '#5a4a61' }}>{alert.issue}</p>
                    <p className="text-xs" style={{ color: '#a0a0b0' }}>by {alert.reportedBy} • {alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: '#9575cd' }} />
              <h2 className="text-base font-semibold" style={{ color: '#2d2d3a' }}>Upcoming Meetings</h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#ede7f6', color: '#9575cd' }}>
              0 Scheduled
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#ede7f6' }}>
              <Calendar size={28} style={{ color: '#b39ddb' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#5a4a61' }}>No upcoming meetings</p>
            <p className="text-xs mt-1" style={{ color: '#9575a3' }}>Your schedule is clear for today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OAPDashboard;