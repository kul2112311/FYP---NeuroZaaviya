import { Users, FileText, Bell, AlertCircle, Calendar } from 'lucide-react';

function WellnessDashboard() {
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
    <div className="p-6 pl-12 space-y-6 w-full "style={{ width: '80vw' }}>
      {/* Welcome Header */}
      <div className="rounded-3xl p-6 bg-white  ">
        
        <div className='flex flex-col' >
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#B39DDB' }}>
          Welcome back, Sara Ali! 👋
          </h1>
          <p className="text-sm mb-1" style={{ color: '#B39DDB' }}>
            Ehsas Counselor • Ehsas Support Services
          </p>
          <p className="text-xs" style={{ color: '#B39DDB' }}>
            Here's an overview of student support activities
          </p>
        </div>
        
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Active Students */}
        <div className="rounded-2xl p-5 bg-white" >
          <div className="flex items-center justify-between">
            <Users size={24} style={{ color: '#B39DDB' }} />
            <span className="text-3xl font-bold" style={{ color: '#B39DDB' }}>8</span>
          </div>
          <p className="text-sm mt-3" style={{ color: '#B39DDB' }}>Active Students</p>
        </div>

        {/* Active Accommodations */}
        <div className="rounded-2xl p-5 bg-white" >
          <div className="flex items-center justify-between">
            <FileText size={24} style={{ color: '#FFB6C1' }} />
            <span className="text-3xl font-bold" style={{ color: '#FFB6C1' }}>11</span>
          </div>
          <p className="text-sm mt-3" style={{ color: '#FFB6C1' }}>Active Accommodations</p>
        </div>

        {/* Open Alerts */}
        <div className="rounded-2xl p-5 bg-white" >
          <div className="flex items-center justify-between">
            <Bell size={24} style={{ color: '#B39DDB' }} />
            <span className="text-3xl font-bold" style={{ color: '#B39DDB' }}>4</span>
          </div>
          <p className="text-sm mt-3" style={{ color: '#B39DDB' }}>Open Alerts</p>
        </div>
      </div>

      {/* Bottom Row - Alerts and Meetings */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={20} style={{ color: '#B39DDB' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#B39DDB' }}>Recent Alerts</h2>
            </div>
            <span className="text-sm" style={{ color: '#B39DDB' }}>{openAlerts} Open</span>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{ backgroundColor: 'rgba(179, 157, 219, 0.05)' }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255, 200, 100, 0.15)' }}
                >
                  <AlertCircle size={20} style={{ color: '#FFC864' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: '#B39DDB' }}>
                      {alert.studentName}
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: '#B39DDB' }}>
                    {alert.issue}
                  </p>
                  <p className="text-xs opacity-70" style={{ color: '#B39DDB' }}>
                    by {alert.reportedBy} • {alert.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} style={{ color: '#B39DDB' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#B39DDB' }}>Upcoming Meetings</h2>
            </div>
            <span className="text-sm" style={{ color: '#B39DDB' }}>0 Scheduled</span>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: 'rgba(179, 157, 219, 0.1)' }}
            >
              <Calendar size={32} style={{ color: '#B39DDB' }} />
            </div>
            <p className="text-sm" style={{ color: '#B39DDB' }}>No upcoming meetings scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WellnessDashboard;