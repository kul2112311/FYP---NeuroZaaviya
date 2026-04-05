import { useState, useEffect } from 'react';
import { Users, FileText, Bell, AlertCircle, Calendar, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function EhsasDashboard() {
  const navigate = useNavigate();

  const recentAlerts = [
    { id: 1, studentName: "Ushna Batool",  issue: "Student struggling with assignment organization", reportedBy: "Sarah Ahmed",  date: "2024-12-15 10:30:00" },
    { id: 2, studentName: "Sara Hassan",   issue: "Increased anxiety about upcoming exams",          reportedBy: "Jordan Lee",   date: "2024-12-14 14:15:00" },
    { id: 3, studentName: "Zainab Ahmed",  issue: "Missed multiple classes in Biology 405",          reportedBy: "Asad Ali",     date: "2024-12-10 09:20:00" },
    { id: 4, studentName: "Ali Zaidi",     issue: "Student expressing burnout symptoms",             reportedBy: "Sarah Ahmed",  date: "2024-12-16 11:45:00" },
  ];

  // ── Live count of pending Focus Peer applications ─────────────────────────
  const [pendingFPCount, setPendingFPCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      try {
        const saved = localStorage.getItem("accessRequests");
        const all = saved ? JSON.parse(saved) : [];
        const count = all.filter(r => r.role === "focuspeer" && r.status === "pending").length;
        setPendingFPCount(count);
      } catch { setPendingFPCount(0); }
    };
    refresh();
    // Re-check whenever another tab/action updates localStorage
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  const openAlerts = recentAlerts.length;

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw', minHeight: '100vh', background: '#f3eeff' }}>

      {/* Welcome Header */}
      <div className="rounded-3xl p-6 bg-white">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#2d2d3a' }}>
            Welcome back, Sara Ali! 👋
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
        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ede7f6' }}>
              <Users size={20} style={{ color: '#9575cd' }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: '#2d2d3a' }}>8</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>Active Students</p>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fce4ec' }}>
              <FileText size={20} style={{ color: '#e91e8c' }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: '#2d2d3a' }}>11</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>Active Accommodations</p>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fff3e0' }}>
              <Bell size={20} style={{ color: '#fb8c00' }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: '#2d2d3a' }}>4</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>Open Alerts</p>
        </div>

        {/* ── Focus Peer Applications card — clickable, live count ── */}
        <button
          onClick={() => navigate('/ehsas-fp-management')}
          className="rounded-2xl p-5 bg-white border shadow-sm text-left transition-all hover:shadow-md"
          style={{
            borderColor: pendingFPCount > 0 ? 'rgba(179,157,219,0.5)' : '#f3f4f6',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          {/* Red dot badge if there are pending applications */}
          {pendingFPCount > 0 && (
            <span style={{
              position: 'absolute', top: 12, right: 12,
              background: '#ef4444', color: '#fff',
              fontSize: 10, fontWeight: 700,
              borderRadius: 999, padding: '2px 7px',
              lineHeight: 1.4,
            }}>
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
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={18} style={{ color: '#fb8c00' }} />
              <h2 className="text-base font-semibold" style={{ color: '#2d2d3a' }}>Recent Alerts</h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#fff3e0', color: '#fb8c00' }}>
              {openAlerts} Open
            </span>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl p-4 flex items-start gap-3"
                style={{ backgroundColor: '#fdf6ff', border: '1px solid #f0e6ff' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#fff3e0' }}>
                  <AlertCircle size={18} style={{ color: '#fb8c00' }} />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm" style={{ color: '#2d2d3a' }}>{alert.studentName}</span>
                  <p className="text-xs mt-0.5 mb-1" style={{ color: '#5a5a72' }}>{alert.issue}</p>
                  <p className="text-xs" style={{ color: '#a0a0b0' }}>by {alert.reportedBy} • {alert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#ede7f6' }}>
              <Calendar size={28} style={{ color: '#b39ddb' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#a0a0b0' }}>No upcoming meetings scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EhsasDashboard;