import { Search, Bell } from 'lucide-react';
import { useState } from 'react';
import AlertCard from '../../components/CommunityComponents/AlertCard.jsx';
function Alerts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // 'open', 'in-progress', 'resolved', or ''

  const allAlerts = [
    {
      id: '1',
      studentName: 'Ushna Batool',
      status: 'open',
      title: 'Student struggling with assignment organization',
      raisedBy: 'Sarah Ahmed (Focus Peer)',
      date: '15/12/2024, 10:30:00',
      assignedTo: 'Dr. Fatima Khan',
      description: 'During our session, Ushna expressed feeling overwhelmed with multiple upcoming deadlines. She mentioned difficulty breaking down larger projects into manageable tasks. Recommend check-in with OAP advisor to discuss additional support strategies.'
    },
    {
      id: '2',
      studentName: 'Sara Hassan',
      status: 'in-progress',
      title: 'Increased anxiety about upcoming exams',
      raisedBy: 'Jordan Lee (Focus Peer)',
      date: '14/12/2024, 14:15:00',
      assignedTo: 'Dr. James Wilson',
      description: 'Sara has been showing signs of exam anxiety. Recommended relaxation techniques and study planning strategies.'
    },
    {
      id: '3',
      studentName: 'Zainab Ahmed',
      status: 'open',
      title: 'Missed multiple classes in Biology 405',
      raisedBy: 'Asad Ali (Focus Peer)',
      date: '10/12/2024, 09:20:00',
      assignedTo: 'Dr. Fatima Khan',
      description: 'Student has missed several Biology 405 lectures. Need to follow up on reasons and discuss attendance policy.'
    },
    {
      id: '4',
      studentName: 'Ali Zaidi',
      status: 'open',
      title: 'Student expressing burnout symptoms',
      raisedBy: 'Sarah Ahmed (Focus Peer)',
      date: '16/12/2024, 11:45:00',
      assignedTo: 'Sara Ali',
      description: 'Ali mentioned feeling exhausted and overwhelmed. Discussed workload management and self-care strategies.'
    },
    {
      id: '5',
      studentName: 'Fatima Khan',
      status: 'resolved',
      title: 'Struggling with time management',
      raisedBy: 'Jordan Lee (Focus Peer)',
      date: '08/12/2024, 16:00:00',
      assignedTo: 'Dr. Sarah Kim',
      description: 'Successfully connected with OAP advisor. Student now using time management tools.'
    }
  ];

  // Filter alerts by search and status
  const filteredAlerts = allAlerts.filter(alert => {
    const searchMatch = search === '' ||
      alert.studentName.toLowerCase().includes(search.toLowerCase()) ||
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.raisedBy.toLowerCase().includes(search.toLowerCase());

    const statusMatch = statusFilter === '' || alert.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // Count alerts by status
  const totalAlerts = allAlerts.length;
  const openAlerts = allAlerts.filter(a => a.status === 'open').length;
  const inProgressAlerts = allAlerts.filter(a => a.status === 'in-progress').length;
  const resolvedAlerts = allAlerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
      
      {/* Header */}
      <div className="rounded-3xl p-4 bg-white flex items-center gap-5">
        <Bell size={24} style={{ color: '#B39DDB' }} />
        <div className="flex flex-col">
          <h4 className="text-2xl font-semibold" style={{ color: '#B39DDB' }}>
            Focus Peer Alerts
          </h4>
          <p style={{ color: '#B39DDB' }}>Monitor and respond to alerts raised by focus peers for their students</p>
        </div>
      </div>

      {/* Status Cards (Clickable Filters) */}
      <div className="grid grid-cols-4 gap-4">
        <StatusCard
          icon=""
          count={totalAlerts}
          label="Total Alerts"
          isActive={statusFilter === ''}
          onClick={() => setStatusFilter('')}
          bgColor="bg-purple-100"
          borderColor="border-purple-300"
        />
        <StatusCard
          icon=""
          count={openAlerts}
          label="Open"
          status="open"
          isActive={statusFilter === 'open'}
          onClick={() => setStatusFilter('open')}
          bgColor="bg-red-100"
          borderColor="border-red-300"
        />
        <StatusCard
          icon=""
          count={inProgressAlerts}
          label="In Progress"
          status="in-progress"
          isActive={statusFilter === 'in-progress'}
          onClick={() => setStatusFilter('in-progress')}
          bgColor="bg-yellow-100"
          borderColor="border-yellow-300"
        />
        <StatusCard
          icon=""
          count={resolvedAlerts}
          label="Resolved"
          status="resolved"
          isActive={statusFilter === 'resolved'}
          onClick={() => setStatusFilter('resolved')}
          bgColor="bg-green-100"
          borderColor="border-green-300"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-6">
        <div className='flex items-center gap-3 pb-4 px-4 py-3 bg-gray-50 rounded-2xl'>
          <Search size={20} className='text-gray-400' />
          <input
            type='text'
            placeholder='Search by student name, alert title, or focus peer...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 border border-gray-300 text-gray-700 placeholder-gray-400 bg-transparent rounded-2xl'
          />
        </div>

        {/* Alert Cards */}
        <div className='mt-6 space-y-4'>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <p className='text-gray-500 text-center py-8'>
              No alerts found matching your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Status Card Component (Clickable Filter)
function StatusCard({ icon, count, label, status, isActive, onClick, bgColor, borderColor }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-4 text-center transition-all cursor-pointer ${
        isActive
          ? `${bgColor} border-2 ${borderColor}`
          : 'bg-white border-2 border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold" style={{ color: isActive ? '#333' : '#666' }}>
        {count}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </button>
  );
}

export default Alerts;