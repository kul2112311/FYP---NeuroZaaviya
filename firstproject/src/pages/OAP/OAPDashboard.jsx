import { Users, FileText, Bell, AlertCircle, Calendar } from 'lucide-react';

function OapDashboard() {
  // Dummy data for alerts
  const recentAlerts = [
    {
      id: 1,
      studentName: "Ushna Batool",
      issue: "Student struggling with assignment organization",
      reportedBy: "Sarah Ahmed",
      date: "2024-12-15 10:30:00"
    },
    {
      id: 2,
      studentName: "Sara Hassan",
      issue: "Increased anxiety about upcoming exams",
      reportedBy: "Jordan Lee",
      date: "2024-12-14 14:15:00"
    },
    {
      id: 3,
      studentName: "Zainab Ahmed",
      issue: "Missed multiple classes in Biology 405",
      reportedBy: "Asad Ali",
      date: "2024-12-10 09:20:00"
    },
    {
      id: 4,
      studentName: "Ali Zaidi",
      issue: "Student expressing burnout symptoms",
      reportedBy: "Sarah Ahmed",
      date: "2024-12-16 11:45:00"
    }
  ];

  const openAlerts = recentAlerts.length;

  return (
    <div className="p-6 pl-12 space-y-6 w-full" style={{ width: '80vw' }}>
      {/* Welcome Header */}
      <div className="rounded-3xl p-6 bg-white border-2" style={{ borderColor: '#E1BEE7' }}>
        <div className='flex flex-col'>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#5A4A61' }}>
            Welcome back, Sara Ali! 👋
          </h1>
          <p className="text-sm font-semibold mb-1" style={{ color: '#CE93D8' }}>
            OAP Counselor • OAP Support Services
          </p>
          <p className="text-xs opacity-80" style={{ color: '#5A4A61' }}>
            Here's an overview of student support activities
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Active Students */}
        <div className="rounded-2xl p-5 bg-white border-2" style={{ borderColor: '#B3DDB9' }}>
          <div className="flex items-center justify-between">
            <Users size={24} style={{ color: '#B3DDB9' }} />
            <span className="text-3xl font-bold" style={{ color: '#5A4A61' }}>8</span>
          </div>
          <p className="text-sm mt-3 font-bold" style={{ color: '#5A4A61' }}>Active Students</p>
        </div>

        {/* Active Accommodations */}
        <div className="rounded-2xl p-5 bg-white border-2" style={{ borderColor: '#CE93D8' }}>
          <div className="flex items-center justify-between">
            <FileText size={24} style={{ color: '#CE93D8' }} />
            <span className="text-3xl font-bold" style={{ color: '#5A4A61' }}>11</span>
          </div>
          <p className="text-sm mt-3 font-bold" style={{ color: '#5A4A61' }}>Active Accommodations</p>
        </div>

        {/* Open Alerts */}
        <div className="rounded-2xl p-5 bg-white border-2" style={{ borderColor: '#E1BEE7' }}>
          <div className="flex items-center justify-between">
            <Bell size={24} style={{ color: '#E1BEE7' }} />
            <span className="text-3xl font-bold" style={{ color: '#5A4A61' }}>4</span>
          </div>
          <p className="text-sm mt-3 font-bold" style={{ color: '#5A4A61' }}>Open Alerts</p>
        </div>
      </div>

      {/* Bottom Row - Alerts and Meetings */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-3xl p-6 border-2 shadow-sm" style={{ borderColor: '#E1BEE7' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={20} style={{ color: '#CE93D8' }} />
              <h2 className="text-lg font-bold" style={{ color: '#5A4A61' }}>Recent Alerts</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#E1BEE7', color: '#5A4A61' }}>
              {openAlerts} Open
            </span>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="rounded-2xl p-4 flex items-start gap-3 border transition-colors hover:border-[#B3DDB9]"
                style={{ backgroundColor: '#FDFCFD', borderColor: '#F5F5F5' }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#E1BEE730' }}
                >
                  <AlertCircle size={20} style={{ color: '#CE93D8' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm" style={{ color: '#5A4A61' }}>
                      {alert.studentName}
                    </span>
                  </div>
                  <p className="text-xs mb-1 font-medium" style={{ color: '#5A4A61' }}>
                    {alert.issue}
                  </p>
                  <p className="text-[10px] font-semibold opacity-60" style={{ color: '#CE93D8' }}>
                    by {alert.reportedBy} • {alert.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-3xl p-6 border-2 shadow-sm" style={{ borderColor: '#B3DDB9' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} style={{ color: '#B3DDB9' }} />
              <h2 className="text-lg font-bold" style={{ color: '#5A4A61' }}>Upcoming Meetings</h2>
            </div>
            <span className="text-sm font-medium" style={{ color: '#5A4A61' }}>0 Scheduled</span>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#B3DDB920' }}
            >
              <Calendar size={32} style={{ color: '#B3DDB9' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#5A4A61' }}>No upcoming meetings scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OapDashboard;